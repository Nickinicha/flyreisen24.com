// Copy this file to config.js (config.js is gitignored — never commit secrets)
//
// Option A — Local dev fallback (until Cloudflare Worker is live):
window.FLYREISEN_API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';
//
// Option B — Production (recommended, no key in browser):
// window.FLYREISEN_PROXY_URL = 'https://flyreisen24-proxy.YOUR-SUBDOMAIN.workers.dev';
