/**
 * FlyReisen24.com — Floating AI Chat Widget (Meshmesh)
 * Self-contained: injects HTML + CSS, calls Claude via Cloudflare Worker proxy.
 * Requires: Font Awesome (already on site).
 */
(function () {
  'use strict';

  var STYLE_ID = 'flyreisen-chat-widget-styles';
  var ROOT_ID = 'flyreisen-chat-widget';

  var SYSTEM_PROMPT =
    'You are a helpful travel assistant for FlyReisen24.com,\n' +
    'a multilingual travel knowledge site (Thai/English/German).\n\n' +
    'You specialize in:\n' +
    '- Passport & Visa rules\n' +
    '- Airport connection times (MCT)\n' +
    '- Baggage rules 2026\n' +
    '- Flight changes & cancellations\n' +
    '- Codeshare & Open-Jaw flights\n' +
    '- Frequent Flyer programs\n' +
    '- Charter flights & Overbooking rights\n' +
    '- Online Check-in tips\n' +
    '- Montreal Convention & EU261 passenger rights\n' +
    '- SAF & sustainable aviation\n' +
    '- Airport Security 2026 (CT scanners)\n' +
    '- Travel Insurance\n' +
    '- Airport Lounge access\n' +
    '- Special passengers & children\n' +
    '- Cheap flight booking tips\n\n' +
    'Detect the language from the user\'s message and respond in the SAME language.\n' +
    '- If user writes Thai → respond in Thai\n' +
    '- If user writes English → respond in English\n' +
    '- If user writes German → respond in German\n' +
    '- Default to Thai if unclear\n\n' +
    'FAQ URLs (use EXACT URLs with .html extension):\n' +
    'TH pages:\n' +
    '/th/faq/01-passport-visa.html\n' +
    '/th/faq/02-connection-time.html\n' +
    '/th/faq/03-baggage-rules.html\n' +
    '/th/faq/04-flight-changes.html\n' +
    '/th/faq/05-codeshare-stopover.html\n' +
    '/th/faq/06-frequent-flyer.html\n' +
    '/th/faq/07-charter-overbooking.html\n' +
    '/th/faq/08-online-checkin.html\n' +
    '/th/faq/09-montreal-eu261.html\n' +
    '/th/faq/10-saf-future.html\n' +
    '/th/faq/11-airport-security.html\n' +
    '/th/faq/12-travel-insurance.html\n' +
    '/th/faq/13-airport-lounge.html\n' +
    '/th/faq/14-special-needs.html\n' +
    '/th/faq/15-booking-tips.html\n' +
    'EN pages (same pattern with /en/faq/):\n' +
    '/en/faq/01-passport-visa.html\n' +
    '/en/faq/02-connection-time.html\n' +
    '/en/faq/03-baggage-rules.html\n' +
    '/en/faq/04-flight-changes.html\n' +
    '/en/faq/05-codeshare-stopover.html\n' +
    '/en/faq/06-frequent-flyer.html\n' +
    '/en/faq/07-charter-overbooking.html\n' +
    '/en/faq/08-online-checkin.html\n' +
    '/en/faq/09-montreal-eu261.html\n' +
    '/en/faq/10-saf-future.html\n' +
    '/en/faq/11-airport-security.html\n' +
    '/en/faq/12-travel-insurance.html\n' +
    '/en/faq/13-airport-lounge.html\n' +
    '/en/faq/14-special-needs.html\n' +
    '/en/faq/15-booking-tips.html\n' +
    'DE pages (same pattern with /de/faq/):\n' +
    '/de/faq/01-passport-visa.html\n' +
    '/de/faq/02-connection-time.html\n' +
    '/de/faq/03-baggage-rules.html\n' +
    '/de/faq/04-flight-changes.html\n' +
    '/de/faq/05-codeshare-stopover.html\n' +
    '/de/faq/06-frequent-flyer.html\n' +
    '/de/faq/07-charter-overbooking.html\n' +
    '/de/faq/08-online-checkin.html\n' +
    '/de/faq/09-montreal-eu261.html\n' +
    '/de/faq/10-saf-future.html\n' +
    '/de/faq/11-airport-security.html\n' +
    '/de/faq/12-travel-insurance.html\n' +
    '/de/faq/13-airport-lounge.html\n' +
    '/de/faq/14-special-needs.html\n' +
    '/de/faq/15-booking-tips.html\n\n' +
    'CRITICAL: Always end FAQ links with .html\n' +
    'Never omit the .html extension.\n' +
    'Always use full path: /th/faq/XX-name.html\n' +
    'Format link as: <a href="/th/faq/XX-name.html">อ่านเพิ่มเติม</a>\n\n' +
    'VISA INFORMATION POLICY:\n' +
    'When answering visa questions, provide ONLY:\n' +
    '1. Yes/No — visa required or not\n' +
    '2. Visa type name (e.g. Schengen Type C)\n' +
    '3. Maximum stay duration\n' +
    '4. Approximate fee in EUR and THB\n' +
    '5. Recommended application lead time\n\n' +
    'Then add this CLOSING LINE every time (match response language):\n' +
    'TH: "📋 สำหรับรายละเอียดเอกสารและขั้นตอนครบถ้วน\\nสามารถถาม Meshmesh เพิ่มเติมได้เลยค่ะ\\nหรืออ่านคู่มือฉบับเต็มที่\\nflyreisen24.com/th/faq/01-passport-visa.html"\n' +
    'EN: equivalent phrasing with flyreisen24.com/en/faq/01-passport-visa.html\n' +
    'DE: equivalent phrasing with flyreisen24.com/de/faq/01-passport-visa.html\n\n' +
    'DO NOT provide:\n' +
    '- Full document checklist\n' +
    '- Step by step application process\n' +
    '- VFS/Embassy contact details\n' +
    '- Specific appointment booking tips\n' +
    '- Bank statement amount requirements\n\n' +
    'These details are reserved for personal consultation.\n' +
    'Keep visa answers to maximum 6 lines.\n\n' +
    'IMPORTANT RULES:\n' +
    '1. Answer in maximum 3 sentences. Be concise and direct.\n' +
    '2. Always complete your answer fully — never cut off mid-sentence.\n' +
    '3. Always end EVERY response with a relevant FAQ link like this:\n' +
    '   📖 อ่านเพิ่มเติม: [topic name](/th/faq/XX-topic.html)\n' +
    '   For EN responses: 📖 Read more: [topic name](/en/faq/XX-topic.html)\n' +
    '   For DE responses: 📖 Mehr lesen: [topic name](/de/faq/XX-topic.html)\n' +
    '4. Match link language to the language of the question.';

  var SUGGESTED_QUESTIONS = [
    'บินต่อเครื่องที่ดูไบ 90 นาที ทันไหม?',
    'กระเป๋าหายต้องทำอะไรก่อน?',
    'เข้า Lounge ฟรีได้อย่างไร?',
    'CT Scanner คืออะไร?'
  ];

  var messages = [];
  var isOpen = false;
  var isLoading = false;

  function detectPageLang() {
    var path = window.location.pathname;
    if (path.indexOf('/en/') === 0 || path.indexOf('/en') === 0) return 'en';
    if (path.indexOf('/de/') === 0 || path.indexOf('/de') === 0) return 'de';
    return 'th';
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var css =
      '#' + ROOT_ID + '{position:fixed;bottom:20px;right:20px;z-index:100000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}' +
      'body:has(#' + ROOT_ID + ') .contact-widget{bottom:95px!important;z-index:100001!important;}' +
      '#' + ROOT_ID + ' *{box-sizing:border-box;}' +
      '.fcw-toggle{width:60px;height:60px;border-radius:50%;background:#0056B3;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 20px rgba(0,86,179,.45);transition:transform .2s ease,box-shadow .2s ease;animation:fcw-pulse 2s ease-in-out infinite;}' +
      '.fcw-toggle:hover{transform:scale(1.06);box-shadow:0 6px 24px rgba(0,86,179,.55);}' +
      '.fcw-toggle .fa-plane{transform:rotate(-30deg);}' +
      '@keyframes fcw-pulse{0%,100%{box-shadow:0 4px 20px rgba(0,86,179,.45);}50%{box-shadow:0 4px 28px rgba(0,86,179,.7),0 0 0 8px rgba(0,86,179,.12);}}' +
      '.fcw-panel{display:none;flex-direction:column;width:320px;height:480px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;margin-bottom:14px;}' +
      '.fcw-panel.open{display:flex;}' +
      '.fcw-header{background:#0056B3;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}' +
      '.fcw-header-text{display:flex;flex-direction:column;gap:2px;}' +
      '.fcw-header-title{font-size:15px;font-weight:700;line-height:1.3;}' +
      '.fcw-header-sub{font-size:12px;opacity:.9;}' +
      '.fcw-close{background:rgba(255,255,255,.2);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:background .2s;}' +
      '.fcw-close:hover{background:rgba(255,255,255,.35);}' +
      '.fcw-messages{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;background:#fafbfd;}' +
      '.fcw-messages::-webkit-scrollbar{width:5px;}' +
      '.fcw-messages::-webkit-scrollbar-thumb{background:#c5d4e8;border-radius:4px;}' +
      '.fcw-bubble{max-width:88%;padding:10px 12px;border-radius:14px;font-size:13.5px;line-height:1.55;word-wrap:break-word;}' +
      '.fcw-bubble a{color:#0056B3;text-decoration:underline;}' +
      '.fcw-bubble.user{align-self:flex-end;background:#0056B3;color:#fff;border-bottom-right-radius:4px;}' +
      '.fcw-bubble.user a{color:#cce0ff;}' +
      '.fcw-bubble.ai{align-self:flex-start;background:#f0f4ff;color:#1a2332;border-bottom-left-radius:4px;}' +
      '.fcw-bubble.ai::before{content:"🐱 ";}' +
      '.fcw-stream-cursor{display:inline;color:#0056B3;animation:fcw-cursor-blink 1s step-end infinite;}' +
      '@keyframes fcw-cursor-blink{0%,100%{opacity:1;}50%{opacity:0;}}' +
      '.fcw-suggestions{padding:0 12px 10px;display:flex;flex-direction:column;gap:6px;background:#fafbfd;}' +
      '.fcw-suggestions.hidden{display:none;}' +
      '.fcw-suggest-label{font-size:11px;color:#5a6a80;margin-bottom:2px;}' +
      '.fcw-suggest-btn{background:#fff;border:1px solid #d0dff0;color:#0056B3;border-radius:20px;padding:7px 12px;font-size:12px;cursor:pointer;text-align:left;transition:background .15s,border-color .15s;line-height:1.4;}' +
      '.fcw-suggest-btn:hover{background:#f0f4ff;border-color:#0056B3;}' +
      '.fcw-loading{align-self:flex-start;background:#f0f4ff;padding:12px 16px;border-radius:14px;border-bottom-left-radius:4px;display:flex;gap:5px;align-items:center;}' +
      '.fcw-loading span{width:7px;height:7px;background:#0056B3;border-radius:50%;animation:fcw-dot 1.2s ease-in-out infinite;}' +
      '.fcw-loading span:nth-child(2){animation-delay:.2s;}' +
      '.fcw-loading span:nth-child(3){animation-delay:.4s;}' +
      '@keyframes fcw-dot{0%,80%,100%{opacity:.3;transform:scale(.8);}40%{opacity:1;transform:scale(1);}}' +
      '.fcw-input-area{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #e8edf5;background:#fff;flex-shrink:0;}' +
      '.fcw-input{flex:1;border:1px solid #d0dff0;border-radius:22px;padding:9px 14px;font-size:13.5px;outline:none;transition:border-color .2s;}' +
      '.fcw-input:focus{border-color:#0056B3;}' +
      '.fcw-send{width:38px;height:38px;border-radius:50%;background:#0056B3;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;transition:background .2s,opacity .2s;}' +
      '.fcw-send:hover{background:#003d82;}' +
      '.fcw-send:disabled{opacity:.5;cursor:not-allowed;}' +
      '.fcw-error{font-size:12px;color:#c0392b;padding:0 12px 8px;background:#fafbfd;}' +
      '@media(max-width:480px){#' + ROOT_ID + '{bottom:12px;right:12px;left:12px;}' +
      '.fcw-toggle{position:absolute;bottom:0;right:0;}' +
      '.fcw-panel{width:100%;height:calc(100vh - 80px);max-height:520px;border-radius:14px;}' +
      '.fcw-bubble{max-width:92%;}}';

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createWidget() {
    if (document.getElementById(ROOT_ID)) return;

    var root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML =
      '<div class="fcw-panel" id="fcwPanel" role="dialog" aria-label="Ask Meshmesh chat">' +
        '<div class="fcw-header">' +
          '<div class="fcw-header-text">' +
            '<div class="fcw-header-title">🐱 Ask Meshmesh</div>' +
            '<div class="fcw-header-sub">ถามได้เลยค่ะ!</div>' +
          '</div>' +
          '<button type="button" class="fcw-close" id="fcwClose" aria-label="Close chat"><i class="fas fa-times"></i></button>' +
        '</div>' +
        '<div class="fcw-messages" id="fcwMessages"></div>' +
        '<div class="fcw-suggestions" id="fcwSuggestions">' +
          '<div class="fcw-suggest-label">คำถามยอดนิยม</div>' +
        '</div>' +
        '<div class="fcw-error" id="fcwError" style="display:none;"></div>' +
        '<div class="fcw-input-area">' +
          '<input type="text" class="fcw-input" id="fcwInput" placeholder="พิมพ์คำถามของคุณ..." autocomplete="off" maxlength="500">' +
          '<button type="button" class="fcw-send" id="fcwSend" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="fcw-toggle" id="fcwToggle" aria-label="Open chat" aria-expanded="false">' +
        '<i class="fas fa-plane"></i>' +
      '</button>';

    document.body.appendChild(root);

    var suggestionsEl = document.getElementById('fcwSuggestions');
    SUGGESTED_QUESTIONS.forEach(function (q) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fcw-suggest-btn';
      btn.textContent = q;
      btn.addEventListener('click', function () {
        sendMessage(q);
      });
      suggestionsEl.appendChild(btn);
    });

    document.getElementById('fcwToggle').addEventListener('click', toggleChat);
    document.getElementById('fcwClose').addEventListener('click', closeChat);
    document.getElementById('fcwSend').addEventListener('click', function () {
      var input = document.getElementById('fcwInput');
      sendMessage(input.value);
    });
    document.getElementById('fcwInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(e.target.value);
      }
    });
  }

  function toggleChat() {
    isOpen = !isOpen;
    var panel = document.getElementById('fcwPanel');
    var toggle = document.getElementById('fcwToggle');
    if (isOpen) {
      panel.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
      setTimeout(function () {
        var input = document.getElementById('fcwInput');
        if (input) input.focus();
      }, 200);
    } else {
      closeChat();
    }
  }

  function closeChat() {
    isOpen = false;
    var panel = document.getElementById('fcwPanel');
    var toggle = document.getElementById('fcwToggle');
    if (panel) panel.classList.remove('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fas fa-plane"></i>';
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function fixFaqLinks(text) {
    return text.replace(
      /(\/(?:th|en|de)\/faq\/[\w-]+)(?!\.html)(?=[\s"'<),]|$)/g,
      '$1.html'
    );
  }

  function formatPlainText(text) {
    return escapeHtml(fixFaqLinks(text || '')).replace(/\n/g, '<br>');
  }

  function updateStreamingBubble(text, showCursor) {
    var bubble = document.getElementById('fcwStreamingBubble');
    var container = document.getElementById('fcwMessages');
    if (!bubble || !container) return;
    bubble.innerHTML = formatPlainText(text) + (showCursor ? '<span class="fcw-stream-cursor">▌</span>' : '');
    container.scrollTop = container.scrollHeight;
  }

  function linkify(text) {
    var fixed = fixFaqLinks(text);
    var escaped = escapeHtml(fixed);
    escaped = escaped.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      function(match, label, url) {
        var href = url.indexOf('http') === 0 ? url : 'https://www.flyreisen24.com' + (url.indexOf('/') === 0 ? url : '/' + url);
        return '<a href="' + href + '" style="color:#0056B3;text-decoration:underline;" target="_blank" rel="noopener noreferrer">' + label + '</a>';
      }
    );
    escaped = escaped.replace(
      /(https?:\/\/[^\s<]+|\/[a-z]{2}\/faq\/[^\s<]+(?:\.html)?)/gi,
      function(url) {
        var href = url.indexOf('http') === 0 ? url : 'https://www.flyreisen24.com' + url;
        return '<a href="' + href + '" style="color:#0056B3;text-decoration:underline;" target="_blank" rel="noopener noreferrer">' + url + '</a>';
      }
    );
    return escaped.replace(/\n/g, '<br>');
  }

  function renderMessages() {
    var container = document.getElementById('fcwMessages');
    if (!container) return;
    container.innerHTML = '';

    var hasStreaming = false;

    messages.forEach(function (msg) {
      var bubble = document.createElement('div');
      bubble.className = 'fcw-bubble ' + (msg.role === 'user' ? 'user' : 'ai');
      if (msg.role === 'user') {
        bubble.textContent = msg.content;
      } else if (msg.streaming) {
        hasStreaming = true;
        bubble.id = 'fcwStreamingBubble';
        bubble.innerHTML = formatPlainText(msg.content) + '<span class="fcw-stream-cursor">▌</span>';
      } else {
        bubble.innerHTML = linkify(msg.content);
      }
      container.appendChild(bubble);
    });

    if (isLoading && !hasStreaming) {
      var loading = document.createElement('div');
      loading.className = 'fcw-loading';
      loading.innerHTML = '<span></span><span></span><span></span>';
      container.appendChild(loading);
    }

    container.scrollTop = container.scrollHeight;
  }

  function showError(msg) {
    var el = document.getElementById('fcwError');
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }

  function hideSuggestions() {
    var el = document.getElementById('fcwSuggestions');
    if (el) el.classList.add('hidden');
  }

  async function sendMessage(text) {
    var trimmed = (text || '').trim();
    if (!trimmed || isLoading) return;

    var input = document.getElementById('fcwInput');
    var sendBtn = document.getElementById('fcwSend');
    if (input) input.value = '';
    showError('');
    hideSuggestions();

    messages.push({ role: 'user', content: trimmed });
    messages.push({ role: 'assistant', content: '', streaming: true });
    isLoading = true;
    if (sendBtn) sendBtn.disabled = true;
    renderMessages();

    var lang = detectPageLang();
    var langHint = lang === 'en' ? 'English' : lang === 'de' ? 'German' : 'Thai';
    var systemWithLang = SYSTEM_PROMPT + '\n\nCurrent page language hint: ' + langHint + ' (' + lang + '). Prefer FAQ links matching this language when possible.';
    var apiMessages = messages.filter(function (m) { return !m.streaming; }).map(function (m) {
      return { role: m.role, content: m.content };
    });

    try {
      if (!window.FlyReisenAI) throw new Error('NOT_CONFIGURED');

      var reply = await window.FlyReisenAI.callClaude({
        model: window.FlyReisenAI.MODEL,
        max_tokens: 400,
        stream: true,
        system: systemWithLang,
        messages: apiMessages,
        onChunk: function (text) {
          var streamingMsg = messages[messages.length - 1];
          if (streamingMsg && streamingMsg.streaming) {
            streamingMsg.content = text;
            updateStreamingBubble(text, true);
          }
        }
      });

      if (!reply) reply = 'ขออภัยค่ะ ไม่สามารถตอบได้ในขณะนี้ ลองถามใหม่อีกครั้งนะคะ';
      reply = fixFaqLinks(reply);
      messages[messages.length - 1] = { role: 'assistant', content: reply };
    } catch (err) {
      if (messages.length && messages[messages.length - 1].streaming) {
        messages.pop();
      }
      if (err && err.message === 'NOT_CONFIGURED') {
        showError('ยังเชื่อมต่อ AI ไม่ได้ — ตั้ง Cloudflare Worker (production) หรือ dev-config.js (local)');
        isLoading = false;
        if (sendBtn) sendBtn.disabled = false;
        messages.pop();
        renderMessages();
        return;
      }
      if (err && err.message === 'AUTH_INVALID') {
        var authMsg = window.FlyReisenAI.authErrorMessage(detectPageLang());
        showError(authMsg);
        messages.push({ role: 'assistant', content: '🐱 ' + authMsg });
        isLoading = false;
        if (sendBtn) sendBtn.disabled = false;
        renderMessages();
        return;
      }
      if (err && err.message === 'MODEL_NOT_FOUND') {
        var modelMsg = detectPageLang() === 'en'
          ? 'AI model not found — pull latest ai-client.js from the repo.'
          : detectPageLang() === 'de'
            ? 'KI-Modell nicht gefunden — ai-client.js aktualisieren.'
            : 'ไม่พบ AI model — อัปเดต ai-client.js เป็นเวอร์ชันล่าสุด';
        showError(modelMsg);
        messages.push({ role: 'assistant', content: '🐱 ' + modelMsg });
        isLoading = false;
        if (sendBtn) sendBtn.disabled = false;
        renderMessages();
        return;
      }
      var errMsg = err && err.message ? err.message : 'Network error';
      messages.push({
        role: 'assistant',
        content: 'ขออภัยค่ะ เกิดข้อผิดพลาด: ' + errMsg + '\n\nลองใหม่อีกครั้ง หรือดู FAQ ที่ /th/faq/landing.html'
      });
    }

    isLoading = false;
    if (sendBtn) sendBtn.disabled = false;
    renderMessages();
    if (input) input.focus();
  }

  function init() {
    if (window.__flyreisenChatWidgetInit) return;
    window.__flyreisenChatWidgetInit = true;
    injectStyles();
    createWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
