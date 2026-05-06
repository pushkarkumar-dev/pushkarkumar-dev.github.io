window.DSA = window.DSA || {};

window.DSA.ANIMATIONS = (function () {

  function slidingWindow(container) {
    const s = "abcabcbb";
    const W = 520, H = 190;
    const cellW = 50, cellH = 42;
    const startX = (W - s.length * cellW) / 2;
    const startY = 48;
    const ns = 'http://www.w3.org/2000/svg';

    /* ── Pre-compute trace ─────────────────────────────────── */
    const trace = [];
    let left = 0, ans = 0;
    const seen = {};
    for (let right = 0; right < s.length; right++) {
      const c = s[right];
      if (c in seen && seen[c] >= left) left = seen[c] + 1;
      seen[c] = right;
      const len = right - left + 1;
      if (len > ans) ans = len;
      trace.push({ left, right, len, maxLen: ans });
    }

    /* ── Build SVG ─────────────────────────────────────────── */
    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');

    const svgBg = document.createElementNS(ns, 'rect');
    svgBg.setAttribute('width', W); svgBg.setAttribute('height', H);
    svgBg.setAttribute('fill', '#0e0b08');
    svg.appendChild(svgBg);

    /* Window highlight rect (drawn before cells so it's below them) */
    const winRect = document.createElementNS(ns, 'rect');
    winRect.setAttribute('y', startY - 3);
    winRect.setAttribute('height', cellH + 6);
    winRect.setAttribute('rx', 8);
    winRect.setAttribute('fill', 'rgba(224,169,109,0.13)');
    winRect.setAttribute('stroke', '#e0a96d');
    winRect.setAttribute('stroke-width', '1.5');
    winRect.setAttribute('opacity', '0');
    svg.appendChild(winRect);

    /* Cells */
    const cells = [];
    for (let i = 0; i < s.length; i++) {
      const g = document.createElementNS(ns, 'g');
      const x = startX + i * cellW;

      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x + 2); rect.setAttribute('y', startY);
      rect.setAttribute('width', cellW - 4); rect.setAttribute('height', cellH);
      rect.setAttribute('rx', 6);
      rect.setAttribute('fill', '#1c1812');
      rect.setAttribute('stroke', '#3a3329');
      rect.setAttribute('stroke-width', '1');
      g.appendChild(rect);

      const letter = document.createElementNS(ns, 'text');
      letter.setAttribute('x', x + cellW / 2);
      letter.setAttribute('y', startY + 27);
      letter.setAttribute('text-anchor', 'middle');
      letter.setAttribute('dominant-baseline', 'middle');
      letter.setAttribute('fill', '#8a7f6e');
      letter.setAttribute('font-family', 'JetBrains Mono, monospace');
      letter.setAttribute('font-size', '15');
      letter.setAttribute('font-weight', '500');
      letter.textContent = s[i];
      g.appendChild(letter);

      const idx = document.createElementNS(ns, 'text');
      idx.setAttribute('x', x + cellW / 2);
      idx.setAttribute('y', startY + cellH + 13);
      idx.setAttribute('text-anchor', 'middle');
      idx.setAttribute('fill', '#3a3329');
      idx.setAttribute('font-family', 'JetBrains Mono, monospace');
      idx.setAttribute('font-size', '9');
      idx.textContent = i;
      g.appendChild(idx);

      svg.appendChild(g);
      cells.push({ rect, letter });
    }

    /* Pointer labels */
    const mkLabel = (ch, color) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', color);
      t.setAttribute('font-family', 'JetBrains Mono, monospace');
      t.setAttribute('font-size', '10');
      t.setAttribute('font-weight', '700');
      t.setAttribute('letter-spacing', '0.04em');
      t.setAttribute('y', startY - 10);
      t.setAttribute('x', '-999');
      t.textContent = ch;
      svg.appendChild(t);
      return t;
    };
    const labelL = mkLabel('L', '#e0a96d');
    const labelR = mkLabel('R', '#f0bc7d');

    /* Status line inside SVG */
    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2);
    statusSvg.setAttribute('y', startY + cellH + 34);
    statusSvg.setAttribute('text-anchor', 'middle');
    statusSvg.setAttribute('fill', '#5e5448');
    statusSvg.setAttribute('font-family', 'JetBrains Mono, monospace');
    statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);

    container.appendChild(svg);

    /* ── Controls ──────────────────────────────────────────── */
    const controls = document.createElement('div');
    controls.className = 'anim-controls';

    const playBtn  = document.createElement('button');
    playBtn.className = 'anim-btn';
    playBtn.textContent = '▶ Play';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'anim-btn';
    resetBtn.textContent = 'Reset';

    const statusEl = document.createElement('span');
    statusEl.className = 'anim-status';
    statusEl.textContent = `0 / ${trace.length} steps`;

    controls.appendChild(playBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(statusEl);
    container.appendChild(controls);

    /* ── Render step ───────────────────────────────────────── */
    let stepIdx = 0, timer = null, playing = false;

    function renderStep(t) {
      const { left, right, len, maxLen } = trace[t];

      for (let i = 0; i < s.length; i++) {
        const active = i >= left && i <= right;
        cells[i].rect.setAttribute('fill',   active ? 'rgba(224,169,109,0.16)' : '#1c1812');
        cells[i].rect.setAttribute('stroke', active ? '#e0a96d' : '#3a3329');
        cells[i].letter.setAttribute('fill', active ? '#f3ebdf' : '#5e5448');
      }

      const wx = startX + left * cellW + 2;
      const ww = (right - left + 1) * cellW - 4;
      winRect.setAttribute('x', wx);
      winRect.setAttribute('width', ww);
      winRect.setAttribute('opacity', '1');

      labelL.setAttribute('x', startX + left  * cellW + cellW / 2);
      labelR.setAttribute('x', startX + right * cellW + cellW / 2);

      statusSvg.textContent = `window="${s.slice(left, right + 1)}"  len=${len}  max=${maxLen}`;
      statusEl.textContent  = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer);
      playing = false;
      playBtn.textContent = '▶ Play';
      stepIdx = 0;
      winRect.setAttribute('opacity', '0');
      labelL.setAttribute('x', '-999');
      labelR.setAttribute('x', '-999');
      cells.forEach(({ rect, letter }) => {
        rect.setAttribute('fill',   '#1c1812');
        rect.setAttribute('stroke', '#3a3329');
        letter.setAttribute('fill', '#8a7f6e');
      });
      statusSvg.textContent = 'press play';
      statusEl.textContent  = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) {
        clearInterval(timer);
        playing = false;
        playBtn.textContent = '▶ Play';
        return;
      }
      if (stepIdx >= trace.length) resetAnim();
      playing = true;
      playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) {
          clearInterval(timer);
          playing = false;
          playBtn.textContent = '▶ Play';
        }
      }, 750);
    }

    playBtn.addEventListener('click',  playAnim);
    resetBtn.addEventListener('click', resetAnim);

    /* Respect prefers-reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true;
      playBtn.title    = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  return { slidingWindow };

})();
