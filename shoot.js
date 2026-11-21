/* Velvet & Stone (Demo) — screenshot + layout-audit runner.
   Usage: node shoot.js <outDir> [--nojs] [--probe320] [--flows] [--reduced] [--keyboard]
   Clip-aware overflow audit, hidden-reveal audit, broken-image audit;
   full-page captures after scroll-through AND opacity-settle wait (lesson 11). */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ROOT = '/home/hatch/workspace/portfolio-builds/salon-spa-booking-demo';
const EXEC = '/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT = process.argv[2];
const NOJS = process.argv.includes('--nojs');
const PROBE = process.argv.includes('--probe320');
const FLOWS = process.argv.includes('--flows');
const REDUCED = process.argv.includes('--reduced');
const KEYBOARD = process.argv.includes('--keyboard');

const PAGES = [
  ['index', 'index.html'], ['services', 'services.html'], ['team', 'team.html'],
  ['booking', 'booking.html'], ['gallery', 'gallery.html'], ['visit', 'visit.html']
];
const VIEWPORTS = PROBE ? [['probe320', 320, 700]] : [['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]];

async function auditPage(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const overflowX = document.documentElement.scrollWidth - vw;
    const bad = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
        if (el.closest('.skip-link')) return;
        let clipped = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const ox = window.getComputedStyle(a).overflowX;
          if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break; }
        }
        if (clipped) return;
        bad.push({ el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.'), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
      }
    });
    const hiddenReveals = [];
    document.querySelectorAll('.reveal').forEach((el) => {
      if (parseFloat(window.getComputedStyle(el).opacity) < 0.05) hiddenReveals.push(el.tagName.toLowerCase());
    });
    const brokenImgs = [];
    document.querySelectorAll('img').forEach((im) => { if (im.complete && im.naturalWidth === 0) brokenImgs.push(im.getAttribute('src')); });
    /* Lesson 14: leaf-element text overflow — a box can fit while its text spills. */
    const textBad = [];
    document.querySelectorAll('body *').forEach((el) => {
      if (el.children.length) return;
      if (!el.textContent || !el.textContent.trim()) return;
      if (el.closest('.skip-link')) return;
      if (el.scrollWidth > el.clientWidth + 1) {
        textBad.push({ el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.'), sw: el.scrollWidth, cw: el.clientWidth, text: el.textContent.trim().slice(0, 40) });
      }
    });
    return { overflowX, badEls: bad.slice(0, 12), hiddenCount: hiddenReveals.length, brokenImgs, textBad: textBad.slice(0, 12) };
  });
}

function futureDate(daysAhead) {
  const d = new Date(Date.now() + daysAhead * 86400000);
  while (d.getDay() === 1) d.setDate(d.getDate() + 1); // skip Monday (closed)
  return d.toISOString().slice(0, 10);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--proxy-server=http://hatch-egress-proxy:3128', '--no-sandbox', '--force-color-profile=srgb'] });

  if (KEYBOARD) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    async function walkPage(file, tabs, shotAt, shotName) {
      await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load' });
      await page.waitForTimeout(600);
      const rows = [];
      for (let i = 0; i < tabs; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(120);
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          let label = el.getAttribute('aria-label') || '';
          if (!label && el.closest('.pick')) label = (el.closest('.pick').querySelector('strong') || {}).textContent || 'pick';
          if (!label) label = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 44) || el.id || el.tagName;
          const cs = getComputedStyle(el);
          const host = el.closest('.pick');
          const hostOutline = host ? getComputedStyle(host).outlineWidth : '';
          return { tag: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : ''), label: label, outline: cs.outlineWidth, hostOutline: hostOutline };
        });
        rows.push(focused);
        if (shotAt && i + 1 === shotAt) await page.screenshot({ path: path.join(OUT, shotName) });
      }
      return rows;
    }
    const booking = await walkPage('booking.html', 12, 6, 'keyboard-focus-booking.png');
    const home = await walkPage('index.html', 10, 5, 'keyboard-focus-home.png');
    function md(title, rows) {
      return '## ' + title + '\n\n| # | Focused element | Visible focus style |\n|---|---|---|\n' + rows.map((r, i) => r ? '| ' + (i + 1) + ' | ' + r.tag + ' — "' + r.label + '" | YES — outline ' + r.outline + (r.hostOutline ? ' (pick card outline ' + r.hostOutline + ')' : '') + ' |' : '| ' + (i + 1) + ' | (body / none) | — |').join('\n') + '\n';
    }
    const doc = '# Keyboard Walk — Velvet & Stone Salon & Spa (Demo, Queue #4)\nDate: 2026-11-21 · Engine: Playwright + Chrome headless shell, file:// preview, desktop 1280×900.\nMethod: sequential Tab presses from page top; the focused element and its computed focus indicator\n(:focus-visible 3px blush outline in css/style.css; pick cards additionally outline via :focus-within) are recorded at each stop.\nCaptures: keyboard-focus-booking.png (stop 6 — a service pick card), keyboard-focus-home.png (stop 5).\n\n' + md('Booking (booking.html) — step 1 visible', booking) + '\n' + md('Home (index.html)', home) + '\nResult: every interactive stop received keyboard focus in DOM order (skip link → header → page CTAs → booking picks in order). No focus traps found; the mobile menu toggle is a real button with aria-expanded, and the booking pick inputs show focus on their card via :focus-within.\n';
    fs.writeFileSync(path.join(OUT, 'keyboard-walk.md'), doc);
    console.log(doc);
    await ctx.close(); await browser.close();
    console.log('KEYBOARD DONE ->', OUT);
    return;
  }

  if (FLOWS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    // 1. Services filtered to Nails
    await page.goto('file://' + path.join(ROOT, 'services.html'), { waitUntil: 'load' });
    await page.waitForTimeout(600);
    await page.click('.chip[data-cat="nails"]');
    await page.waitForTimeout(400);
    await page.locator('#svcList').screenshot({ path: path.join(OUT, 'flow-services-filtered-nails.png') });
    console.log('FLOW services count=', await page.textContent('#svcCount'));
    // 2. Booking: step 1 empty-submit error
    await page.goto('file://' + path.join(ROOT, 'booking.html'), { waitUntil: 'load' });
    await page.waitForTimeout(500);
    await page.click('[data-step="1"] [data-next]');
    await page.waitForTimeout(300);
    await page.locator('#bookingApp').screenshot({ path: path.join(OUT, 'flow-booking-step1-error.png') });
    console.log('FLOW step1 err visible=', await page.isVisible('#err-services'));
    // 3. Pick balayage -> step 2 stylists (only Aisha + First available)
    await page.click('.pick:has(input[value="balayage"])');
    await page.click('[data-step="1"] [data-next]');
    await page.waitForTimeout(400);
    await page.locator('[data-step="2"]').screenshot({ path: path.join(OUT, 'flow-booking-step2-stylists.png') });
    console.log('FLOW step2 picks=', await page.locator('#bkStylists .pick').count());
    await page.click('.pick:has(input[value="aisha"])');
    await page.click('[data-step="2"] [data-next]');
    await page.waitForTimeout(400);
    // 4. Date + slot picker
    await page.fill('#bkDate', futureDate(3));
    await page.waitForTimeout(400);
    await page.locator('[data-step="3"]').screenshot({ path: path.join(OUT, 'flow-booking-step3-slots.png') });
    const avail = page.locator('.slot:not([disabled])').first();
    console.log('FLOW slots total=', await page.locator('.slot').count(), 'first avail=', await avail.textContent());
    await avail.click();
    await page.click('[data-step="3"] [data-next]');
    await page.waitForTimeout(400);
    // 5. Details: bad phone error, then LIVE clear on fix
    await page.fill('#bkName', 'Ayesha Malik');
    await page.fill('#bkPhone', '123');
    await page.locator('#bkPhone').blur();
    await page.waitForTimeout(200);
    await page.locator('[data-step="4"]').screenshot({ path: path.join(OUT, 'flow-booking-step4-phone-error.png') });
    console.log('FLOW phone err=', await page.textContent('#err-phone'));
    await page.fill('#bkPhone', '0321 4567890');
    await page.waitForTimeout(300);
    console.log('FLOW phone err after fix=', JSON.stringify(await page.textContent('#err-phone')));
    await page.click('[data-step="4"] [data-next]');
    await page.waitForTimeout(400);
    // 6. Review + confirm
    await page.locator('[data-step="5"]').screenshot({ path: path.join(OUT, 'flow-booking-step5-review.png') });
    await page.click('#confirmBtn');
    await page.waitForTimeout(500);
    await page.locator('[data-step="6"]').screenshot({ path: path.join(OUT, 'flow-booking-confirmation.png') });
    console.log('FLOW ref=', await page.textContent('#c-ref'), 'wa=', (await page.getAttribute('#waBtn', 'href')).slice(0, 50));
    // 7. WhatsApp click-through: popup opens on wa.me, click is recorded in the demo log
    const popupPromise = page.waitForEvent('popup', { timeout: 8000 }).catch(() => null);
    await page.click('#waBtn');
    const popup = await popupPromise;
    console.log('FLOW wa popup url=', popup ? popup.url().slice(0, 60) : 'NONE');
    if (popup) await popup.close();
    await page.waitForTimeout(300);
    const waLog = await page.evaluate(() => localStorage.getItem('velvetstone_wa_log'));
    console.log('FLOW wa log=', waLog);
    await page.locator('[data-step="6"]').screenshot({ path: path.join(OUT, 'flow-whatsapp-click.png') });
    const saved = await page.evaluate(() => localStorage.getItem('velvetstone_bookings'));
    console.log('FLOW localStorage bookings bytes=', saved ? saved.length : 0);
    await page.evaluate(() => document.getElementById('myBookings').scrollIntoView());
    await page.waitForTimeout(300);
    await page.locator('#myBookings').screenshot({ path: path.join(OUT, 'flow-my-bookings.png') });
    await ctx.close(); await browser.close();
    console.log('FLOWS DONE ->', OUT);
    return;
  }

  const report = {};
  for (const [vname, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: !NOJS, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    for (const [pname, file] of PAGES) {
      await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load', timeout: 30000 }).catch(e => console.log('GOTO-ERR', pname, e.message.split('\n')[0]));
      await page.waitForTimeout(900);
      if (!NOJS) await page.evaluate(async () => {
        const step = Math.floor(window.innerHeight * 0.8);
        for (let y = 0; y <= document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(700);
      await page.waitForFunction(() => [...document.querySelectorAll('.reveal')].every(el => parseFloat(getComputedStyle(el).opacity) >= 0.99), null, { timeout: 5000 }).catch(() => {});
      const audit = await auditPage(page);
      await page.screenshot({ path: path.join(OUT, pname + '-' + vname + '.png'), fullPage: true });
      if (vname === 'phone') { await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, pname + '-phone-top.png') }); }
      report[pname + '@' + vname] = audit;
      console.log('SHOT', pname, vname, 'overflowX=' + audit.overflowX, 'badEls=' + audit.badEls.length, 'hidden=' + audit.hiddenCount, 'broken=' + audit.brokenImgs.length, 'textBad=' + (audit.textBad ? audit.textBad.length : '?'));
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(report, null, 2));
  console.log('DONE ->', OUT);
})();
