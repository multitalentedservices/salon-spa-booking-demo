/* Velvet & Stone (Demo) — shared chrome: nav, reveal-on-scroll (lesson 2 + 11). */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Reveal: hidden state comes from the .js class in CSS; IO with a generous
     rootMargin pre-reveals before elements enter, and a 2s unconditional
     fallback reveals everything no matter what. */
  var revealEls = document.querySelectorAll('.reveal');
  function revealAll() { revealEls.forEach(function (el) { el.classList.add('seen'); }); }
  if (!('IntersectionObserver' in window)) { revealAll(); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px 45% 0px', threshold: 0.01 });
  revealEls.forEach(function (el) { io.observe(el); });
  setTimeout(revealAll, 2000);
})();
