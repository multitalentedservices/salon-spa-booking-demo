/* Velvet & Stone (Demo) — Swiper rails (team + gallery pages only).
   Transforms the existing static grids into touch rails. Without JS, with
   reduced motion, or if Swiper fails to load, the grids stay exactly as
   designed — complete and scrollable as a page. Swiper runs on native page
   scroll (no Lenis on this site), so there is no scroll-sync conflict:
   the rail captures horizontal touch, the page keeps vertical scroll. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Static capture mode (?static=1 / data-static): grids stay static. */
  var STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute('data-static');
  if (STATIC) document.documentElement.setAttribute('data-static', '');
  if (reduceMotion || STATIC || !window.Swiper) return;

  function railify(container, label) {
    if (!container || container.children.length < 2) return null;
    var items = Array.prototype.slice.call(container.children);
    var swiperEl = document.createElement('div');
    swiperEl.className = 'swiper rail-swiper';
    swiperEl.setAttribute('aria-label', label);
    var wrap = document.createElement('div');
    wrap.className = 'swiper-wrapper';
    items.forEach(function (item) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.appendChild(item);
      wrap.appendChild(slide);
    });
    var pagination = document.createElement('div');
    pagination.className = 'swiper-pagination';
    swiperEl.appendChild(wrap);
    swiperEl.appendChild(pagination);
    container.replaceWith(swiperEl);
    return new Swiper(swiperEl, {
      slidesPerView: 1.12,
      spaceBetween: 16,
      keyboard: { enabled: true },
      pagination: { el: pagination, clickable: true },
      breakpoints: {
        700: { slidesPerView: 2.15 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  var team = railify(document.querySelector('[data-team]'), 'Stylists — swipe or use the dots to browse');
  var gallery = railify(document.querySelector('.gallery-grid'), 'Gallery — swipe or use the dots to browse');
  window.__vsSwipers = { team: !!team, gallery: !!gallery };
})();
