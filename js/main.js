/* ==========================================================================
   Portfolio — main.js  (vanilla JS, no dependencies)
   01. Theme toggle (dark / light, remembered)
   02. Sticky nav + active section highlight + mobile menu
   03. Dot-grid parallax on scroll
   04. Reveal-on-scroll
   05. GitHub chart fallback grid
   06. Mock game console
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- tiny safe storage wrapper (never throws in sandboxed frames) -- */
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ============================ 01. THEME ============================ */
  var THEME_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-bs-theme', theme);       // keeps Bootstrap components in sync
    var btn = document.getElementById('themeBtn');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    var favicon = document.getElementById('favicon');
    if (favicon) favicon.href = theme === 'light' ? 'assets/image/favicon-light.svg' : 'assets/image/favicon.svg';
  }

  // Saved choice wins; first-time visitors get dark (the site is designed dark-first).
  var saved = store.get(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    applyTheme('dark');
    // Prefer to follow the visitor's OS setting instead? Swap the line above for:
    // applyTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      store.set(THEME_KEY, next);
    });
  }

  /* ============================ 02. NAV ============================ */
  var navWrap = document.getElementById('navWrap');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  function setActiveLink() {
    var pos = window.scrollY + window.innerHeight * 0.32;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) current = sections[i];
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id);
    });
  }

  function onScroll() {
    var y = window.scrollY;

    if (navWrap) navWrap.classList.toggle('is-stuck', y > 12);

    setActiveLink();
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ============================ 04. REVEAL ============================ */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ==================== 05. GITHUB CHART FALLBACK ==================== */
  // If the contribution image can't load (wrong username, offline, blocked),
  // draw a neutral placeholder grid so the section never looks broken.
  var ghChart = document.getElementById('ghChart');
  if (ghChart) {
    var drawMockGrid = function () {
      var wrap = document.getElementById('ghGraph');
      if (!wrap || wrap.querySelector('.gh-mock')) return;
      var grid = document.createElement('div');
      grid.className = 'gh-mock';
      grid.setAttribute('role', 'img');
      grid.setAttribute('aria-label', 'Placeholder contribution grid');
      var html = '';
      for (var i = 0; i < 371; i++) {
        var r = Math.random();
        var lvl = r > 0.94 ? 4 : r > 0.82 ? 3 : r > 0.62 ? 2 : r > 0.38 ? 1 : 0;
        html += '<i data-l="' + lvl + '"></i>';
      }
      grid.innerHTML = html;
      wrap.innerHTML = '';
      wrap.appendChild(grid);
    };

    ghChart.addEventListener('error', drawMockGrid);
    // If the image already failed before this script ran, the browser marks
    // it complete with no dimensions. Note: this only works for raster images
    // -- SVGs (like the chart here) report naturalWidth === 0 even when they
    // load fine, so don't gate on naturalWidth for an <img> that may be an SVG.
  }

  /* ==================== 05b. GITHUB STATS ==================== */
  // Pulls a few real numbers from the public GitHub REST API (no auth token,
  // so it's subject to GitHub's unauthenticated rate limit of 60 req/hr/IP).
  // On any failure (offline, rate-limited, username typo) the tiles just show
  // an em dash instead of breaking the layout.
  var ghStats = document.getElementById('ghStats');
  if (ghStats) {
    var GH_USER = 'kimcatalan12'; // EDIT ME: keep in sync with the profile link above
    var setStat = function (key, value) {
      var el = ghStats.querySelector('[data-stat="' + key + '"]');
      if (el) { el.textContent = value; el.classList.remove('is-loading'); }
    };

    fetch('https://api.github.com/users/' + GH_USER)
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
      .then(function (user) {
        setStat('repos', user.public_repos);
        setStat('followers', user.followers);
        var years = (new Date().getFullYear()) - (new Date(user.created_at)).getFullYear();
        setStat('years', Math.max(years, 1) + '+');
      })
      .catch(function () {
        setStat('repos', '–'); setStat('followers', '–'); setStat('years', '–');
      });

    // Stars aren't on the user object, so total them across public repos.
    fetch('https://api.github.com/users/' + GH_USER + '/repos?per_page=100&type=owner')
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
      .then(function (repos) {
        var stars = repos.reduce(function (sum, r) { return sum + (r.stargazers_count || 0); }, 0);
        setStat('stars', stars);
      })
      .catch(function () { setStat('stars', '–'); });
  }

  /* ==================== 06. MOCK GAME CONSOLE ==================== */
  // Purely decorative: no game logic, just a looping animation + fake score.
  var consoleEl = document.getElementById('gameConsole');
  var startBtn = document.getElementById('mockStart');
  var scoreEl = document.getElementById('mockScore');
  var scoreTimer = null;

  if (consoleEl && startBtn) {
    startBtn.addEventListener('click', function () {
      var playing = consoleEl.classList.toggle('is-playing');
      if (playing && scoreEl && !reduceMotion) {
        var score = 420;
        scoreTimer = setInterval(function () {
          score += Math.floor(Math.random() * 25) + 5;
          scoreEl.textContent = String(score).padStart(5, '0');
        }, 380);
        // stop the demo loop after a while so it isn't animating forever
        setTimeout(function () {
          consoleEl.classList.remove('is-playing');
          clearInterval(scoreTimer);
        }, 14000);
      } else {
        clearInterval(scoreTimer);
      }
    });
  }

  /* -------------------------- misc -------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
