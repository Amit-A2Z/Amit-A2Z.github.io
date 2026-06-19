// Mindset landing - progressive enhancement only. Page is fully readable
// without JS; this adds the scroll reveal, counters, and the nav hand-off.
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var root = document.documentElement;
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Theme: persisted manual choice, else system preference. ----
  var STORE = 'mindset-theme';
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() { return root.classList.contains('dark'); }
  function savedChoice() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }

  // ---- Nav: the glass bar AND the wordmark->{M} logo morph both key off one
  // scroll state. JS only toggles .nav-solid past the hero; the morph and its
  // theme-aware colors are pure CSS (see .bracket-morph rules in styles). ----
  var nav = document.getElementById('nav');
  function syncNav() {
    if (!nav) return;
    nav.classList.toggle('nav-solid', window.scrollY > 24);
  }
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  // ---- Theme toggle (persists choice; 44px target; aria-pressed reflects state) ----
  var toggle = document.getElementById('theme-toggle');
  function reflect() { if (toggle) toggle.setAttribute('aria-pressed', String(isDark())); }
  reflect();
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = !isDark();
      root.classList.toggle('dark', next);
      try { localStorage.setItem(STORE, next ? 'dark' : 'light'); } catch (e) {}
      reflect();
      syncNav();
    });
  }
  // Follow the OS only while the user hasn't made a manual choice.
  systemDark.addEventListener('change', function (e) {
    if (savedChoice()) return;
    root.classList.toggle('dark', e.matches);
    reflect();
    syncNav();
  });

  // ---- Reveal once (BRAND.md sec.6: once:true, never re-animate) ----
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---- Counters (~0.9s, tabular-nums on the elements) ----
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var dur = 900, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }
})();
