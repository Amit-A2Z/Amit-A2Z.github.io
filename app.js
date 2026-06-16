// Mindset landing - progressive enhancement only. Page is fully readable
// without JS; this adds the scroll reveal, counters, and the nav hand-off.
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Nav: wordmark (on dark hero) hands off to {M} on scroll (BRAND.md sec.7).
  //      Never both at once. Solid glass + ink links once scrolled onto light. ----
  var nav = document.getElementById('nav');
  var navMarkDark = document.getElementById('nav-mark-dark');
  var navMarkLight = document.getElementById('nav-mark-light');
  function onScroll() {
    if (!nav) return;
    var solid = window.scrollY > 24;
    nav.classList.toggle('nav-solid', solid);
    // {M} swaps tone with the surface: bracket-dark on the hero, bracket-light on warm-white.
    if (navMarkDark) navMarkDark.classList.toggle('hidden', solid);
    if (navMarkLight) navMarkLight.classList.toggle('hidden', !solid);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
