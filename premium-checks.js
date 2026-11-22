/* Premium-layer checks — Velvet & Stone (2026-11-22). SEPARATE from tests.js
   (which is unamended). Static assertions on the premium upgrade only.
   Run: node premium-checks.js */
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const R = __dirname;
let pass = 0, fail = 0;
function ok(cond, label) { if (cond) { pass++; console.log('PASS', label); } else { fail++; console.log('FAIL', label); } }
function read(p) { return fs.readFileSync(path.join(R, p), 'utf8'); }
function gz(p) { return zlib.gzipSync(fs.readFileSync(path.join(R, p))).length; }

const idx = read('index.html');
const css = read('css/style.css');
const premium = read('js/premium.js');
const swiperInit = read('js/swiper-init.js');

['gsap.min.js', 'ScrollTrigger.min.js', 'swiper-bundle.min.js', 'swiper-bundle.min.css'].forEach(f =>
  ok(fs.existsSync(path.join(R, 'assets/vendor', f)), 'vendor copied: ' + f));
ok(!fs.existsSync(path.join(R, 'assets/vendor/lenis.min.js')), 'Lenis NOT copied (recorded P8 deviation)');

/* Per-page loading */
ok(idx.includes('assets/vendor/gsap.min.js') && idx.includes('js/premium.js'), 'home loads GSAP ritual stack');
['services.html', 'visit.html', 'booking.html'].forEach(p =>
  ok(!read(p).includes('assets/vendor/'), p + ' loads no vendor files'));
['team.html', 'gallery.html'].forEach(p => {
  const h = read(p);
  ok(h.includes('swiper-bundle.min.css') && h.includes('swiper-bundle.min.js') && h.includes('js/swiper-init.js'),
    p + ' loads Swiper rail stack');
});
ok(premium.includes('gsap.registerPlugin(ScrollTrigger)'), 'ScrollTrigger registered explicitly');
ok(premium.includes('pin: true') && premium.includes('scrub'), 'ritual chapter is pinned + scrubbed');
ok(idx.includes('ritual-step') && idx.includes('Take the ritual home'), 'ritual chapter + product shelf present in static HTML');
ok(swiperInit.includes('new Swiper') && swiperInit.includes('prefers-reduced-motion'), 'Swiper init present, reduced-motion safe');

/* Booking micro-interactions at the 420ms median */
ok(css.includes('step-in .42s'), 'booking step transition is 420ms');
ok(css.includes('@view-transition'), 'CSS View Transitions present');
ok(css.includes('a{color:var(--bronze-dark);text-decoration:none}'), 'P1 base link rule intact');

/* P8 weights (gzip) */
const base = gz('js/data.js') + gz('js/logic.js') + gz('js/render.js') + gz('js/main.js');
const home = base + gz('assets/vendor/gsap.min.js') + gz('assets/vendor/ScrollTrigger.min.js') + gz('js/premium.js');
const rail = base + gz('assets/vendor/swiper-bundle.min.js') + gz('js/swiper-init.js');
const booking = base + gz('js/booking.js');
console.log('  home JS gzip =', home, '| rail JS gzip =', rail, '| booking JS gzip =', booking);
ok(home <= 90 * 1024, 'P8 hero budget: home <= 90 KB gzip');
ok(rail <= 90 * 1024, 'P8 hero budget: team/gallery <= 90 KB gzip');
ok(booking <= 20 * 1024, 'P8 plain budget: booking <= 20 KB gzip');
ok(base <= 20 * 1024, 'P8 plain budget: services/visit <= 20 KB gzip');

console.log('\nPREMIUM CHECKS: ' + pass + ' PASS, ' + fail + ' FAIL');
process.exit(fail ? 1 : 0);
