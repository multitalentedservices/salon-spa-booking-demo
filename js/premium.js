/* Velvet & Stone (Demo) — Premium layer (home page only).
   GSAP ScrollTrigger pinned "ritual" chapter (P3 signature moment):
   atmosphere before price — three chapters crossfade as the guest scrolls.
   No Lenis on this site (recorded deviation: Swiper + GSAP + Lenis together
   break the P8 hero budget; native scroll is kept and ScrollTrigger runs on
   it directly). Progressive enhancement throughout: without JS, reduced
   motion, or the libraries, all three chapters and images are simply
   stacked and visible — the designed static page. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Static capture mode (?static=1 / data-static): chapters stay stacked. */
  var STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute('data-static');
  if (STATIC) document.documentElement.setAttribute('data-static', '');
  if (reduceMotion || STATIC) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  var stage = document.querySelector('.ritual-stage');
  if (!stage) return;

  gsap.registerPlugin(ScrollTrigger);
  stage.classList.add('ritual-enhanced');

  var imgs = stage.querySelectorAll('[data-ritual-img]');
  var steps = stage.querySelectorAll('[data-ritual-step]');
  gsap.set(imgs, { autoAlpha: 0 });
  gsap.set(imgs[0], { autoAlpha: 1 });
  gsap.set(steps, { autoAlpha: 0.32 });
  gsap.set(steps[0], { autoAlpha: 1 });

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.ritual',
      start: 'top top+=80',
      end: '+=140%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1
    }
  });
  tl.to(imgs[0], { autoAlpha: 0, duration: 1 }, 1)
    .to(steps[0], { autoAlpha: 0.32, duration: 1 }, 1)
    .to(imgs[1], { autoAlpha: 1, duration: 1 }, 1)
    .to(steps[1], { autoAlpha: 1, duration: 1 }, 1)
    .to({}, { duration: 0.7 })
    .to(imgs[1], { autoAlpha: 0, duration: 1 })
    .to(steps[1], { autoAlpha: 0.32, duration: 1 }, '<')
    .to(imgs[2], { autoAlpha: 1, duration: 1 }, '<')
    .to(steps[2], { autoAlpha: 1, duration: 1 }, '<')
    .to({}, { duration: 0.7 });
  window.__vsRitual = tl;
})();
