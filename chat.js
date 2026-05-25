// Diox Chat Widget — mockup-friendly vanilla JS version.
// Calls the SAME /api/chat endpoint as production dioxaiconsulting.com,
// so behavior, knowledge, and tone match the real site.
(function () {
  const API_URL = 'https://dioxaiconsulting.com/api/chat';
  // Voice demo backend lives on a Vercel PREVIEW deploy (not prod) during build/test.
  // Override via <meta name="diox-voice-demo-url" content="https://<preview>.vercel.app/api/voice-demo/request">
  // or by setting window.DIOX_VOICE_DEMO_URL before chat.js loads.
  const VOICE_DEMO_URL =
    (typeof window !== 'undefined' && window.DIOX_VOICE_DEMO_URL) ||
    (document.querySelector('meta[name="diox-voice-demo-url"]') || {}).content ||
    'https://dioxaiconsulting.com/api/voice-demo/request';
  const CALENDLY = 'https://calendly.com/diox-aiconsulting/consultation';

  // Lead state — populated as the visitor reveals info in chat.
  const lead = { name: null, email: null, phone: null };
  let voiceBtn = null;
  let voiceUnlocked = false;

  function extractLead(text) {
    const emailMatch = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
    const phoneMatch = text.match(/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
    const nameMatch = text.match(/(?:i['’]?m|my name['’]?s? is|this is|name['’]?s)\s+([A-Z][a-zA-Z'-]{1,30}(?:\s+[A-Z][a-zA-Z'-]{1,30})?)/);
    return {
      name: nameMatch && nameMatch[1],
      email: emailMatch && emailMatch[1],
      phone: phoneMatch && phoneMatch[0],
    };
  }

  function mergeLead(found) {
    if (found.name && !lead.name) lead.name = found.name;
    if (found.email && !lead.email) lead.email = found.email;
    if (found.phone && !lead.phone) lead.phone = found.phone;
    maybeUnlockVoiceDemo();
  }

  function maybeUnlockVoiceDemo() {
    if (voiceUnlocked) return;
    if (lead.name && lead.email && lead.phone) {
      voiceUnlocked = true;
      if (voiceBtn) {
        voiceBtn.style.display = '';
        voiceBtn.classList.add('diox-voice-pulse');
      }
      // Inline confirmation in chat
      append('assistant', "Heads up — I just unlocked a quick voice demo for you. Tap “📞 Try a Voice Demo” at the bottom and Drew (our AI receptionist) will call you in a few seconds.");
    }
  }

  function showToast(msg, kind) {
    let t = document.getElementById('diox-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'diox-toast';
      document.body.appendChild(t);
    }
    t.className = 'diox-toast ' + (kind || 'info');
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => { t.style.opacity = '0'; }, 6000);
  }

  async function requestVoiceDemo() {
    if (!lead.name || !lead.email || !lead.phone) {
      showToast('Share your name, email, and phone with Diox first.', 'warn');
      return;
    }
    voiceBtn.disabled = true;
    voiceBtn.textContent = '📞 Calling…';
    try {
      const res = await fetch(VOICE_DEMO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lead.name, email: lead.email, phone: lead.phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        showToast('Calling you now — answer your phone. Drew will introduce himself.', 'success');
        voiceBtn.textContent = '☎ Drew is calling…';
        append('assistant', "Calling " + lead.phone + " now — Drew should be on the line in about 5 seconds.");
      } else {
        showToast(data.reason || 'Could not place the call. Try again in a minute.', 'warn');
        voiceBtn.disabled = false;
        voiceBtn.textContent = '📞 Try a Voice Demo';
      }
    } catch (e) {
      showToast('Network hiccup placing the call. Try again or email info@dioxaiconsulting.com.', 'warn');
      voiceBtn.disabled = false;
      voiceBtn.textContent = '📞 Try a Voice Demo';
    }
  }

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
      <button id="diox-voice-demo-btn" class="diox-voice-demo-btn" type="button" style="display:none">
        📞 Try a Voice Demo
      </button>
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
  voiceBtn = document.getElementById('diox-voice-demo-btn');
  voiceBtn.addEventListener('click', requestVoiceDemo);

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
    mergeLead(extractLead(text));
    const typing = appendTyping();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      typing.remove();
      const reply = data.message || data.content || data.reply || "Hmm — I'm having trouble connecting. Try again or email info@dioxaiconsulting.com.";
      // Handle [[SHOW_CALENDLY]] token
      if (reply.includes('[[SHOW_CALENDLY]]')) {
        const parts = reply.split('[[SHOW_CALENDLY]]');
        if (parts[0].trim()) append('assistant', parts[0].trim());
        append('assistant', '[[SHOW_CALENDLY]]');
        if (parts[1] && parts[1].trim()) append('assistant', parts[1].trim());
      } else {
        append('assistant', reply);
      }
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      append('assistant', "I couldn't reach the chat brain — the mockup is hosted separately. On the live site at dioxaiconsulting.com I'd answer instantly. For now, email info@dioxaiconsulting.com or book at " + CALENDLY);
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
