/* Velvet & Stone (Demo) — Node test battery. Shares js/logic.js + js/data.js with the site. */
const fs = require('fs');
const path = require('path');
const L = require('./js/logic.js');
const D = require('./js/data.js');

let pass = 0, fail = 0;
function t(name, cond) { if (cond) { pass++; console.log('PASS', name); } else { fail++; console.log('FAIL', name); } }
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

/* --- Data integrity --- */
t('16 services defined', D.SERVICES.length === 16);
t('4 stylists defined', D.STYLISTS.length === 4);
t('4 categories + all', D.CATEGORIES.length === 5);
t('service ids unique', new Set(D.SERVICES.map(s => s.id)).size === D.SERVICES.length);
t('stylist ids unique', new Set(D.STYLISTS.map(s => s.id)).size === D.STYLISTS.length);
t('every service has price>0, duration>0, blurb', D.SERVICES.every(s => s.price > 0 && s.duration > 0 && s.blurb.length > 10));
t('every service category valid', D.SERVICES.every(s => ['hair', 'skin', 'nails', 'spa'].includes(s.category)));
t('every category has >=3 services', ['hair', 'skin', 'nails', 'spa'].every(c => D.SERVICES.filter(s => s.category === c).length >= 3));
t('every stylist service id exists', D.STYLISTS.every(st => st.services.every(id => L.serviceById(D.SERVICES, id))));
t('every stylist photo file exists', D.STYLISTS.every(st => fs.existsSync(path.join(__dirname, st.photo))));
t('every review has 4-5 stars + text', D.REVIEWS.every(r => r.stars >= 4 && r.stars <= 5 && r.text.length > 20));

/* --- Filter logic --- */
t('filter all returns 16', L.filterServices(D.SERVICES, 'all').length === 16);
t('filter hair returns only hair', L.filterServices(D.SERVICES, 'hair').every(s => s.category === 'hair'));
t('filter hair count = 4', L.filterServices(D.SERVICES, 'hair').length === 4);
t('filter spa count = 4', L.filterServices(D.SERVICES, 'spa').length === 4);
t('filter unknown category returns 0', L.filterServices(D.SERVICES, 'zzz').length === 0);
t('filter does not mutate source', (() => { const a = D.SERVICES.length; L.filterServices(D.SERVICES, 'hair'); return D.SERVICES.length === a; })());

/* --- Stylist coverage --- */
t('balayage only covered by aisha', eq(L.stylistsForServices(D.STYLISTS, ['balayage']).map(s => s.id), ['aisha']));
t('nail-art only covered by zara', eq(L.stylistsForServices(D.STYLISTS, ['nail-art']).map(s => s.id), ['zara']));
t('cut covered by aisha+bilal', eq(L.stylistsForServices(D.STYLISTS, ['signature-cut']).map(s => s.id), ['aisha', 'bilal']));
t('no services selected -> all stylists', L.stylistsForServices(D.STYLISTS, []).length === 4);
t('hair+nails combo covered by nobody', L.stylistsForServices(D.STYLISTS, ['balayage', 'nail-art']).length === 0);

/* --- Totals --- */
t('totals single cut = 3500/60', eq(L.totals(D.SERVICES, ['signature-cut']), { price: 3500, duration: 60 }));
t('totals balayage+blowout = 17000/195', eq(L.totals(D.SERVICES, ['balayage', 'blowout']), { price: 17000, duration: 195 }));
t('totals empty = 0/0', eq(L.totals(D.SERVICES, []), { price: 0, duration: 0 }));
t('totals ignores unknown id', eq(L.totals(D.SERVICES, ['nope']), { price: 0, duration: 0 }));
t('formatPKR 14500', L.formatPKR(14500) === 'PKR 14,500');
t('formatDuration 195 = 3 hr 15 min', L.formatDuration(195) === '3 hr 15 min');
t('formatDuration 45', L.formatDuration(45) === '45 min');
t('formatDuration 120', L.formatDuration(120) === '2 hr');

/* --- Slots --- */
const NOW = new Date('2026-11-24T09:00:00'); // a Tuesday
t('2026-11-23 is a Monday (closed)', L.isClosedDay('2026-11-23') === true);
t('2026-11-24 is not closed', L.isClosedDay('2026-11-24') === false);
t('Monday slots = []', L.generateSlots('2026-11-23', 'aisha', NOW).length === 0);
t('past date slots = []', L.generateSlots('2026-11-20', 'aisha', NOW).length === 0);
t('open day has 10 slots (10:00-19:00)', L.generateSlots('2026-11-24', 'aisha', NOW).length === 10);
t('first slot 10:00, last 19:00', (() => { const s = L.generateSlots('2026-11-24', 'aisha', NOW); return s[0].time === '10:00' && s[9].time === '19:00'; })());
t('slots deterministic across calls', eq(L.generateSlots('2026-11-25', 'zara', NOW), L.generateSlots('2026-11-25', 'zara', NOW)));
t('some slots taken, some available (demo mix)', (() => { const s = L.generateSlots('2026-11-25', 'aisha', NOW); return s.some(x => x.taken) && s.some(x => x.available); })());
t('taken slots are not available', L.generateSlots('2026-11-25', 'aisha', NOW).every(x => !x.taken || !x.available));
t('today: slots at/before now are past', (() => { const late = new Date('2026-11-24T15:30:00'); const s = L.generateSlots('2026-11-24', 'aisha', late); return s.filter(x => x.past).length === 6 && s.find(x => x.time === '16:00').past === false; })());
t('isPastDate rejects yesterday', L.isPastDate('2026-11-23', NOW) === true);
t('isPastDate accepts today', L.isPastDate('2026-11-24', NOW) === false);
t('isPastDate rejects garbage', L.isPastDate('hello', NOW) === true);

/* --- Validation --- */
const GOOD = { serviceIds: ['signature-cut'], stylistId: 'aisha', date: '2026-11-25', time: '11:00', name: 'Ayesha Malik', phone: '0321 4567890' };
t('valid booking has no errors', Object.keys(L.validateBooking(GOOD, NOW)).length === 0);
t('empty booking flags all fields', (() => { const e = L.validateBooking({}, NOW); return ['services', 'stylist', 'date', 'time', 'name', 'phone'].every(k => e[k]); })());
t('past date rejected', !!L.validateBooking({ ...GOOD, date: '2026-11-20' }, NOW).date);
t('Monday rejected with closed message', /Mondays/.test(L.validateBooking({ ...GOOD, date: '2026-11-30' }, NOW).date || '')); // future Monday (2026-11-23 was also past, past-check fires first — test corrected, disclosed in verdict)
t('short name rejected', !!L.validateBooking({ ...GOOD, name: 'Al' }, NOW).name);
t('bad phone rejected', !!L.validateBooking({ ...GOOD, phone: '123' }, NOW).phone);
t('intl phone accepted', !L.validateBooking({ ...GOOD, phone: '+92 321 4567890' }, NOW).phone);
t('first-available stylist accepted', !L.validateBooking({ ...GOOD, stylistId: 'any' }, NOW).stylist);
t('missing time rejected', !!L.validateBooking({ ...GOOD, time: '' }, NOW).time);

/* --- WhatsApp construction --- */
const wa = L.buildWhatsAppLink(GOOD, D.SERVICES, D.STYLISTS);
t('wa link starts with wa.me demo number', wa.startsWith('https://wa.me/923214567890?text='));
t('wa message contains service name', decodeURIComponent(wa).includes('Signature Cut & Finish'));
t('wa message contains stylist name', decodeURIComponent(wa).includes('Aisha Khan'));
t('wa message contains total PKR 3,500', decodeURIComponent(wa).includes('PKR 3,500'));
t('wa message contains booking ref', decodeURIComponent(wa).includes(L.bookingRef(GOOD)));
t('booking ref format VS-DEMO-NNNN', /^VS-DEMO-\d{4}$/.test(L.bookingRef(GOOD)));
t('booking ref deterministic', L.bookingRef(GOOD) === L.bookingRef({ ...GOOD }));

/* --- Link & file integrity across all pages --- */
const PAGES = ['index.html', 'services.html', 'team.html', 'booking.html', 'gallery.html', 'visit.html'];
let refs = 0, badRefs = [];
for (const p of PAGES) {
  const html = fs.readFileSync(path.join(__dirname, p), 'utf8');
  t(p + ' has DEMO labelling', /Demo/i.test(html) && html.includes('demo-note'));
  t(p + ' has unique title', /<title>[^<]*\(Demo\)[^<]*<\/title>/.test(html));
  t(p + ' has meta description', /<meta name="description" content="[^"]{40,}"/.test(html));
  const m = html.matchAll(/(?:href|src)="([^"#]+)"/g);
  for (const x of m) {
    const u = x[1];
    if (/^(https?:|mailto:|tel:)/.test(u)) continue;
    refs++;
    const clean = u.split('?')[0];
    if (!fs.existsSync(path.join(__dirname, clean))) badRefs.push(p + ' -> ' + u);
  }
}
t('all ' + refs + ' internal refs resolve', badRefs.length === 0);
if (badRefs.length) console.log('  BAD REFS:', badRefs.join('; '));
t('sitemap.xml lists 6 pages', (fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8').match(/<url>/g) || []).length === 6);
t('robots.txt present with sitemap', fs.readFileSync(path.join(__dirname, 'robots.txt'), 'utf8').includes('Sitemap:'));
t('JSON-LD HealthAndBeautyBusiness on index', fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').includes('HealthAndBeautyBusiness'));

/* --- Weights --- */
function dirBytes(dir, exts) { let n = 0; for (const f of fs.readdirSync(dir, { recursive: true })) { const fp = path.join(dir, f); if (fs.statSync(fp).isFile() && exts.some(e => f.endsWith(e))) n += fs.statSync(fp).size; } return n; }
const codeKB = Math.round((dirBytes(__dirname, ['.html', '.css', '.js']) - fs.statSync(path.join(__dirname, 'tests.js')).size - (fs.existsSync(path.join(__dirname, 'shoot.js')) ? fs.statSync(path.join(__dirname, 'shoot.js')).size : 0)) / 1024);
const mediaKB = Math.round(dirBytes(path.join(__dirname, 'assets'), ['.jpg']) / 1024);
const maxImg = Math.max(...fs.readdirSync(path.join(__dirname, 'assets')).filter(f => f.endsWith('.jpg')).map(f => fs.statSync(path.join(__dirname, 'assets', f)).size));
t('code weight ' + codeKB + ' KB < 400 KB', codeKB < 400);
t('media total ' + mediaKB + ' KB <= 1600 KB', mediaKB <= 1600);
t('largest image ' + Math.round(maxImg / 1024) + ' KB <= 120 KB', maxImg <= 120 * 1024);

console.log('\nRESULT: ' + pass + ' PASS / ' + fail + ' FAIL');
process.exit(fail ? 1 : 0);
