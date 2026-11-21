# Build Notes — Velvet & Stone Salon & Spa (Demo) — Portfolio Queue #4

**Built:** 2026-11-21 · **Builders:** AICOS-107 (Booking Website Builds) · AICOS-112 (design system) · AICOS-115 (QA)
**Queue position:** #4, after Gift Basket #2 (81), Restaurant #3 (84) and the MTS flagship #1 rebuild (89) — this build had to beat 89 and close every locally-producible evidence item.
**Stack:** hand-coded HTML/CSS/vanilla JS, zero third-party packages/CDN libraries except Google Fonts. No build step.
**Provenance note:** an earlier dispatch of this same project (cancelled before completion, per Portfolio-Queue-Progress.md) had left a partial build inside this project's own folder — code, data, tests and the photo set. This pass audited that work line by line against the brief and the 16 ladder lessons, kept what passed, and completed everything missing: flow/state evidence, reduced-motion + no-JS runs for all pages, the keyboard-walk record, the lesson-14 text-overflow audit, a favicon, and three defect fixes (below). Nothing was copied from or into any other project's folder — all files live strictly inside this project and its repository.

## Design record (Gate 2)

**Identity — "Velvet & Stone": Editorial Luxury for beauty.** A calm porcelain studio with stone neutrals, a blush tint and one bronze accent; a high-contrast editorial serif for display type against a quiet grotesque for UI. The layout could not belong to another industry: a printed service menu with honest prices and durations, named stylists with portraits doing the trust work, and a five-step booking ritual as the centrepiece — proof first, booking second, price framed as craft.

**References researched (opened 2026-11-21):**
1. **Salon SCK** (salonsck.com, Fifth Avenue NYC — also Design Inspiration Library entry B2, opened fresh this pass) — luxury positioning statement, named stylists, 5-star reviews high on the page, polished service menu. Taken: proof-before-booking ordering, stylist-led trust. Not copied: their palette, layout or Squarespace structure.
2. **Grand Noir Salon** (grandnoirsalon.com, Verona WI — library entry B3, opened fresh this pass) — statement headline + immediate "Book Here" CTA, transparency as design (clear pricing, text-based booking removing friction). Taken: booking CTA visible without scrolling, friction-removal as the design idea (here: a real multi-step engine + WhatsApp confirmation instead of a phone queue). Not copied: their dark minimal palette.
Plus library entry B1 (IGK — palette discipline as a brand asset in beauty).

**Tokens:**
- `--porcelain #F7F2EC` (ground) · `--porcelain-2 #EFE7DC` (tint band) · `--card #FFFDF9`
- `--stone #D8CBBD` (borders/quiet) · `--blush #B97F63` (accent) · `--blush-tint #F0DED2` (badges, selected states)
- `--bronze #8F6242` (primary action) · `--bronze-dark #744E33` (hover/prices)
- `--ink #2B2220` (warm espresso text/dark bands) · `--ink-2 #3A2E2A` · `--muted #6E5F56` · `--line #E2D5C5`
- `--error #B3261E` — semantic error red, the ONLY extra hue (ladder rule 4)
- Radius 14px cards, pill buttons. Buttons 52px min-height (46px small variant); fields 52px / 16px font.

**Type pairing:** Cormorant Garamond (500/600/700) for display; Jost (400/500/600) for body and UI. Two families, both via Google Fonts. Deliberately distinct from Gift Basket (cream/emerald/terracotta), Restaurant (Fraunces + Public Sans, ink/parchment/brick-clay) and MTS Core (Archivo, black/lime).

**The salon (fictional):** Velvet & Stone Salon & Spa, 12-C Khayaban-e-Ittehad, DHA Phase 6, Lahore. Open Tue–Sun 10:00–20:00, closed Mondays (the closed day is modelled in the booking logic, not just printed). Demo phone/WhatsApp 0321 456 7890.

**ONE conversion goal:** a completed booking (multi-step engine → demo confirmation with reference). Secondary: the WhatsApp confirmation tap on the confirmation state.

**Pages (6):** `index.html` (hero, signature services, studio story, reviews, visit panel) · `services.html` (16 services from data, category filter) · `team.html` (4 stylists from data + reviews) · `booking.html` (the engine + My Bookings) · `gallery.html` (6 captioned photos) · `visit.html` (styled map panel + Google Maps link, hours, first-visit notes). Stylists live on `team.html` — the seeded brief's "Stylists" page under a team name, justified: the page is the salon's team (stylists + spa lead + nail artist), and every nav label, title and link says exactly what it holds.

**Video position (plain, per owner rule): video: none — photo + CSS motion.** Video generation is region-blocked (403) on this account — not attempted. The hero uses a real photograph with a subtle Ken Burns CSS motion, disabled under `prefers-reduced-motion`. No video file exists in this project and none is claimed anywhere.

## Features — all working client-side, demo data only
All pure logic lives in `js/logic.js`, shared by the site and the Node test battery (lesson 13); data in `js/data.js`; DOM in `js/render.js`, `js/main.js`, `js/booking.js`.
- **Services:** 16 services rendered from data (hair ×4, skin ×4, nails ×4, spa ×4), each with duration + PKR price; category chips actually filter (flow-proven: Nails → "4 services").
- **Stylists:** 4 rendered from data (name, role, speciality, services offered); "Book with X" deep-links into booking with the stylist preselected; service cards deep-link with the service preselected.
- **Booking engine (the core):** 5 steps — services (multi-select with live totals) → stylist (only stylists who cover EVERY chosen service are offered, plus "First available" — flow-proven: Balayage leaves exactly Aisha + First available) → date (past dates and closed Mondays rejected) + time slot (10 slots generated from 10:00–19:00 opening hours; deterministic demo "taken" slots struck through and disabled; today's elapsed slots marked past) → name + phone (Pakistani mobile validation) → review → confirmation. Per-step validation; errors clear LIVE the moment a field becomes valid (flow-proven: bad phone error → corrected → error text empty). Confirmation shows the full summary + reference `VS-DEMO-8330` (deterministic from booking contents) and the booking is saved to localStorage (`velvetstone_bookings`); a "My bookings" list on the same page reads them back.
- **WhatsApp confirmation path:** the confirmation state's "Confirm on WhatsApp" button builds a real `wa.me/923214567890` link with the full booking (ref, services, stylist, date/time, total) prefilled; the click is recorded in a localStorage demo log (`velvetstone_wa_log`) — flow-verified: popup fired on the wa.me URL and the log entry `{ref: VS-DEMO-8330, channel: whatsapp}` was written.
- **Google Maps:** styled visit panel + "Open in Google Maps" link (settled pattern — NO live iframe, so it can never render broken).
- **Reviews:** 4 demo-labelled review cards ("demo review" on every card), rendered from data on Home and Team.

## Ladder mechanics (lessons 1–16, all applied)
Reveal-by-default (hidden state applied by the `.js` class only) + IntersectionObserver with 45% rootMargin pre-reveal + unconditional 2s fallback + reduced-motion instant-visible (lessons 2+11). Pure logic split (13). One component system — one button, one field (≥16px), one card, one price treatment (5). Palette discipline — own tokens + tints only; semantic error red the only extra (4). `min-width:0` on grid children (6). No inline-style grid rows anywhere (6). Explicitly placed grid children: none rely on lone-axis pins (15). Leaf-text overflow audit added to the harness this pass (14). Specificity checked against component classes with state evidence (16) — see defect 1. Weights: code 68 KB < 400 KB; media 836 KB ≤ 1.6 MB, largest image 107 KB ≤ 120 KB (10).

## Defects found by QA in this pass and fixed
1. **Keyboard focus invisible on booking picks (accessibility, lesson 16 class):** the pick radio/checkbox inputs are 1px/opacity-0, so the :focus-visible outline sat on an invisible box. Fixed with `.pick:focus-within` card outline; verified in the keyboard walk (pick-card outline 3px recorded at every pick stop).
2. **Header CTA wrapped to two lines at 390px** ("Book / now"). Fixed with `white-space:nowrap` on `.btn`; re-audited at 390 and 320 — 0 overflow.
3. **Stylist portraits cropped at the forehead** by the shared 210px card-image height. Fixed with a `.card-img.tall` variant (320px, top-anchored) used only by team cards; verified by eye in team-phone-top.png.
Also added this pass: `assets/favicon.svg` (on-palette V monogram) linked on all pages, and the head-level `js` class script so reveal state is set before first paint.

## Media
10 generated photographs in ONE consistent style (warm porcelain/stone/blush/bronze editorial beauty photography, no text in any image), 836 KB total, largest 107 KB:
`assets/hero.jpg` · `assets/lounge.jpg` · `assets/hair.jpg` · `assets/facial.jpg` · `assets/nails.jpg` · `assets/spa.jpg` · `assets/stylist-aisha.jpg` · `assets/stylist-bilal.jpg` · `assets/stylist-mehwish.jpg` · `assets/stylist-zara.jpg` (+ `assets/favicon.svg`, vector).
Two further generations attempted this pass (a facial-treatment variant and a bridal gallery shot) failed in the media pipeline with 500 errors and were not retried; the existing set already covers every category, so there is no gap in the design.
**Repo note (owner rule, 2026-11-21):** the connector push carries text files only, so the 10 photographs are PENDING WEB-UPLOAD to the repo (listed exactly in the delivery report as ASSETS PENDING WEB-UPLOAD); the repo is "code pushed — images pending web-upload", not complete, until that step runs. Video: none — photo + CSS motion (see Design record).

## QA summary
- Tests: `tests.js` → **84 PASS / 0 FAIL** (`tests-output.log`): data integrity, filter logic, stylist coverage, totals/format, slot generation (opening hours, taken mix, past-date rejection, Monday closure, today's elapsed slots), booking validation, WhatsApp construction, link integrity across all 6 pages, SEO artefacts, weights.
- Screenshots (`screenshots/`): 6 pages × 390×844 / 768×1024 / 1440×900 + 320px probe (6) + JS-disabled run (6 pages × 3 viewports) + reduced-motion run (6 pages × 3 viewports) — final audits: **0 overflow, 0 bad elements, 0 leaf text-overflow, 0 hidden reveals, 0 broken images** in every run (`audit.json` per folder). All phone-width full pages read by eye, plus desktop home.
- Flow captures (`screenshots/flow-*.png`): services filtered to Nails, booking step-1 error, step-2 coverage-filtered stylists, step-3 slot picker with taken slots, step-4 phone error, step-5 review, confirmation (ref VS-DEMO-8330), WhatsApp click + log, My Bookings list.
- Keyboard walk: `screenshots/keyboard-walk.md` — 22 Tab stops across Booking + Home, visible 3px focus at every stop, DOM order, no traps; `keyboard-focus-booking.png` / `keyboard-focus-home.png` captures.

**Test-battery disclosure:** one assertion in the inherited battery carries its own inline correction note (the Monday-rejection test uses a future Monday, 2026-11-30, because 2026-11-23 is both a Monday and in the past relative to the test's fixed "now" — the past-date check correctly fires first). The assertion as run passes and tests the closed-day message; the note was already in the test source and is repeated here, not hidden. No other assertion was amended. The screenshot audit was made STRICTER in this pass (leaf text-overflow check added, lesson 14) — disclosed here.
