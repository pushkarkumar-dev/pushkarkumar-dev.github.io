(function () {
  'use strict';

  /* ── Pattern accent colors ─────────────────────────────────── */
  const PAT_COLORS = {
    'Sliding Window':        '#e0a96d',
    'Two Pointers':          '#7aa6c2',
    'Stack':                 '#d27a4f',
    'Binary Search':         '#8fb086',
    'Linked List':           '#b58cb0',
    'Trees':                 '#8fb086',
    'Tries':                 '#b58cb0',
    'Heap / Priority Queue': '#e0a96d',
    'Backtracking':          '#d27a4f',
    'Graphs':                '#7aa6c2',
    'Advanced Graphs':       '#7aa6c2',
    '1-D DP':                '#b58cb0',
    '2-D DP':                '#b58cb0',
    'Intervals':             '#e0a96d',
    'Greedy':                '#d27a4f',
    'Math & Geometry':       '#7aa6c2',
    'Bit Manipulation':      '#8fb086',
    'Arrays & Hashing':      '#f0bc7d',
  };

  /* ── State ─────────────────────────────────────────────────── */
  let activePattern = null;
  let searchQuery   = '';
  let openIds       = new Set();
  let animInited    = new Set();

  /* ── DOM refs ──────────────────────────────────────────────── */
  const searchEl   = document.getElementById('dsa-search');
  const chipsEl    = document.getElementById('dsa-chips');
  const cardsEl    = document.getElementById('dsa-cards');
  const countEl    = document.getElementById('dsa-count');
  const expandBtn  = document.getElementById('dsa-expand-all');
  const collapseBtn= document.getElementById('dsa-collapse-all');

  /* ── Helpers ───────────────────────────────────────────────── */
  function getFiltered() {
    return (window.PROBLEMS || []).filter(function (p) {
      if (activePattern && p.pattern !== activePattern) return false;
      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.pattern.toLowerCase().includes(q) ||
          String(p.id).includes(q)
        );
      }
      return true;
    });
  }

  function diffClass(d) {
    return d === 'Easy' ? 'diff-easy' : d === 'Hard' ? 'diff-hard' : 'diff-medium';
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Card builder ──────────────────────────────────────────── */
  function buildCard(p) {
    var color  = PAT_COLORS[p.pattern] || '#5e5448';
    var isOpen = openIds.has(p.id);

    var card = document.createElement('div');
    card.className = 'card' + (isOpen ? ' open' : '');
    card.style.setProperty('--pat-color', color);
    card.dataset.id = p.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    /* Head */
    card.innerHTML =
      '<div class="card-head">' +
        '<span class="card-num">#' + esc(p.id) + '</span>' +
        '<span class="card-name">' + esc(p.name) + '</span>' +
        '<span class="card-tags">' +
          '<span class="card-pattern">' + esc(p.pattern) + '</span>' +
          '<span class="diff ' + diffClass(p.difficulty) + '">' + esc(p.difficulty) + '</span>' +
        '</span>' +
        '<svg class="card-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
          '<path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>' +
      '<div class="card-body">' +
        buildBody(p) +
      '</div>';

    /* Interaction */
    var head = card.querySelector('.card-head');
    head.addEventListener('click', function () { toggle(card, p); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(card, p); }
    });

    /* Attach animation placeholder if needed */
    if (p.animation) {
      var body = card.querySelector('.card-body');
      var animBlock = document.createElement('div');
      animBlock.className = 'anim-block';
      animBlock.innerHTML =
        '<div class="anim-badge"><div class="anim-badge-dot"></div>LIVE DEMO</div>';
      var animContainer = document.createElement('div');
      animBlock.appendChild(animContainer);
      body.appendChild(animBlock);
      card._animKey       = p.animation;
      card._animContainer = animContainer;
    }

    return card;
  }

  function buildBody(p) {
    var triggerHtml  = p.trigger.map(function (t) { return '<span class="trigger-tag">' + esc(t) + '</span>'; }).join('');
    var approachHtml = p.approach.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    var pitfallsHtml = p.pitfalls.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
    var variantsHtml = p.variants.map(function (v) { return '<span class="variant-tag">' + esc(v) + '</span>'; }).join('');

    return (
      (p.summary ? '<p class="problem-summary">' + esc(p.summary) + '</p>' : '') +

      '<div class="card-section">' +
        '<div class="section-label">When to use</div>' +
        '<div class="trigger-list">' + triggerHtml + '</div>' +
      '</div>' +

      '<div class="card-body-grid">' +

        '<div>' +
          '<div class="card-section">' +
            '<div class="section-label">Core idea</div>' +
            '<p class="core-en">' + esc(p.coreIdea) + '</p>' +
            '<p class="core-hi">' + esc(p.coreIdeaHinglish) + '</p>' +
          '</div>' +

          '<div class="card-section">' +
            '<div class="section-label">Approach</div>' +
            '<ol class="approach-list">' + approachHtml + '</ol>' +
          '</div>' +

          '<div class="card-section">' +
            '<div class="section-label">Complexity</div>' +
            '<div class="complexity-row">' +
              '<span class="complexity-item"><span class="complexity-label">Time&nbsp;</span><span class="complexity-val">' + esc(p.time) + '</span></span>' +
              '<span class="complexity-item"><span class="complexity-label">Space&nbsp;</span><span class="complexity-val">' + esc(p.space) + '</span></span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div class="card-section">' +
            '<div class="section-label">Skeleton</div>' +
            '<pre class="code-block">' + esc(p.code) + '</pre>' +
          '</div>' +
        '</div>' +

      '</div>' +

      '<div class="card-section">' +
        '<div class="section-label">Pitfalls</div>' +
        '<ul class="pitfall-list">' + pitfallsHtml + '</ul>' +
      '</div>' +

      '<div class="card-section">' +
        '<div class="section-label">Variants</div>' +
        '<div class="variant-list">' + variantsHtml + '</div>' +
      '</div>'
    );
  }

  /* ── Toggle ────────────────────────────────────────────────── */
  function toggle(card, p) {
    var nowOpen = card.classList.toggle('open');
    card.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
    if (nowOpen) {
      openIds.add(p.id);
      maybeInitAnim(card);
    } else {
      openIds.delete(p.id);
    }
  }

  function maybeInitAnim(card) {
    if (!card._animKey || animInited.has(card._animKey + card.dataset.id)) return;
    var animations = window.DSA && window.DSA.ANIMATIONS;
    if (animations && typeof animations[card._animKey] === 'function') {
      animations[card._animKey](card._animContainer);
      animInited.add(card._animKey + card.dataset.id);
    }
  }

  /* ── Render ────────────────────────────────────────────────── */
  function render() {
    var problems = getFiltered();
    var total    = (window.PROBLEMS || []).length;

    cardsEl.innerHTML = '';

    if (problems.length === 0) {
      cardsEl.innerHTML = '<div class="dsa-empty">No problems match — try a different search or pattern.</div>';
    } else {
      problems.forEach(function (p) {
        cardsEl.appendChild(buildCard(p));
      });
    }

    countEl.innerHTML = 'showing <strong>' + problems.length + '</strong> of ' + total + ' problems';
  }

  /* ── Chips ─────────────────────────────────────────────────── */
  function buildChips() {
    var counts = {};
    (window.PROBLEMS || []).forEach(function (p) {
      counts[p.pattern] = (counts[p.pattern] || 0) + 1;
    });

    function makeChip(label, pattern, count) {
      var chip = document.createElement('button');
      chip.className = 'dsa-chip' + (activePattern === pattern ? ' active' : '');
      chip.dataset.pattern = pattern || '';
      chip.innerHTML = label + (count != null ? ' <span class="chip-count">' + count + '</span>' : '');
      return chip;
    }

    chipsEl.appendChild(makeChip('All', '', null));

    Object.keys(counts).forEach(function (pat) {
      chipsEl.appendChild(makeChip(pat, pat, counts[pat]));
    });

    chipsEl.addEventListener('click', function (e) {
      var chip = e.target.closest('.dsa-chip');
      if (!chip) return;
      activePattern = chip.dataset.pattern || null;
      chipsEl.querySelectorAll('.dsa-chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      render();
    });
  }

  /* ── Init ──────────────────────────────────────────────────── */
  function init() {
    buildChips();
    render();

    searchEl.addEventListener('input', function (e) {
      searchQuery = e.target.value.trim();
      render();
    });

    expandBtn.addEventListener('click', function () {
      openIds = new Set((window.PROBLEMS || []).map(function (p) { return p.id; }));
      render();
    });

    collapseBtn.addEventListener('click', function () {
      openIds.clear();
      render();
    });

    /* Keyboard: '/' = focus search, Esc = clear search */
    document.addEventListener('keydown', function (e) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        var app = document.querySelector('.dsa-app');
        if (!app) return;
        e.preventDefault();
        searchEl.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchEl) {
        searchEl.value = '';
        searchQuery    = '';
        searchEl.blur();
        render();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
