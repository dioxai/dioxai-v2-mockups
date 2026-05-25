(function () {
  const grid = document.getElementById('industryGrid');
  const hero = document.getElementById('hero');
  const detail = document.getElementById('detail');

  // Build tiles
  Object.entries(INDUSTRIES).forEach(([key, ind]) => {
    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.dataset.key = key;
    btn.innerHTML = `
      <div>
        <div class="tile-icon">${ind.icon}</div>
        <div class="tile-label">${ind.label}</div>
      </div>
      <span class="tile-arrow">→</span>
    `;
    btn.addEventListener('click', () => routeTo(key));
    grid.appendChild(btn);
  });

  function routeTo(key) {
    const ind = INDUSTRIES[key];
    if (!ind) return;

    document.getElementById('detailTag').textContent = ind.tag;
    document.getElementById('detailHeadline').innerHTML = ind.headline;
    document.getElementById('detailLede').textContent = ind.lede;

    const painsUl = document.getElementById('detailPains');
    painsUl.innerHTML = '';
    ind.pains.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      painsUl.appendChild(li);
    });

    document.getElementById('detailCase').innerHTML = `
      <div class="case-client">${ind.caseClient}</div>
      <div class="case-result">${ind.caseResult}</div>
      <div class="case-desc">${ind.caseDesc}</div>
    `;

    document.getElementById('detailPricing').innerHTML =
      `<span class="pricing-from">Investment</span><span class="pricing-value">${ind.pricingRange}</span>`;
    const note = document.querySelector('.pricing-note');
    note.textContent = `${ind.pricingFootnote}. Custom-scoped after a 20-min fit call.`;

    hero.classList.add('routed');
    detail.classList.add('active');
    detail.setAttribute('aria-hidden', 'false');

    // Update URL hash for shareable preview
    history.replaceState(null, '', `#${key}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    hero.classList.remove('routed');
    detail.classList.remove('active');
    detail.setAttribute('aria-hidden', 'true');
    history.replaceState(null, '', '#');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('resetBtn').addEventListener('click', reset);

  // Deep-link support
  const initial = window.location.hash.replace('#', '');
  if (initial && INDUSTRIES[initial]) {
    requestAnimationFrame(() => routeTo(initial));
  }
})();
