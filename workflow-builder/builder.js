/* Workflow Builder — client logic.
 * Calls Vercel /api/workflow-analyze on the production web app for Gemini analysis.
 * Falls back to local examples if API unreachable. Rate-limited 3/hr/IP via localStorage + server.
 */
(function () {
  const API_ENDPOINT = "https://dioxaiconsulting.com/api/workflow-analyze";
  const RATE_LIMIT_KEY = "wb_rl";
  const RATE_LIMIT_MAX = 3;
  const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

  const $ = (id) => document.getElementById(id);
  const form = $("wbForm");
  const promptEl = $("wbPrompt");
  const submitBtn = $("wbSubmit");
  const result = $("wbResult");
  const loading = $("wbLoading");
  const loadingText = $("wbLoadingText");
  const errorEl = $("wbError");
  const errorMsg = $("wbErrorMsg");
  const flowManual = $("flowManual");
  const flowAuto = $("flowAuto");
  const manualCanvas = $("manualCanvas");
  const autoCanvas = $("autoCanvas");
  const manualStats = $("manualStats");
  const autoStats = $("autoStats");
  const ctaRow = $("wbCtaRow");
  const leadBox = $("wbLead");

  // ===== Rate limit (client side, server enforces too) =====
  function readRL() {
    try { return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || "[]"); } catch { return []; }
  }
  function recordRL() {
    const now = Date.now();
    const log = readRL().filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    log.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(log));
  }
  function rateLimitRemaining() {
    const now = Date.now();
    const log = readRL().filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    return Math.max(0, RATE_LIMIT_MAX - log.length);
  }

  // ===== Examples =====
  document.querySelectorAll(".wb-ex").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.ex, 10);
      const ex = window.WB_EXAMPLES[idx];
      if (!ex) return;
      promptEl.value = ex.prompt;
      promptEl.focus();
      // Render preview straight from canned data (saves an API call for demo)
      renderResult(ex.result);
    });
  });

  // ===== Submit =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = promptEl.value.trim();
    if (prompt.length < 12) {
      promptEl.focus();
      return;
    }
    if (rateLimitRemaining() <= 0) {
      showError("You've used your 3 generations this hour. Email bela@dioxaiconsulting.com to map yours by hand.");
      return;
    }

    submitBtn.disabled = true;
    showLoading();
    cycleLoadingText();

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.status === 429) {
        showError("Rate limit reached. Try again in an hour, or email bela@dioxaiconsulting.com.");
        return;
      }
      if (!res.ok) throw new Error("api_" + res.status);
      const data = await res.json();
      if (!data || !Array.isArray(data.currentSteps) || !Array.isArray(data.automatedSteps)) {
        throw new Error("bad_shape");
      }
      recordRL();
      renderResult(data);
    } catch (err) {
      console.warn("[wb] falling back to local heuristic:", err);
      // Graceful fallback: use heuristic shape from the prompt so the demo still demos.
      const fallback = heuristicFallback(prompt);
      renderResult(fallback, { fallback: true });
    } finally {
      submitBtn.disabled = false;
    }
  });

  function showLoading() {
    result.classList.remove("active"); result.setAttribute("aria-hidden", "true");
    errorEl.classList.remove("active"); errorEl.setAttribute("aria-hidden", "true");
    loading.classList.add("active"); loading.setAttribute("aria-hidden", "false");
  }
  function showError(msg) {
    loading.classList.remove("active"); loading.setAttribute("aria-hidden", "true");
    errorMsg.textContent = msg || errorMsg.textContent;
    errorEl.classList.add("active"); errorEl.setAttribute("aria-hidden", "false");
  }
  function cycleLoadingText() {
    const phases = [
      "Reading your workflow…",
      "Mapping each manual step…",
      "Identifying the pain points…",
      "Designing the automated version…",
      "Estimating time + dollars saved…"
    ];
    let i = 0;
    loadingText.textContent = phases[0];
    const t = setInterval(() => {
      i++;
      if (i >= phases.length || !loading.classList.contains("active")) { clearInterval(t); return; }
      loadingText.textContent = phases[i];
    }, 900);
  }

  // ===== Renderers =====
  function renderResult(data, opts) {
    loading.classList.remove("active"); loading.setAttribute("aria-hidden", "true");
    errorEl.classList.remove("active"); errorEl.setAttribute("aria-hidden", "true");

    // populate stats
    const manualMinutes = sumMinutes(data.currentSteps);
    const autoMinutes = sumMinutes(data.automatedSteps);
    const hoursSaved = data.hoursPerWeekSaved ?? estimateHoursSaved(manualMinutes, autoMinutes);
    const dollarsSaved = data.dollarsPerMonthSaved ?? Math.round(hoursSaved * 4.33 * 65);

    manualStats.innerHTML =
      stat(`${manualMinutes}m`, "per execution") +
      stat(`${countPain(data.currentSteps)}`, "pain points") +
      stat(`~${Math.round(hoursSaved)}h`, "wasted / week");

    autoStats.innerHTML =
      stat(`${Math.max(1, Math.round(autoMinutes))}m`, "per execution") +
      stat(`${Math.round(hoursSaved)}h`, "reclaimed / week") +
      stat(`$${dollarsSaved.toLocaleString()}`, "saved / month");

    // Clear and stage canvases
    manualCanvas.innerHTML = "";
    autoCanvas.innerHTML = "";
    flowManual.classList.remove("visible");
    flowAuto.classList.remove("visible");
    ctaRow.classList.remove("visible");
    leadBox.classList.remove("visible");
    result.classList.add("active"); result.setAttribute("aria-hidden", "false");
    result.scrollIntoView({ behavior: "smooth", block: "start" });

    // Manual side fades in first, node-by-node (boring/slow cadence)
    setTimeout(() => {
      flowManual.classList.add("visible");
      animateNodes(manualCanvas, data.currentSteps, 280, "manual");
    }, 120);

    // Auto side after manual finishes, snappier cadence
    const manualTime = 120 + data.currentSteps.length * 280 + 250;
    setTimeout(() => {
      flowAuto.classList.add("visible");
      animateNodes(autoCanvas, data.automatedSteps, 130, "auto");
    }, manualTime);

    const autoTime = manualTime + data.automatedSteps.length * 130 + 300;
    setTimeout(() => {
      ctaRow.classList.add("visible");
      leadBox.classList.add("visible");
    }, autoTime);
  }

  function animateNodes(canvas, steps, perStepDelay, side) {
    steps.forEach((step, i) => {
      // node
      const node = document.createElement("div");
      node.className = "wb-node type-" + (step.type || "manual");
      node.style.animationDelay = (i * perStepDelay) + "ms";
      node.innerHTML = `
        <div class="wb-node-top">
          <div class="wb-node-label">
            <span class="wb-node-type wb-type-${escapeAttr(step.type || "manual")}">${escapeHTML(step.type || "manual")}</span>
            ${escapeHTML(step.label || "Step")}
          </div>
          <div class="wb-node-time">${formatMinutes(step.timeMinutes)}</div>
        </div>
        ${step.painPoint ? `<div class="wb-node-pain">⚠ ${escapeHTML(step.painPoint)}</div>` : ""}
      `;
      canvas.appendChild(node);
      // arrow
      if (i < steps.length - 1) {
        const arrow = document.createElement("div");
        arrow.className = "wb-arrow";
        arrow.style.animationDelay = (i * perStepDelay + perStepDelay / 2) + "ms";
        arrow.textContent = "↓";
        canvas.appendChild(arrow);
      }
    });
  }

  function stat(num, lbl) {
    return `<div class="wb-stat"><span class="wb-stat-num">${num}</span><span class="wb-stat-lbl">${lbl}</span></div>`;
  }
  function sumMinutes(steps) {
    return Math.round(steps.reduce((a, s) => a + (Number(s.timeMinutes) || 0), 0));
  }
  function countPain(steps) { return steps.filter((s) => s.painPoint).length; }
  function estimateHoursSaved(manualMin, autoMin) {
    // assume workflow runs 20x/week
    return Math.max(1, Math.round(((manualMin - autoMin) * 20) / 60));
  }
  function formatMinutes(m) {
    const n = Number(m);
    if (!isFinite(n) || n <= 0) return "instant";
    if (n < 1) return Math.round(n * 60) + "s";
    if (n < 60) return Math.round(n) + " min";
    return (n / 60).toFixed(1) + " hr";
  }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function escapeAttr(s) { return String(s).replace(/[^a-zA-Z0-9_-]/g, ""); }

  // Heuristic fallback when API unavailable — keeps the demo demoing
  function heuristicFallback(prompt) {
    const p = prompt.toLowerCase();
    const verbs = ["receive request", "review the details", "look up context", "draft response", "send follow-up", "log it somewhere"];
    const current = verbs.map((v, i) => ({
      id: "m" + i,
      label: v.charAt(0).toUpperCase() + v.slice(1),
      type: "manual",
      timeMinutes: [1, 8, 6, 10, 4, 3][i],
      painPoint: i === 1 ? "Context-switching tax" : (i === 4 ? "Often forgotten" : undefined)
    }));
    const automated = [
      { id: "a1", label: "Webhook captures the trigger", type: "integration", timeMinutes: 0 },
      { id: "a2", label: "AI agent reads + classifies", type: "ai", timeMinutes: 0.3 },
      { id: "a3", label: "Drafts personalized response", type: "ai", timeMinutes: 0.4 },
      { id: "a4", label: "Logged to CRM, you get the digest", type: "notification", timeMinutes: 0.1 }
    ];
    return {
      currentSteps: current, automatedSteps: automated,
      hoursPerWeekSaved: 11, dollarsPerMonthSaved: 7800,
      _heuristic: true, _hint: p.slice(0, 40)
    };
  }

  // ===== Lead capture =====
  const leadForm = $("wbLeadForm");
  const leadThanks = $("wbLeadThanks");
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("wbLeadEmail").value.trim();
    if (!email) return;
    try {
      await fetch(API_ENDPOINT.replace("/workflow-analyze", "/workflow-lead"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, workflow: promptEl.value.slice(0, 800) }),
      });
    } catch {}
    leadForm.hidden = true;
    leadThanks.hidden = false;
  });

  // ===== Reset =====
  $("wbReset").addEventListener("click", () => {
    result.classList.remove("active"); result.setAttribute("aria-hidden", "true");
    promptEl.value = "";
    promptEl.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("wbErrorReset").addEventListener("click", () => {
    errorEl.classList.remove("active"); errorEl.setAttribute("aria-hidden", "true");
    promptEl.focus();
  });
})();
