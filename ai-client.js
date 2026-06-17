/**
 * FlyReisen24 — shared Claude API client
 * Proxy (production) or dev-config.js API key (local dev fallback)
 */
(function (global) {
  'use strict';

  var DEFAULT_PROXY = '';
  var ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
  var DEFAULT_MODEL = 'claude-sonnet-4-6';

  function getProxyUrl() {
    var url = global.FLYREISEN_PROXY_URL || DEFAULT_PROXY;
    if (!url || url.indexOf('YOUR-SUBDOMAIN') !== -1) return null;
    return url;
  }

  function getApiKey() {
    var key = global.FLYREISEN_API_KEY;
    if (!key || key === 'YOUR_API_KEY_HERE') return null;
    return key;
  }

  function authErrorMessage(lang) {
    if (lang === 'en') {
      return 'API key invalid or expired. Create a new key at console.anthropic.com and update dev-config.js (local) or the Cloudflare Worker secret (production).';
    }
    if (lang === 'de') {
      return 'API-Schlüssel ungültig oder abgelaufen. Neuen Schlüssel unter console.anthropic.com erstellen und dev-config.js bzw. Cloudflare Worker aktualisieren.';
    }
    return 'API key ไม่ถูกต้องหรือหมดอายุ — สร้าง key ใหม่ที่ console.anthropic.com แล้วอัปเดต dev-config.js (เครื่อง local) หรือ Cloudflare Worker (production)';
  }

  async function callClaude(opts) {
    var payload = JSON.stringify({
      model: opts.model || DEFAULT_MODEL,
      max_tokens: opts.max_tokens || opts.maxTokens || 400,
      system: opts.system,
      messages: opts.messages
    });

    var proxy = getProxyUrl();
    var response;

    if (proxy) {
      response = await fetch(proxy, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
    } else {
      var apiKey = getApiKey();
      if (!apiKey) throw new Error('NOT_CONFIGURED');
      response = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: payload
      });
    }

    if (!response.ok) {
      var errBody = '';
      try { errBody = await response.text(); } catch (e) { /* ignore */ }
      if (response.status === 401) throw new Error('AUTH_INVALID');
      if (response.status === 404 && errBody.indexOf('model:') !== -1) throw new Error('MODEL_NOT_FOUND');
      throw new Error('API_' + response.status + (errBody ? ': ' + errBody.slice(0, 100) : ''));
    }

    return response.json();
  }

  global.FlyReisenAI = {
    callClaude: callClaude,
    MODEL: DEFAULT_MODEL,
    authErrorMessage: authErrorMessage
  };
})(typeof window !== 'undefined' ? window : this);
