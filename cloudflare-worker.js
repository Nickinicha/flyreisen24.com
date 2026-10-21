const ALLOWED_ORIGINS = [
  'https://www.flyreisen24.com',
  'https://flyreisen24.com',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

const MAX_BODY_BYTES = 20000;
const MAX_TOKENS = 4000;
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 12;
const hits = new Map();

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

function rateLimited(ip) {
  var now = Date.now();
  var row = hits.get(ip) || { start: now, count: 0 };
  if (now - row.start > RATE_WINDOW_MS) row = { start: now, count: 0 };
  row.count += 1;
  hits.set(ip, row);
  return row.count > RATE_MAX;
}

export default {
  async fetch(request, env) {
    var origin = request.headers.get('Origin') || '';
    var allowed = ALLOWED_ORIGINS.indexOf(origin) !== -1;
    var cors = corsHeaders(allowed ? origin : ALLOWED_ORIGINS[0]);

    if (request.method === 'OPTIONS') {
      if (!allowed) return new Response(null, { status: 403, headers: cors });
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    if (!allowed) {
      return new Response(JSON.stringify({
        type: 'error',
        error: { type: 'forbidden', message: 'Origin not allowed' }
      }), { status: 403, headers: { 'Content-Type': 'application/json', ...cors } });
    }

    if (rateLimited(clientIp(request))) {
      return new Response(JSON.stringify({
        type: 'error',
        error: { type: 'rate_limited', message: 'Too many requests' }
      }), { status: 429, headers: { 'Content-Type': 'application/json', ...cors } });
    }

    var apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        type: 'error',
        error: { type: 'configuration_error', message: 'Worker secret ANTHROPIC_API_KEY not set' }
      }), { status: 500, headers: { 'Content-Type': 'application/json', ...cors } });
    }

    var body = await request.text();
    if (body.length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({
        type: 'error',
        error: { type: 'payload_too_large', message: 'Request too large' }
      }), { status: 413, headers: { 'Content-Type': 'application/json', ...cors } });
    }

    var parsed;
    try { parsed = JSON.parse(body); } catch (e) {
      return new Response(JSON.stringify({
        type: 'error',
        error: { type: 'invalid_json', message: 'Invalid JSON' }
      }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors } });
    }
    if (!parsed.max_tokens || parsed.max_tokens > MAX_TOKENS) parsed.max_tokens = MAX_TOKENS;

    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(parsed)
    });

    var contentType = response.headers.get('content-type') || 'application/json';
    return new Response(response.body, {
      status: response.status,
      headers: { 'Content-Type': contentType, ...cors }
    });
  }
};
