const ALLOWED_ORIGINS = [
  'https://www.flyreisen24.com',
  'https://flyreisen24.com'
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

function corsHeaders(origin) {
  var allowed = ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

async function handleRequest(request) {
  var origin = request.headers.get('Origin') || '';
  var cors = corsHeaders(origin);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: cors });
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: { message: 'Worker secret ANTHROPIC_API_KEY not set' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...cors }
    });
  }

  var body = await request.text();
  var response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: body
  });

  var data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': 'application/json', ...cors }
  });
}
