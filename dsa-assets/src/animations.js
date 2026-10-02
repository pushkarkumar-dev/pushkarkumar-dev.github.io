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
    svgBg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(svgBg);

    /* Window highlight rect (drawn before cells so it's below them) */
    const winRect = document.createElementNS(ns, 'rect');
    winRect.setAttribute('y', startY - 3);
    winRect.setAttribute('height', cellH + 6);
    winRect.setAttribute('rx', 8);
    winRect.setAttribute('fill', 'rgba(255,198,40,0.28)');
    winRect.setAttribute('stroke', '#15202B');
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
      rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#8C97A1');
      rect.setAttribute('stroke-width', '1');
      g.appendChild(rect);

      const letter = document.createElementNS(ns, 'text');
      letter.setAttribute('x', x + cellW / 2);
      letter.setAttribute('y', startY + 27);
      letter.setAttribute('text-anchor', 'middle');
      letter.setAttribute('dominant-baseline', 'middle');
      letter.setAttribute('fill', '#4A5560');
      letter.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      letter.setAttribute('font-size', '15');
      letter.setAttribute('font-weight', '500');
      letter.textContent = s[i];
      g.appendChild(letter);

      const idx = document.createElementNS(ns, 'text');
      idx.setAttribute('x', x + cellW / 2);
      idx.setAttribute('y', startY + cellH + 13);
      idx.setAttribute('text-anchor', 'middle');
      idx.setAttribute('fill', '#8C97A1');
      idx.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
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
      t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      t.setAttribute('font-size', '10');
      t.setAttribute('font-weight', '700');
      t.setAttribute('letter-spacing', '0.04em');
      t.setAttribute('y', startY - 10);
      t.setAttribute('x', '-999');
      t.textContent = ch;
      svg.appendChild(t);
      return t;
    };
    const labelL = mkLabel('L', '#15202B');
    const labelR = mkLabel('R', '#2F6FB0');

    /* Status line inside SVG */
    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2);
    statusSvg.setAttribute('y', startY + cellH + 34);
    statusSvg.setAttribute('text-anchor', 'middle');
    statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
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
        cells[i].rect.setAttribute('fill',   active ? 'rgba(255,198,40,0.55)' : '#FFFFFF');
        cells[i].rect.setAttribute('stroke', active ? '#15202B' : '#8C97A1');
        cells[i].letter.setAttribute('fill', active ? '#15202B' : '#7D8994');
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
        rect.setAttribute('fill',   '#FFFFFF');
        rect.setAttribute('stroke', '#8C97A1');
        letter.setAttribute('fill', '#4A5560');
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

  /* ── Two Pointers (LC 11 — Container With Most Water) ───── */
  function twoPointers(container) {
    const h = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const W = 520, H = 190, n = h.length;
    const barW = 40, startX = (W - n * barW) / 2, baseY = 148;
    const scaleY = 100 / Math.max(...h);
    const ns = 'http://www.w3.org/2000/svg';

    const trace = [];
    let L = 0, R = n - 1, maxA = 0;
    while (L < R) {
      const area = Math.min(h[L], h[R]) * (R - L);
      if (area > maxA) maxA = area;
      trace.push({ L, R, area, max: maxA });
      if (h[L] <= h[R]) L++; else R--;
    }

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    const water = document.createElementNS(ns, 'rect');
    water.setAttribute('fill', 'rgba(47,111,176,0.18)');
    water.setAttribute('stroke', '#2F6FB0');
    water.setAttribute('stroke-width', '1.5');
    water.setAttribute('rx', '4');
    water.setAttribute('opacity', '0');
    svg.appendChild(water);

    const bars = h.map((v, i) => {
      const bh = v * scaleY;
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', startX + i * barW + 3); rect.setAttribute('y', baseY - bh);
      rect.setAttribute('width', barW - 6); rect.setAttribute('height', bh);
      rect.setAttribute('rx', 4); rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#8C97A1'); rect.setAttribute('stroke-width', '1');
      svg.appendChild(rect);
      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', startX + i * barW + barW / 2); lbl.setAttribute('y', baseY - bh - 5);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#8C97A1');
      lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); lbl.setAttribute('font-size', '9');
      lbl.textContent = v; svg.appendChild(lbl);
      return rect;
    });

    const mkPtr = (ch, color) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', color);
      t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      t.setAttribute('font-size', '10'); t.setAttribute('font-weight', '700');
      t.setAttribute('y', baseY + 14); t.setAttribute('x', '-999');
      t.textContent = ch; svg.appendChild(t); return t;
    };
    const ptrL = mkPtr('L', '#15202B');
    const ptrR = mkPtr('R', '#2F6FB0');

    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2); statusSvg.setAttribute('y', baseY + 32);
    statusSvg.setAttribute('text-anchor', 'middle'); statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;

    function renderStep(t) {
      const { L, R, area, max } = trace[t];
      bars.forEach((bar, i) => {
        const active = i === L || i === R;
        bar.setAttribute('fill', active ? '#FFC628' : '#FFFFFF');
        bar.setAttribute('stroke', active ? '#15202B' : '#8C97A1');
      });
      const wH = Math.min(h[L], h[R]) * scaleY;
      water.setAttribute('x', startX + L * barW + 3);
      water.setAttribute('y', baseY - wH);
      water.setAttribute('width', (R - L + 1) * barW - 6);
      water.setAttribute('height', wH);
      water.setAttribute('opacity', '1');
      ptrL.setAttribute('x', startX + L * barW + barW / 2);
      ptrR.setAttribute('x', startX + R * barW + barW / 2);
      statusSvg.textContent = `area=${area}  max=${max}`;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      water.setAttribute('opacity', '0');
      ptrL.setAttribute('x', '-999'); ptrR.setAttribute('x', '-999');
      bars.forEach(b => { b.setAttribute('fill', '#FFFFFF'); b.setAttribute('stroke', '#8C97A1'); });
      statusSvg.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── Mono Stack (LC 739 — Daily Temperatures) ────────────── */
  function monoStack(container) {
    const temps = [73, 74, 75, 71, 69, 72, 76, 73];
    const W = 520, H = 190, n = temps.length;
    const barW = 44, startX = (W - n * barW) / 2, baseY = 138;
    const scaleY = 88 / Math.max(...temps);
    const ns = 'http://www.w3.org/2000/svg';

    const trace = [];
    const stk = [], ans = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      const popped = [];
      while (stk.length && temps[stk[stk.length - 1]] < temps[i]) {
        const j = stk.pop(); ans[j] = i - j; popped.push(j);
      }
      stk.push(i);
      trace.push({ i, stack: [...stk], popped, ans: [...ans] });
    }

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    const bars = temps.map((t, i) => {
      const bh = t * scaleY;
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', startX + i * barW + 3); rect.setAttribute('y', baseY - bh);
      rect.setAttribute('width', barW - 6); rect.setAttribute('height', bh);
      rect.setAttribute('rx', 3); rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#8C97A1'); rect.setAttribute('stroke-width', '1');
      svg.appendChild(rect);
      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', startX + i * barW + barW / 2); lbl.setAttribute('y', baseY - bh - 5);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#8C97A1');
      lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); lbl.setAttribute('font-size', '9');
      lbl.textContent = t; svg.appendChild(lbl);
      return rect;
    });

    const ansLabels = temps.map((_, i) => {
      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', startX + i * barW + barW / 2); lbl.setAttribute('y', baseY + 14);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#8C97A1');
      lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); lbl.setAttribute('font-size', '10');
      lbl.textContent = ''; svg.appendChild(lbl); return lbl;
    });

    const stackLbl = document.createElementNS(ns, 'text');
    stackLbl.setAttribute('x', W / 2); stackLbl.setAttribute('y', baseY + 32);
    stackLbl.setAttribute('text-anchor', 'middle'); stackLbl.setAttribute('fill', '#7D8994');
    stackLbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); stackLbl.setAttribute('font-size', '11');
    stackLbl.textContent = 'press play';
    svg.appendChild(stackLbl);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;

    function renderStep(t) {
      const { i, stack, popped, ans } = trace[t];
      const inStack = new Set(stack);
      bars.forEach((bar, j) => {
        bar.setAttribute('fill',
          j === i         ? '#FFC628' :
          popped.includes(j) ? 'rgba(138,95,0,0.16)' :
          inStack.has(j)  ? 'rgba(255,198,40,0.28)' : '#FFFFFF');
        bar.setAttribute('stroke',
          j === i         ? '#15202B' :
          popped.includes(j) ? '#8A5F00' :
          inStack.has(j)  ? '#7D8994' : '#8C97A1');
        ansLabels[j].textContent = ans[j] > 0 ? ans[j] : '';
        ansLabels[j].setAttribute('fill', ans[j] > 0 ? '#4A5560' : '#8C97A1');
      });
      stackLbl.textContent = `stack: [${stack.map(idx => temps[idx]).join(', ')}]`;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      bars.forEach(b => { b.setAttribute('fill', '#FFFFFF'); b.setAttribute('stroke', '#8C97A1'); });
      ansLabels.forEach(l => { l.textContent = ''; });
      stackLbl.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── 1-D DP (LC 198 — House Robber) ──────────────────────── */
  function dp1d(container) {
    const nums = [2, 7, 9, 3, 1];
    const W = 520, H = 190, n = nums.length;
    const cellW = 60, cellH = 40;
    const startX = (W - n * cellW) / 2;
    const numsY = 38, dpY = 108;
    const ns = 'http://www.w3.org/2000/svg';

    const dp = new Array(n).fill(0);
    dp[0] = nums[0];
    if (n > 1) dp[1] = Math.max(nums[0], nums[1]);
    const choices = ['base', 'base'];
    for (let i = 2; i < n; i++) {
      const skip = dp[i - 1], rob = dp[i - 2] + nums[i];
      dp[i] = Math.max(skip, rob);
      choices.push(rob >= skip ? `rob: ${dp[i-2]}+${nums[i]}=${dp[i]}` : `skip: dp[${i-1}]=${skip}`);
    }
    const trace = nums.map((_, i) => ({ i, filled: dp.slice(0, i + 1) }));

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    const mkRowLbl = (text, y) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', startX - 8); t.setAttribute('y', y + cellH / 2 + 5);
      t.setAttribute('text-anchor', 'end'); t.setAttribute('fill', '#7D8994');
      t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); t.setAttribute('font-size', '10');
      t.textContent = text; svg.appendChild(t);
    };
    mkRowLbl('nums', numsY); mkRowLbl('dp', dpY);

    const numCells = nums.map((v, i) => {
      const x = startX + i * cellW;
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x + 3); rect.setAttribute('y', numsY);
      rect.setAttribute('width', cellW - 6); rect.setAttribute('height', cellH);
      rect.setAttribute('rx', 6); rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#8C97A1'); rect.setAttribute('stroke-width', '1');
      svg.appendChild(rect);
      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', x + cellW / 2); lbl.setAttribute('y', numsY + cellH / 2 + 5);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#4A5560');
      lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      lbl.setAttribute('font-size', '15'); lbl.setAttribute('font-weight', '500');
      lbl.textContent = v; svg.appendChild(lbl);
      return { rect, lbl };
    });

    const dpCells = nums.map((_, i) => {
      const x = startX + i * cellW;
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x + 3); rect.setAttribute('y', dpY);
      rect.setAttribute('width', cellW - 6); rect.setAttribute('height', cellH);
      rect.setAttribute('rx', 6); rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#8C97A1'); rect.setAttribute('stroke-width', '1');
      svg.appendChild(rect);
      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', x + cellW / 2); lbl.setAttribute('y', dpY + cellH / 2 + 5);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#8C97A1');
      lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      lbl.setAttribute('font-size', '15'); lbl.setAttribute('font-weight', '500');
      lbl.textContent = ''; svg.appendChild(lbl);
      return { rect, lbl };
    });

    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2); statusSvg.setAttribute('y', dpY + cellH + 24);
    statusSvg.setAttribute('text-anchor', 'middle'); statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;

    function renderStep(t) {
      const { i, filled } = trace[t];
      numCells.forEach(({ rect, lbl }, j) => {
        rect.setAttribute('fill', j === i ? 'rgba(255,198,40,0.55)' : '#FFFFFF');
        rect.setAttribute('stroke', j === i ? '#15202B' : '#8C97A1');
        lbl.setAttribute('fill', j === i ? '#15202B' : '#4A5560');
      });
      dpCells.forEach(({ rect, lbl }, j) => {
        const done = j < filled.length, cur = j === i;
        rect.setAttribute('fill', cur ? 'rgba(21,32,43,0.11)' : done ? 'rgba(21,32,43,0.04)' : '#FFFFFF');
        rect.setAttribute('stroke', cur ? '#4A5560' : '#8C97A1');
        lbl.setAttribute('fill', done ? '#4A5560' : '#8C97A1');
        lbl.textContent = done ? filled[j] : '';
      });
      statusSvg.textContent = i < 2 ? `dp[${i}] = ${filled[i]}` : choices[i];
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      numCells.forEach(({ rect, lbl }) => { rect.setAttribute('fill', '#FFFFFF'); rect.setAttribute('stroke', '#8C97A1'); lbl.setAttribute('fill', '#4A5560'); });
      dpCells.forEach(({ rect, lbl }) => { rect.setAttribute('fill', '#FFFFFF'); rect.setAttribute('stroke', '#8C97A1'); lbl.textContent = ''; lbl.setAttribute('fill', '#8C97A1'); });
      statusSvg.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── Binary Search (LC 33 — Search in Rotated Array) ─────── */
  function binarySearch(container) {
    const arr = [4, 5, 6, 7, 0, 1, 2], target = 0;
    const W = 520, H = 190, n = arr.length;
    const cellW = 50, cellH = 42;
    const startX = (W - n * cellW) / 2, startY = 46;
    const ns = 'http://www.w3.org/2000/svg';

    const trace = [];
    let l = 0, r = n - 1;
    while (l <= r) {
      const m = Math.floor((l + r) / 2), lc = l, rc = r;
      if (arr[m] === target) {
        trace.push({ l: lc, r: rc, m, sorted: 'found', action: `found ${target} at index ${m}` });
        break;
      }
      let sorted, action;
      if (arr[lc] <= arr[m]) {
        sorted = 'left';
        if (arr[lc] <= target && target < arr[m]) { action = `${arr[lc]}≤t<${arr[m]}: left half → go left`; r = m - 1; }
        else { action = `t not in [${arr[lc]},${arr[m]}): go right`; l = m + 1; }
      } else {
        sorted = 'right';
        if (arr[m] < target && target <= arr[rc]) { action = `${arr[m]}<t≤${arr[rc]}: right half → go right`; l = m + 1; }
        else { action = `t not in (${arr[m]},${arr[rc]}]: go left`; r = m - 1; }
      }
      trace.push({ l: lc, r: rc, m, sorted, action });
    }

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    const sortedBar = document.createElementNS(ns, 'rect');
    sortedBar.setAttribute('y', startY - 8); sortedBar.setAttribute('height', cellH + 16);
    sortedBar.setAttribute('rx', 8); sortedBar.setAttribute('opacity', '0');
    svg.appendChild(sortedBar);

    const cells = arr.map((v, i) => {
      const x = startX + i * cellW;
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x + 2); rect.setAttribute('y', startY);
      rect.setAttribute('width', cellW - 4); rect.setAttribute('height', cellH);
      rect.setAttribute('rx', 6); rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#8C97A1'); rect.setAttribute('stroke-width', '1');
      svg.appendChild(rect);
      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', x + cellW / 2); lbl.setAttribute('y', startY + 27);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#4A5560');
      lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      lbl.setAttribute('font-size', '15'); lbl.setAttribute('font-weight', '500');
      lbl.textContent = v; svg.appendChild(lbl);
      const idx = document.createElementNS(ns, 'text');
      idx.setAttribute('x', x + cellW / 2); idx.setAttribute('y', startY + cellH + 13);
      idx.setAttribute('text-anchor', 'middle'); idx.setAttribute('fill', '#8C97A1');
      idx.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); idx.setAttribute('font-size', '9');
      idx.textContent = i; svg.appendChild(idx);
      return { rect, lbl };
    });

    const mkPtr = (ch, color) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', color);
      t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      t.setAttribute('font-size', '10'); t.setAttribute('font-weight', '700');
      t.setAttribute('y', startY - 10); t.setAttribute('x', '-999');
      t.textContent = ch; svg.appendChild(t); return t;
    };
    const lblL = mkPtr('L', '#15202B');
    const lblM = mkPtr('M', '#8A5F00');
    const lblR = mkPtr('R', '#2F6FB0');

    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2); statusSvg.setAttribute('y', startY + cellH + 34);
    statusSvg.setAttribute('text-anchor', 'middle'); statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;

    function renderStep(t) {
      const { l, r, m, sorted, action } = trace[t];
      const isFound = sorted === 'found';
      cells.forEach(({ rect, lbl }, i) => {
        const active = i >= l && i <= r, isMid = i === m;
        rect.setAttribute('fill',
          isFound && isMid ? 'rgba(21,32,43,0.14)' :
          isMid            ? 'rgba(138,95,0,0.16)'  :
          active           ? 'rgba(255,198,40,0.28)' : '#FFFFFF');
        rect.setAttribute('stroke',
          isFound && isMid ? '#4A5560' : isMid ? '#8A5F00' : active ? '#7D8994' : '#8C97A1');
        lbl.setAttribute('fill',
          isFound && isMid ? '#4A5560' : isMid ? '#15202B' : active ? '#15202B' : '#7D8994');
      });
      if (!isFound) {
        const sl = sorted === 'left' ? l : m + 1;
        const sr = sorted === 'left' ? m : r;
        sortedBar.setAttribute('x', startX + sl * cellW + 2);
        sortedBar.setAttribute('width', (sr - sl + 1) * cellW - 4);
        sortedBar.setAttribute('fill', sorted === 'left' ? 'rgba(255,198,40,0.28)' : 'rgba(47,111,176,0.08)');
        sortedBar.setAttribute('stroke', sorted === 'left' ? '#15202B' : '#2F6FB0');
        sortedBar.setAttribute('stroke-width', '1');
        sortedBar.setAttribute('opacity', '1');
      } else {
        sortedBar.setAttribute('opacity', '0');
      }
      lblL.setAttribute('x', startX + l * cellW + cellW / 2);
      lblM.setAttribute('x', startX + m * cellW + cellW / 2);
      lblR.setAttribute('x', startX + r * cellW + cellW / 2);
      statusSvg.textContent = action;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      cells.forEach(({ rect, lbl }) => { rect.setAttribute('fill', '#FFFFFF'); rect.setAttribute('stroke', '#8C97A1'); lbl.setAttribute('fill', '#4A5560'); });
      sortedBar.setAttribute('opacity', '0');
      lblL.setAttribute('x', '-999'); lblM.setAttribute('x', '-999'); lblR.setAttribute('x', '-999');
      statusSvg.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── Linked List Reverse (LC 92 — Reverse Linked List II) ─── */
  function linkedListReverse(container) {
    const W = 520, H = 190, n = 5;
    const boxW = 44, boxH = 36, gap = 22;
    const totalW = n * boxW + (n - 1) * gap;
    const startX = (W - totalW) / 2, boxY = 72;
    const ns = 'http://www.w3.org/2000/svg';

    // Trace: reverse positions 2→4 on list [1,2,3,4,5]
    const trace = [
      { vals:[1,2,3,4,5], con:0, tail:1, newPos:null, desc:'locate: con→node(1), tail→node(2)' },
      { vals:[1,3,2,4,5], con:0, tail:2, newPos:1,    desc:'move 3 after con  (step 1/2)' },
      { vals:[1,4,3,2,5], con:0, tail:3, newPos:1,    desc:'move 4 after con  — reversed!' },
    ];

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');

    // defs for arrowhead
    const defs = document.createElementNS(ns, 'defs');
    const mkr = document.createElementNS(ns, 'marker');
    mkr.setAttribute('id', 'll-arr'); mkr.setAttribute('markerWidth', '6');
    mkr.setAttribute('markerHeight', '6'); mkr.setAttribute('refX', '5');
    mkr.setAttribute('refY', '3'); mkr.setAttribute('orient', 'auto');
    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttribute('points', '0 0, 6 3, 0 6'); poly.setAttribute('fill', '#8C97A1');
    mkr.appendChild(poly); defs.appendChild(mkr); svg.appendChild(defs);

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    // Arrows between boxes
    for (let i = 0; i < n - 1; i++) {
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', startX + (i + 1) * (boxW + gap) - gap + 3);
      line.setAttribute('x2', startX + (i + 1) * (boxW + gap) - 3);
      line.setAttribute('y1', boxY + boxH / 2); line.setAttribute('y2', boxY + boxH / 2);
      line.setAttribute('stroke', '#8C97A1'); line.setAttribute('stroke-width', '1.5');
      line.setAttribute('marker-end', 'url(#ll-arr)');
      svg.appendChild(line);
    }

    const nodeBoxes = Array.from({ length: n }, (_, i) => {
      const x = startX + i * (boxW + gap);
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x); rect.setAttribute('y', boxY);
      rect.setAttribute('width', boxW); rect.setAttribute('height', boxH);
      rect.setAttribute('rx', 8); rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#8C97A1'); rect.setAttribute('stroke-width', '1');
      svg.appendChild(rect);
      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', x + boxW / 2); lbl.setAttribute('y', boxY + boxH / 2 + 6);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#4A5560');
      lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      lbl.setAttribute('font-size', '16'); lbl.setAttribute('font-weight', '500');
      lbl.textContent = ''; svg.appendChild(lbl);
      return { rect, lbl, cx: x + boxW / 2 };
    });

    const mkPtr = (ch, color) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', color);
      t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      t.setAttribute('font-size', '10'); t.setAttribute('font-weight', '700');
      t.setAttribute('y', boxY - 10); t.setAttribute('x', '-999');
      t.textContent = ch; svg.appendChild(t); return t;
    };
    const ptrCon  = mkPtr('con',  '#15202B');
    const ptrTail = mkPtr('tail', '#4A5560');
    const ptrNew  = mkPtr('↑new', '#8A5F00');

    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2); statusSvg.setAttribute('y', boxY + boxH + 30);
    statusSvg.setAttribute('text-anchor', 'middle'); statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;

    function renderStep(t) {
      const { vals, con, tail, newPos, desc } = trace[t];
      nodeBoxes.forEach(({ rect, lbl, cx }, i) => {
        const isCon = i === con, isTail = i === tail, isNew = i === newPos;
        rect.setAttribute('fill',
          isCon  ? '#FFC628' :
          isTail ? 'rgba(21,32,43,0.09)' :
          isNew  ? 'rgba(138,95,0,0.16)'  : '#FFFFFF');
        rect.setAttribute('stroke',
          isCon  ? '#15202B' : isTail ? '#4A5560' : isNew ? '#8A5F00' : '#8C97A1');
        lbl.setAttribute('fill',
          isCon || isTail || isNew ? '#15202B' : '#4A5560');
        lbl.textContent = vals[i];
      });
      ptrCon.setAttribute('x',  nodeBoxes[con].cx);
      ptrTail.setAttribute('x', nodeBoxes[tail].cx);
      ptrNew.setAttribute('x',  newPos !== null ? nodeBoxes[newPos].cx : '-999');
      statusSvg.textContent = desc;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      nodeBoxes.forEach(({ rect, lbl }) => { rect.setAttribute('fill', '#FFFFFF'); rect.setAttribute('stroke', '#8C97A1'); lbl.textContent = ''; });
      ptrCon.setAttribute('x', '-999'); ptrTail.setAttribute('x', '-999'); ptrNew.setAttribute('x', '-999');
      statusSvg.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── BFS Levels (LC 102 — Level Order Traversal) ─────────── */
  function bfsLevels(container) {
    const W = 520, H = 190;
    const ns = 'http://www.w3.org/2000/svg';
    const R = 18;
    // 5-node tree: 3 / 9 20 / 15 7
    const nodes = [
      { val:3,  x:260, y:36  },
      { val:9,  x:150, y:96  },
      { val:20, x:370, y:96  },
      { val:15, x:310, y:156 },
      { val:7,  x:430, y:156 },
    ];
    const edges = [[0,1],[0,2],[2,3],[2,4]];
    // colors indexed by level (0=unvisited)
    const LEVEL_FILL   = ['#FFFFFF','#FFC628','rgba(47,111,176,0.18)','rgba(21,32,43,0.11)'];
    const LEVEL_STROKE = ['#8C97A1','#15202B','#2F6FB0','#4A5560'];
    const LEVEL_TEXT   = ['#7D8994','#15202B','#15202B','#15202B'];
    const trace = [
      { colors:[1,0,0,0,0], active:[0],   queue:'[9, 20]', desc:'level 0: [3]' },
      { colors:[1,2,2,0,0], active:[1,2], queue:'[15, 7]', desc:'level 1: [9, 20]' },
      { colors:[1,2,2,3,3], active:[3,4], queue:'[]',      desc:'level 2: [15, 7]' },
    ];

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    edges.forEach(([a, b]) => {
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', nodes[a].x); line.setAttribute('y1', nodes[a].y);
      line.setAttribute('x2', nodes[b].x); line.setAttribute('y2', nodes[b].y);
      line.setAttribute('stroke', '#C5CBD0'); line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });

    const circles = nodes.map(({ val, x, y }) => {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', R);
      c.setAttribute('fill', '#FFFFFF'); c.setAttribute('stroke', '#8C97A1'); c.setAttribute('stroke-width', '1.5');
      svg.appendChild(c);
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y + 5); t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', '#7D8994'); t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
      t.setAttribute('font-size', '14'); t.setAttribute('font-weight', '600');
      t.textContent = val; svg.appendChild(t);
      return { c, t };
    });

    const queueLbl = document.createElementNS(ns, 'text');
    queueLbl.setAttribute('x', W / 2); queueLbl.setAttribute('y', H - 14);
    queueLbl.setAttribute('text-anchor', 'middle'); queueLbl.setAttribute('fill', '#7D8994');
    queueLbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); queueLbl.setAttribute('font-size', '11');
    queueLbl.textContent = 'press play';
    svg.appendChild(queueLbl);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;

    function renderStep(t) {
      const { colors, active, queue, desc } = trace[t];
      circles.forEach(({ c, t: lbl }, i) => {
        const lv = colors[i], isActive = active.includes(i);
        c.setAttribute('fill', LEVEL_FILL[lv]);
        c.setAttribute('stroke', isActive ? LEVEL_STROKE[lv] : lv ? LEVEL_STROKE[lv] : '#8C97A1');
        c.setAttribute('stroke-width', isActive ? '2.5' : '1.5');
        lbl.setAttribute('fill', LEVEL_TEXT[lv]);
      });
      queueLbl.textContent = `${desc}  |  queue: ${queue}`;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      circles.forEach(({ c, t: lbl }) => { c.setAttribute('fill', '#FFFFFF'); c.setAttribute('stroke', '#8C97A1'); c.setAttribute('stroke-width', '1.5'); lbl.setAttribute('fill', '#7D8994'); });
      queueLbl.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── Flood Fill (LC 200 — Number of Islands) ──────────────── */
  function floodFill(container) {
    const grid = [[1,1,0,0],[1,0,0,0],[0,0,1,0],[0,0,0,1]];
    const ROWS = 4, COLS = 4;
    const W = 520, H = 190;
    const cellW = 44, cellH = 36;
    const startX = (W - COLS * cellW) / 2, startY = (H - ROWS * cellH) / 2 - 8;
    const ns = 'http://www.w3.org/2000/svg';

    // Pre-compute DFS trace
    const trace = [];
    const seen = Array.from({length: ROWS}, () => new Array(COLS).fill(false));
    let count = 0;
    function dfs(r, c) {
      if (r < 0 || c < 0 || r >= ROWS || c >= COLS || seen[r][c] || !grid[r][c]) return;
      seen[r][c] = true;
      trace.push({ r, c, count, desc: `visit (${r},${c})` });
      dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (grid[r][c] && !seen[r][c]) { count++; dfs(r,c); }
    }
    trace.push({ r:-1, c:-1, count, desc:`${count} islands found` });

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    const cellRects = Array.from({length: ROWS}, (_, r) =>
      Array.from({length: COLS}, (_, c) => {
        const x = startX + c * cellW, y = startY + r * cellH;
        const isLand = !!grid[r][c];
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', x + 2); rect.setAttribute('y', y + 2);
        rect.setAttribute('width', cellW - 4); rect.setAttribute('height', cellH - 4);
        rect.setAttribute('rx', 5);
        rect.setAttribute('fill', isLand ? '#D5DADE' : 'rgba(47,111,176,0.10)');
        rect.setAttribute('stroke', isLand ? '#4A5560' : 'rgba(47,111,176,0.35)');
        rect.setAttribute('stroke-width', '1');
        svg.appendChild(rect);
        const lbl = document.createElementNS(ns, 'text');
        lbl.setAttribute('x', x + cellW / 2); lbl.setAttribute('y', y + cellH / 2 + 5);
        lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', isLand ? '#4A5560' : 'rgba(47,111,176,0.60)');
        lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); lbl.setAttribute('font-size', '13');
        lbl.textContent = grid[r][c]; svg.appendChild(lbl);
        return { rect, lbl };
      })
    );

    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2); statusSvg.setAttribute('y', startY + ROWS * cellH + 20);
    statusSvg.setAttribute('text-anchor', 'middle'); statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;
    const visitedAt = {}; // "r,c" -> step index when first visited

    function renderStep(t) {
      const { r, c, count, desc } = trace[t];
      if (r >= 0) visitedAt[`${r},${c}`] = t;
      for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
        const key = `${row},${col}`, { rect, lbl } = cellRects[row][col];
        const isCur = row === r && col === c;
        const isVisited = key in visitedAt;
        if (isCur) {
          rect.setAttribute('fill', '#FFC628'); rect.setAttribute('stroke', '#15202B');
          lbl.setAttribute('fill', '#15202B');
        } else if (isVisited) {
          rect.setAttribute('fill', 'rgba(255,198,40,0.55)'); rect.setAttribute('stroke', '#8A5F00');
          lbl.setAttribute('fill', '#8A5F00');
        }
      }
      statusSvg.textContent = `islands: ${count}  |  ${desc}`;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      Object.keys(visitedAt).forEach(k => delete visitedAt[k]);
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const isLand = !!grid[r][c], { rect, lbl } = cellRects[r][c];
        rect.setAttribute('fill', isLand ? '#D5DADE' : 'rgba(47,111,176,0.10)');
        rect.setAttribute('stroke', isLand ? '#4A5560' : 'rgba(47,111,176,0.35)');
        lbl.setAttribute('fill', isLand ? '#4A5560' : 'rgba(47,111,176,0.60)');
      }
      statusSvg.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── Subset Tree (LC 78 — Subsets) ───────────────────────── */
  function subsetTree(container) {
    const W = 520, H = 190;
    const ns = 'http://www.w3.org/2000/svg';
    // 8 subsets of [1,2,3] revealed in 4 steps
    const ALL = ['∅','[1]','[2]','[1,2]','[3]','[1,3]','[2,3]','[1,2,3]'];
    const chipW = 56, chipH = 26, gap = 8;
    const cols = 4, rows = 2;
    const totalW = cols * chipW + (cols - 1) * gap;
    const startX = (W - totalW) / 2, startY = 42;
    const trace = [
      { reveal:[0],       desc:'init: result = [∅]' },
      { reveal:[1],       desc:'add 1: new subset [1]' },
      { reveal:[2,3],     desc:'add 2: new subsets [2], [1,2]' },
      { reveal:[4,5,6,7], desc:'add 3: new subsets [3], [1,3], [2,3], [1,2,3]' },
    ];

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    // Header labels
    ['∅', '+1', '+2', '+3'].forEach((lbl, i) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', startX + i * (chipW + gap) + chipW / 2);
      t.setAttribute('y', startY - 10);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#8C97A1');
      t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); t.setAttribute('font-size', '9');
      t.textContent = lbl; svg.appendChild(t);
    });

    const chips = ALL.map((label, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * (chipW + gap);
      const y = startY + row * (chipH + gap + 20);
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x); rect.setAttribute('y', y);
      rect.setAttribute('width', chipW); rect.setAttribute('height', chipH);
      rect.setAttribute('rx', 5); rect.setAttribute('fill', '#FFFFFF');
      rect.setAttribute('stroke', '#C5CBD0'); rect.setAttribute('stroke-width', '1');
      rect.setAttribute('opacity', '0.3');
      svg.appendChild(rect);
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', x + chipW / 2); t.setAttribute('y', y + chipH / 2 + 4);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#8C97A1');
      t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); t.setAttribute('font-size', '11');
      t.textContent = label; svg.appendChild(t);
      return { rect, t };
    });

    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2); statusSvg.setAttribute('y', H - 12);
    statusSvg.setAttribute('text-anchor', 'middle'); statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;
    const revealed = new Set();

    function renderStep(t) {
      trace[t].reveal.forEach(i => revealed.add(i));
      chips.forEach(({ rect, t: lbl }, i) => {
        const isNew = trace[t].reveal.includes(i), isDone = revealed.has(i) && !isNew;
        rect.setAttribute('fill', isNew ? '#FFC628' : isDone ? 'rgba(255,198,40,0.28)' : '#FFFFFF');
        rect.setAttribute('stroke', isNew ? '#15202B' : isDone ? '#7D8994' : '#C5CBD0');
        rect.setAttribute('opacity', revealed.has(i) ? '1' : '0.25');
        lbl.setAttribute('fill', isNew ? '#15202B' : isDone ? '#4A5560' : '#8C97A1');
      });
      statusSvg.textContent = `${trace[t].desc}  (${revealed.size} subsets)`;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      revealed.clear();
      chips.forEach(({ rect, t: lbl }) => {
        rect.setAttribute('fill', '#FFFFFF'); rect.setAttribute('stroke', '#C5CBD0'); rect.setAttribute('opacity', '0.3');
        lbl.setAttribute('fill', '#8C97A1');
      });
      statusSvg.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 750);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  /* ── Spiral Matrix (LC 54 — Spiral Matrix) ────────────────── */
  function spiralMatrix(container) {
    const mat = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
    const ROWS = 4, COLS = 4;
    const W = 520, H = 190;
    const cellW = 46, cellH = 38;
    const startX = (W - COLS * cellW) / 2, startY = (H - ROWS * cellH) / 2 - 6;
    const ns = 'http://www.w3.org/2000/svg';

    // Pre-compute spiral trace
    const trace = [];
    let top=0, bottom=ROWS-1, left=0, right=COLS-1;
    const dirs = ['→','↓','←','↑'];
    let di = 0;
    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c++) trace.push({r:top, c, dir:dirs[0]});
      top++;
      for (let r = top; r <= bottom; r++) trace.push({r, c:right, dir:dirs[1]});
      right--;
      if (top <= bottom) { for (let c = right; c >= left; c--) trace.push({r:bottom, c, dir:dirs[2]}); bottom--; }
      if (left <= right) { for (let r = bottom; r >= top; r--) trace.push({r, c:left, dir:dirs[3]}); left++; }
    }

    container.innerHTML = '';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'anim-svg');
    svg.setAttribute('aria-hidden', 'true');
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#F7F8F8');
    svg.appendChild(bg);

    const cells = Array.from({length: ROWS}, (_, r) =>
      Array.from({length: COLS}, (_, c) => {
        const x = startX + c * cellW, y = startY + r * cellH;
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', x + 2); rect.setAttribute('y', y + 2);
        rect.setAttribute('width', cellW - 4); rect.setAttribute('height', cellH - 4);
        rect.setAttribute('rx', 5); rect.setAttribute('fill', '#FFFFFF');
        rect.setAttribute('stroke', '#8C97A1'); rect.setAttribute('stroke-width', '1');
        svg.appendChild(rect);
        const lbl = document.createElementNS(ns, 'text');
        lbl.setAttribute('x', x + cellW / 2); lbl.setAttribute('y', y + cellH / 2 + 5);
        lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('fill', '#7D8994');
        lbl.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); lbl.setAttribute('font-size', '13');
        lbl.textContent = mat[r][c]; svg.appendChild(lbl);
        return { rect, lbl };
      })
    );

    const statusSvg = document.createElementNS(ns, 'text');
    statusSvg.setAttribute('x', W / 2); statusSvg.setAttribute('y', startY + ROWS * cellH + 22);
    statusSvg.setAttribute('text-anchor', 'middle'); statusSvg.setAttribute('fill', '#7D8994');
    statusSvg.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace'); statusSvg.setAttribute('font-size', '11');
    statusSvg.textContent = 'press play';
    svg.appendChild(statusSvg);
    container.appendChild(svg);

    const controls = document.createElement('div'); controls.className = 'anim-controls';
    const playBtn = document.createElement('button'); playBtn.className = 'anim-btn'; playBtn.textContent = '▶ Play';
    const resetBtn = document.createElement('button'); resetBtn.className = 'anim-btn'; resetBtn.textContent = 'Reset';
    const stepEl = document.createElement('span'); stepEl.className = 'anim-status'; stepEl.textContent = `0 / ${trace.length} steps`;
    controls.append(playBtn, resetBtn, stepEl); container.appendChild(controls);

    let stepIdx = 0, timer = null, playing = false;
    const visitedAt = {};

    function renderStep(t) {
      const { r, c, dir } = trace[t];
      visitedAt[`${r},${c}`] = t;
      cells.forEach((row, ri) => row.forEach(({ rect, lbl }, ci) => {
        const isCur = ri === r && ci === c, isVisited = `${ri},${ci}` in visitedAt;
        rect.setAttribute('fill',
          isCur    ? '#FFC628' :
          isVisited ? 'rgba(255,198,40,0.28)' : '#FFFFFF');
        rect.setAttribute('stroke',
          isCur     ? '#15202B' :
          isVisited ? '#8A5F00' : '#8C97A1');
        lbl.setAttribute('fill',
          isCur     ? '#15202B' :
          isVisited ? '#15202B' : '#7D8994');
      }));
      statusSvg.textContent = `val=${mat[r][c]}  direction ${dir}  (step ${t+1}/${trace.length})`;
      stepEl.textContent = `${t + 1} / ${trace.length} steps`;
    }

    function resetAnim() {
      clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; stepIdx = 0;
      Object.keys(visitedAt).forEach(k => delete visitedAt[k]);
      cells.forEach(row => row.forEach(({ rect, lbl }) => { rect.setAttribute('fill', '#FFFFFF'); rect.setAttribute('stroke', '#8C97A1'); lbl.setAttribute('fill', '#7D8994'); }));
      statusSvg.textContent = 'press play'; stepEl.textContent = `0 / ${trace.length} steps`;
    }

    function playAnim() {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; return; }
      if (stepIdx >= trace.length) resetAnim();
      playing = true; playBtn.textContent = '⏸ Pause';
      timer = setInterval(() => {
        renderStep(stepIdx++);
        if (stepIdx >= trace.length) { clearInterval(timer); playing = false; playBtn.textContent = '▶ Play'; }
      }, 700);
    }

    playBtn.addEventListener('click', playAnim);
    resetBtn.addEventListener('click', resetAnim);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playBtn.disabled = true; playBtn.title = 'Animations disabled (prefers-reduced-motion)';
    }
  }

  return { slidingWindow, twoPointers, monoStack, dp1d, binarySearch, linkedListReverse, bfsLevels, floodFill, subsetTree, spiralMatrix };

})();
