# Keyboard Walk — Velvet & Stone Salon & Spa (Demo, Queue #4)
Date: 2026-11-21 · Engine: Playwright + Chrome headless shell, file:// preview, desktop 1280×900.
Method: sequential Tab presses from page top; the focused element and its computed focus indicator
(:focus-visible 3px blush outline in css/style.css; pick cards additionally outline via :focus-within) are recorded at each stop.
Captures: keyboard-focus-booking.png (stop 6 — a service pick card), keyboard-focus-home.png (stop 5).

## Booking (booking.html) — step 1 visible

| # | Focused element | Visible focus style |
|---|---|---|
| 1 | a.skip-link — "Skip to content" | YES — outline 3px |
| 2 | a.brand — "Velvet & Stone" | YES — outline 3px |
| 3 | a — "Home" | YES — outline 3px |
| 4 | a — "Services & Prices" | YES — outline 3px |
| 5 | a — "Stylists" | YES — outline 3px |
| 6 | a — "Book" | YES — outline 3px |
| 7 | a — "Gallery" | YES — outline 3px |
| 8 | a — "Visit Us" | YES — outline 3px |
| 9 | a.btn.small.head-cta — "Book now" | YES — outline 3px |
| 10 | input — "Signature Cut & Finish" | YES — outline 3px (pick card outline 3px) |
| 11 | input — "Balayage & Gloss" | YES — outline 3px (pick card outline 3px) |
| 12 | input — "Keratin Smooth Treatment" | YES — outline 3px (pick card outline 3px) |

## Home (index.html)

| # | Focused element | Visible focus style |
|---|---|---|
| 1 | a.skip-link — "Skip to content" | YES — outline 3px |
| 2 | a.brand — "Velvet & Stone" | YES — outline 3px |
| 3 | a — "Home" | YES — outline 3px |
| 4 | a — "Services & Prices" | YES — outline 3px |
| 5 | a — "Stylists" | YES — outline 3px |
| 6 | a — "Book" | YES — outline 3px |
| 7 | a — "Gallery" | YES — outline 3px |
| 8 | a — "Visit Us" | YES — outline 3px |
| 9 | a.btn.small.head-cta — "Book now" | YES — outline 3px |
| 10 | a.btn — "Book your visit" | YES — outline 3px |

Result: every interactive stop received keyboard focus in DOM order (skip link → header → page CTAs → booking picks in order). No focus traps found; the mobile menu toggle is a real button with aria-expanded, and the booking pick inputs show focus on their card via :focus-within.
