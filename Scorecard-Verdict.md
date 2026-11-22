VISUAL QUALITY SCORECARD — VERDICT
Build: Velvet & Stone Salon & Spa (Demo) — Salon & Spa Website + Booking, Portfolio Queue #4  (client-facing owner: BalanceBit Solutions · production: MTS)
Build type / builder (AICOS-105–111): AICOS-107 (Booking Website Builds) — executed by builder worker
Preview URL: none (not deployed — local file:// preview only)   Date of pass: 2026-11-21
Scored by: AICOS-115   Pass #: 1

 1. Visual identity & originality   13 / 15   Evidence: BUILD-NOTES.md design record (own porcelain/stone/blush/bronze system, Cormorant Garamond + Jost; references Salon SCK + Grand Noir opened fresh 2026-11-21, plus library B1 IGK); screenshots/index-desktop.png + index-phone.png match the record — a printed-menu editorial salon system that could not belong to another industry, and visually unrelated to Gift Basket (cream/emerald/terracotta), Restaurant (Fraunces ink/parchment) and MTS Core (black/lime Archivo). Missing: AICOS-112 formal §0 sign-off.
 2. UI/UX & usability               14 / 15   Evidence: flow captures — flow-services-filtered-nails.png (filter → "4 services"), flow-booking-step1-error.png (error state), flow-booking-step2-stylists.png (coverage-filtered stylists), flow-booking-step3-slots.png (slot picker, taken slots struck), flow-booking-step4-phone-error.png (error shown; flow log proves it cleared LIVE on fix), flow-booking-step5-review.png, flow-booking-confirmation.png; ONE conversion goal (a completed booking) completed end-to-end without assistance, ref VS-DEMO-8330.
 3. Typography & composition        10 / 10   Evidence: screenshots/services-phone.png (serif service names, PKR prices, durations), index-desktop.png + index-phone-top.png hierarchy at desktop and phone; pairing exactly as specified in BUILD-NOTES.md.
 4. Animation & interactions        9 / 10   Evidence: reveal-on-scroll with rootMargin pre-reveal + opacity-settle wait — 0 hidden in every audit; Ken Burns hero observed in captures; REDUCED-MOTION RUN FILED (screenshots/reduced/ — 6 pages × 3 viewports, 0 overflow / 0 text-overflow / 0 hidden, motion disabled, content instant-visible). Remaining: no CLS measurement exists without a served preview.
 5. Responsive design               10 / 10   Evidence: screenshots/audit.json — 18 page×viewport combos (390×844 / 768×1024 / 1440×900): 0 overflow, 0 leaf text-overflow, 0 hidden, 0 broken images; screenshots/probe320/audit.json — 6 pages at 320px: 0 findings; screenshots/nojs/ run (6 pages × 3 viewports): content fully visible with JS disabled. Three real defects (invisible pick focus, header CTA wrap, portrait crop) were found by this evidence and fixed — see BUILD-NOTES.md.
 6. Functionality                   15 / 15   Evidence: tests.js + tests-output.log — 84/84 PASS (data integrity, filter, stylist coverage, slot generation incl. Monday closure + past-date rejection, validation, WhatsApp construction, all internal refs across 6 pages); flow run: full booking completed (Balayage & Gloss, Aisha Khan, PKR 14,500 / 2 hr 30 min exact), booking persisted to localStorage and listed under My Bookings (flow-my-bookings.png); INTEGRATION FIRING RECORDED — the WhatsApp button was clicked in the flow run: popup fired on the wa.me URL and the click was written to the localStorage demo log ({ref VS-DEMO-8330, channel: whatsapp}); the external wa.me page itself cannot load inside the sandboxed headless browser (chrome-error page), which is a sandbox limit, not a site defect — the link href is test-verified.
 7. Performance                     5 / 10   Evidence: weights measured — code 68 KB (< 400 KB), media 836 KB total, max image 107 KB (tests-output.log). Missing: served-preview Lighthouse / field Core Web Vitals (LCP/INP/CLS) — the build is not deployed, so no CWV numbers exist; not estimated.
 8. Accessibility                   5 / 5   Evidence: KEYBOARD-WALK RECORD FILED (screenshots/keyboard-walk.md — 22 Tab stops across Booking + Home, visible 3px focus at every stop incl. pick cards via :focus-within, DOM order, no traps; keyboard-focus-booking.png + keyboard-focus-home.png); semantic HTML, skip link, aria-current/pressed/live regions, ≥44px touch targets (chips 46px, slots 48px, buttons 52px), 16px form fonts, alt text on all images.
 9. SEO                             5 / 5   Evidence: unique title + meta description per page (test-verified), HealthAndBeautyBusiness JSON-LD on index, sitemap.xml (6 pages) + robots.txt present, internal linking across all 6 pages (all refs resolve, tests-output.log).
10. Security                        4 / 5   Evidence: zero third-party packages/CDN libraries (Google Fonts only), no secrets or credentials in source, no backend — the booking engine is a client-side demo writing only to the visitor's own localStorage; no data leaves the browser. HTTPS enforcement is a hosting property and the build is not deployed.

TOTAL: 90 / 100   (target ≥ 90)

BLOCKING FAILURES (security / data integrity / functionality):
- None. The ONE conversion goal (booking → demo confirmation + localStorage record) completes; the WhatsApp confirmation path fires and logs; no security or data-integrity findings.

UNTESTED AREAS (score invalid without evidence):
- None scored as untested. Areas 1 and 7 carry named partial evidence (see above) and were scored down for it rather than marked untested — the same convention as Queue #2 (81), #3 (84) and #1 (89).

VERDICT:  [ ] APPROVE   [X] REJECT   [ ] REJECT — BLOCKED   [ ] REJECT — INCOMPLETE
Reasons (defects as: what is wrong · where · what fixed looks like):
- The ladder's evidence bar, not the §4 table alone, governs this queue's verdicts: every predecessor (81 / 84 / 89) was REJECTED with the same two evidence items outstanding, and both are still outstanding here, so an APPROVE at exactly 90 would claim a standard the evidence does not yet carry. The build itself has no outstanding code defects — all three defects found in this pass were fixed and re-evidenced.
- Missing evidence 1: served-preview Lighthouse/CWV · Area 7 (5 points held) · fixed by deploying a preview (Gate 7, Asad's decision) and filing a measured Lighthouse report.
- Missing evidence 2: AICOS-112 formal §0 sign-off · Area 1 (2 points held) · fixed by the design owner's recorded sign-off against BUILD-NOTES.md.
- Ladder note: this pass closes the last locally-producible evidence gaps the flagship left priced in — the WhatsApp integration firing is now recorded (click + demo log), and the reduced-motion run covers all three viewports. From Queue #5 on, 90 is the floor a local build can reach; the remaining points live at Gate 7.

Next step: [ ] To AICOS-025 release gate   [X] Back to Gate 5 (evidence completions only — both are external to the build)   [ ] Back to Gate 2

Test-battery disclosure: one inherited assertion carries an inline correction note in its source (Monday-rejection test uses future Monday 2026-11-30 because 2026-11-23 is also in the past relative to the test clock; the closed-day message is what the assertion checks) — repeated in BUILD-NOTES.md, not hidden. No assertion was silently amended. The screenshot audit was made STRICTER mid-pass (leaf text-overflow check, lesson 14).

---

## Addendum — Re-verification FIX RUN (2026-11-21, later the same day)

Independent re-verification (`Reverification-2026-11-21/REPORT.md`) found 2 visible defects.
Both FIXED, re-shot and read; battery **84 PASS / 0 FAIL** unamended after fixes:

- **S-1 (visible) — Zara Fatima's desktop portrait cropped through her face.** Her source
  photo's face sits lower in the frame than the other stylists', so the shared
  `object-position:top` on the wide desktop card window showed forehead-to-nose only (the
  narrow phone window happened to fit). Fix: a per-stylist crop anchor — `crop:'crop-face'`
  in `js/data.js`, emitted by `js/render.js`, with `.card-img.tall.crop-face{object-position:
  50% 25%}`. Proof: `fix-salon-spa/team-desktop.png` — all four portraits now show full faces.
- **S-2 (visible) — at 320px the hamburger overlapped the logo.** Root cause was NOT the
  toggle: the ≤860px `.head-cta{display:none}` rule lost the cascade to the LATER
  `.btn{display:inline-flex}` rule (equal specificity), so "Book now" stayed in the header
  row, squeezing the brand box to 90px (its nowrap text overflowed to ~172px) and the toggle
  to 34px, landing it on top of "Stone". Fix: the hide rule is now scoped
  `.site-head .head-cta{display:none}` (out-specifies `.btn`), and `.brand{flex:none}` guards
  the shrink. Proof (DOM geometry at 320): brand box 20→172px (full text), toggle 252→300px
  (full 48px), 80px clear between them; `fix-salon-spa/index-probe320.png` read by eye.
- **Same-family audit fixes (no defect was filed against this site):** reveal opacity-gating
  removed (v3 pattern — position-only rise) and all 10 lazy content images made eager
  (team/service card templates, gallery, lounge/spa photos). Re-shoot: 18 page×viewport
  combos, 0 blank / 0 overflow.

**Score: unchanged at 90/100 — REJECT (evidence bar only).** Held points remain the
served-preview CWV (Area 7) and the AICOS-112 §0 sign-off (Area 1).

---

## Addendum — PREMIUM UPGRADE (2026-11-22, Ladder step 4)

Premium layer added per Premium-Standard-and-Library-Plan §5 (#4). No existing demo
content, prices or listings changed; tests.js UNAMENDED. New content is additive
only: the ritual chapter and the demo product shelf (demo-labelled).

- **Techniques:** FIRST Swiper site — stylist rail on team.html (4 slides) and
  gallery rail on gallery.html (6 slides), transformed from the static grids by
  js/swiper-init.js (grids remain the no-JS / reduced-motion state); swipe proven
  (active index 0→1), keyboard + clickable bronze pagination, pagination moved
  below the slides after the first capture showed it overlapping a caption.
  GSAP pinned "ritual" chapter on index.html (AIRE pattern — atmosphere before
  price): pinned, scrubbed crossfade across three chapters, pin-spacer verified,
  mid-scrub opacities measured (img 0.44/0.56 crossfade) and screenshot-read in
  screenshots/signature-moment.png. Booking-flow micro-interactions: step panels
  animate in at exactly 420ms (step-in, cubic-bezier(.22,1,.36,1) — verified
  computed animation-duration 0.42s), pick/slot/step states transitioned.
  Product-shelf strip in the salon's own pattern: four own-label demo products
  with demo prices + a demo loyalty line (Gielly Green pattern). CSS View
  Transitions site-wide (~400ms).
- **Deviation (recorded): NO Lenis on this site.** Swiper (44,390) + GSAP (28,435)
  + ScrollTrigger (18,039) + Lenis (5,439) = 96,303 B gzip of vendor alone —
  over the P8 hero budget before the site's own JS. Per the ladder instruction,
  Swiper + restrained GSAP were prioritised; ScrollTrigger runs on native scroll,
  so there is no scroll-sync conflict to test — Swiper captures horizontal touch
  inside the rail, the page keeps native vertical scroll (verified in the swipe
  run). P2 is therefore NOT claimed for this site.
- **JS weights (gzip, measured):** home = 53,995 B ≈ 52.7 KB (existing 6,698 +
  GSAP + ScrollTrigger + premium.js 823) · team/gallery = 51,991 B ≈ 50.8 KB
  (existing + Swiper 44,390 + swiper-init 903) · booking = 10,239 B plain ·
  services/visit = 6,698 B plain — all inside P8 (hero ≤90 KB, plain ≤20 KB).
- **Battery:** before 84 PASS / 0 FAIL → after 84 PASS / 0 FAIL, unamended.
  New separate premium-checks.js: 22 PASS / 0 FAIL.
- **Screenshots:** full set re-shot — 18 page×viewport combos 0 overflow / 0 hidden /
  0 broken / 0 text-overflow; no-JS set 18/18 clean (ritual stacked, grids intact);
  reduced-motion set 18/18 clean (premium layer fully inert — no pin, no rails).
  Personally read: index desktop full page (shelf + ritual initial pin state; the
  full-page stitch shows the pin length as blank spacer — the viewport capture
  signature-moment.png shows the real pinned experience), gallery rail desktop,
  signature-moment.png (mid-crossfade).
- **Premium Gate:** P1 PASS · P2 DEVIATION (no Lenis — see above; not claimed) ·
  P3 PASS (pinned ritual, the home page's one signature moment) · P4 PASS under
  the gate's luxury carve-out (restrained large Cormorant serif) · P5 PASS
  (photographic hero; Swiper used for rails, never a generic hero slider) ·
  P6 PASS (booking engine depth + shelf) · P7 PASS · P8 PASS on measured JS
  budgets (CWV still unmeasured — no served preview; not claimed) · P9 PASS ·
  P10 PASS (all new content demo-labelled).
- **Console:** zero local errors; only failure is the pre-existing Google Fonts
  stylesheet via the sandbox egress proxy (environmental).

**Re-score: 90 → 92 / 100** (Area 4 Animation & interactions 9→10 — pinned ritual,
Swiper rails, 420ms booking steps; Area 2 UI/UX 14→15 — rail browsing + shelf
depth). **Verdict unchanged: REJECT — evidence bar only** (served-preview CWV,
Area 7; AICOS-112 §0 sign-off, Area 1 — both external). No build defects
outstanding.
