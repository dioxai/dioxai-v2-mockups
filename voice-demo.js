// Diox Voice Demo — appears when chat has captured name+email+phone.
// On click → confirm modal → POST /api/voice-demo/request → poll status.
(function () {
  const API_BASE = 'https://dioxaiconsulting.com/api/voice-demo';

  // Inject button (hidden by default; revealed via body.voice-demo-unlocked)
  const btn = document.createElement('button');
  btn.id = 'diox-voice-demo-btn';
  btn.type = 'button';
  btn.innerHTML = '📞 Try a Voice Demo with Diox';
  btn.setAttribute('aria-label', 'Try a live voice demo with Diox');
  document.body.appendChild(btn);

  // Modal scaffold
  const modal = document.createElement('div');
  modal.id = 'diox-voice-modal';
  modal.innerHTML = `
    <div class="diox-voice-modal-card">
      <button class="diox-voice-modal-close" aria-label="Close">×</button>
      <h3>Live Voice Demo</h3>
      <p class="diox-voice-modal-body">Ready? We'll dial <strong id="diox-voice-phone">your phone</strong> in 5 seconds. Answer and talk to Diox like you'd talk to a real receptionist.</p>
      <div class="diox-voice-modal-actions">
        <button class="diox-voice-cancel">Cancel</button>
        <button class="diox-voice-go">Yes, call me now</button>
      </div>
      <div class="diox-voice-status" hidden></div>
    </div>
  `;
  document.body.appendChild(modal);

  const phoneEl = modal.querySelector('#diox-voice-phone');
  const statusEl = modal.querySelector('.diox-voice-status');
  const goBtn = modal.querySelector('.diox-voice-go');
  const cancelBtn = modal.querySelector('.diox-voice-cancel');
  const closeBtn = modal.querySelector('.diox-voice-modal-close');

  function openModal() {
    const lead = window.__dioxLead || {};
    phoneEl.textContent = lead.phone || 'your phone';
    statusEl.hidden = true;
    statusEl.textContent = '';
    goBtn.disabled = false;
    goBtn.textContent = 'Yes, call me now';
    modal.classList.add('open');
  }
  function closeModal() { modal.classList.remove('open'); }

  btn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function setStatus(msg) {
    statusEl.hidden = false;
    statusEl.textContent = msg;
  }

  async function pollStatus(callSid) {
    const start = Date.now();
    while (Date.now() - start < 90000) {
      try {
        const r = await fetch(`${API_BASE}/status/${encodeURIComponent(callSid)}`);
        if (r.ok) {
          const j = await r.json();
          if (j.status) setStatus(`Call status: ${j.status}`);
          if (['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(j.status)) return;
        }
      } catch (_) { /* keep polling */ }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  goBtn.addEventListener('click', async () => {
    const lead = window.__dioxLead || {};
    if (!lead.phone) { setStatus('Missing phone number — share it in chat first.'); return; }
    goBtn.disabled = true;
    goBtn.textContent = 'Dialing…';
    setStatus('Requesting call…');
    try {
      const res = await fetch(`${API_BASE}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          leadSessionId: lead.sessionId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(data.reason || data.error || 'Could not place the call. Try again in a moment.');
        goBtn.disabled = false;
        goBtn.textContent = 'Retry';
        return;
      }
      setStatus('📞 Calling now — answer your phone!');
      if (data.callSid) pollStatus(data.callSid);
    } catch (err) {
      setStatus('Network error — please try again.');
      goBtn.disabled = false;
      goBtn.textContent = 'Retry';
    }
  });
})();
