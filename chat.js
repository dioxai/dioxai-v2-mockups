// Diox Chat Widget — mockup-friendly vanilla JS version.
// Calls the SAME /api/chat endpoint as production dioxaiconsulting.com,
// so behavior, knowledge, and tone match the real site.
(function () {
  const API_URL = 'https://dioxaiconsulting.com/api/chat';
  const CALENDLY = 'https://calendly.com/diox-aiconsulting/consultation';

  const root = document.createElement('div');
  root.id = 'diox-chat';
  root.innerHTML = `
    <button id="diox-chat-toggle" aria-label="Talk to Diox">
      <span class="diox-chat-icon">💬</span>
      <span class="diox-chat-label">Talk to Diox</span>
    </button>
    <div id="diox-chat-panel" aria-hidden="true">
      <div class="diox-chat-head">
        <div>
          <div class="diox-chat-title">Diox</div>
          <div class="diox-chat-sub">Digital Oxygen's AI · ask anything about what we build</div>
        </div>
        <button id="diox-chat-close" aria-label="Close">×</button>
      </div>
      <div class="diox-chat-log" id="diox-chat-log">
        <div class="diox-msg assistant">
          <div class="diox-msg-bubble">
            Hey — I'm Diox, Digital Oxygen's AI assistant. Curious what we'd build for your business? Ask me anything — websites, CRMs, voice agents, custom apps, pricing, timelines, even niche stuff like investor admin tools or workflow apps.
          </div>
        </div>
      </div>
      <form class="diox-chat-form" id="diox-chat-form">
        <input type="text" id="diox-chat-input" placeholder="Ask about what we can build for you…" autocomplete="off">
        <button type="submit" id="diox-chat-send">→</button>
      </form>
    </div>
  `;
  document.body.appendChild(root);

  const toggle = document.getElementById('diox-chat-toggle');
  const panel = document.getElementById('diox-chat-panel');
  const closeBtn = document.getElementById('diox-chat-close');
  const log = document.getElementById('diox-chat-log');
  const form = document.getElementById('diox-chat-form');
  const input = document.getElementById('diox-chat-input');

  const history = []; // {role, content}

  function open() { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); input.focus(); }
  function close() { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }

  toggle.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
  closeBtn.addEventListener('click', close);

  function append(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'diox-msg ' + role;
    const bubble = document.createElement('div');
    bubble.className = 'diox-msg-bubble';
    if (text === '[[SHOW_CALENDLY]]') {
      bubble.innerHTML = `<a href="${CALENDLY}" target="_blank" class="diox-msg-cta">📅 Pick a time on the calendar →</a>`;
    } else {
      bubble.textContent = text;
    }
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function appendTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'diox-msg assistant diox-typing';
    wrap.innerHTML = '<div class="diox-msg-bubble"><span></span><span></span><span></span></div>';
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    append('user', text);
    history.push({ role: 'user', content: text });
    const typing = appendTyping();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      typing.remove();
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        append('assistant', errJson.error || "I'm having trouble connecting right now. Email info@dioxaiconsulting.com.");
        return;
      }
      // Stream is text/plain — read chunk by chunk into a single bubble
      const bubble = append('assistant', '');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        // Handle Calendly token mid-stream — split content vs. token
        if (reply.includes('[[SHOW_CALENDLY]]')) {
          const [pre, post] = reply.split('[[SHOW_CALENDLY]]');
          bubble.textContent = pre.trim();
          if (!document.querySelector('.diox-msg-cta-injected')) {
            const ctaBubble = append('assistant', '[[SHOW_CALENDLY]]');
            ctaBubble.classList.add('diox-msg-cta-injected');
          }
        } else {
          bubble.textContent = reply;
        }
        log.scrollTop = log.scrollHeight;
      }
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      append('assistant', "Couldn't reach Diox just now. Email info@dioxaiconsulting.com or book at " + CALENDLY);
    }
  });

  // Open chat automatically after 12s if visitor hasn't engaged with industry tiles
  setTimeout(() => {
    if (!document.getElementById('detail').classList.contains('active')) {
      // gentle nudge — pulse the toggle
      toggle.classList.add('pulse');
    }
  }, 12000);
})();
