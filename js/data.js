/* Velvet & Stone (Demo) — demo data: services, stylists, reviews. Fictional. */
(function (global) {
  'use strict';

  var CATEGORIES = [
    { id: 'all', label: 'All services' },
    { id: 'hair', label: 'Hair' },
    { id: 'skin', label: 'Skin' },
    { id: 'nails', label: 'Nails' },
    { id: 'spa', label: 'Spa & Massage' }
  ];

  var SERVICES = [
    { id: 'signature-cut', category: 'hair', name: 'Signature Cut & Finish', duration: 60, price: 3500, blurb: 'Consultation, precision cut, wash and a glossy blow-dry finish.' },
    { id: 'balayage', category: 'hair', name: 'Balayage & Gloss', duration: 150, price: 14500, blurb: 'Hand-painted colour, toner and gloss for a soft, grown-out glow.' },
    { id: 'keratin', category: 'hair', name: 'Keratin Smooth Treatment', duration: 120, price: 12000, blurb: 'Frizz-smoothing keratin ritual with a take-home care guide.' },
    { id: 'blowout', category: 'hair', name: 'Velvet Blowout', duration: 45, price: 2500, blurb: 'Wash, scalp massage and a bouncy, long-lasting blowout.' },
    { id: 'signature-facial', category: 'skin', name: 'Signature Stone Facial', duration: 75, price: 6500, blurb: 'Deep cleanse, gentle exfoliation, warm-stone massage and mask.' },
    { id: 'hydra-glow', category: 'skin', name: 'Hydra-Glow Facial', duration: 60, price: 8000, blurb: 'Hydra-dermabrasion and serum infusion for an instant glow.' },
    { id: 'express-polish', category: 'skin', name: 'Express Polish & Glow', duration: 30, price: 2200, blurb: 'A lunchtime refresh — cleanse, polish and SPF finish.' },
    { id: 'brow-shape', category: 'skin', name: 'Brow Shape & Tint', duration: 20, price: 800, blurb: 'Shaping, tint and a soothing aloe finish.' },
    { id: 'classic-manicure', category: 'nails', name: 'Classic Manicure', duration: 45, price: 2800, blurb: 'Soak, cuticle care, shaping, massage and your choice of polish.' },
    { id: 'gel-extensions', category: 'nails', name: 'Gel Extensions', duration: 90, price: 6500, blurb: 'Sculpted gel extensions with a flawless, natural finish.' },
    { id: 'spa-pedicure', category: 'nails', name: 'Spa Pedicure', duration: 60, price: 3800, blurb: 'Warm soak, scrub, callus care, massage and polish.' },
    { id: 'nail-art', category: 'nails', name: 'Hand-Painted Nail Art', duration: 30, price: 1500, blurb: 'Delicate hand-painted designs, priced per set of ten.' },
    { id: 'aroma-massage', category: 'spa', name: 'Aromatherapy Massage', duration: 60, price: 7000, blurb: 'Full-body massage with warm blended oils, tailored pressure.' },
    { id: 'hot-stone', category: 'spa', name: 'Hot Stone Ritual', duration: 75, price: 8500, blurb: 'Heated basalt stones and slow strokes to melt deep tension.' },
    { id: 'body-scrub', category: 'spa', name: 'Bronze Sugar Body Scrub', duration: 45, price: 5500, blurb: 'Full-body polish followed by a rich shea-butter wrap.' },
    { id: 'head-spa', category: 'spa', name: 'Velvet Head Spa Ritual', duration: 50, price: 4800, blurb: 'Our signature — scalp cleanse, steam, massage and hair mask.' }
  ];

  var STYLISTS = [
    { id: 'aisha', name: 'Aisha Khan', role: 'Hair Director', photo: 'assets/stylist-aisha.jpg', speciality: 'Colour, balayage & precision cuts', bio: 'Twelve years behind the chair, trained in Dubai and Karachi. Aisha leads the colour studio and every consultation starts with listening.', services: ['signature-cut', 'balayage', 'keratin', 'blowout'] },
    { id: 'bilal', name: 'Bilal Ahmed', role: 'Senior Stylist', photo: 'assets/stylist-bilal.jpg', speciality: 'Cuts, styling & keratin', bio: 'Known for sharp, wearable cuts and honest advice. Bilal keeps a loyal book of regulars who trust his chair-side calm.', services: ['signature-cut', 'keratin', 'blowout'] },
    { id: 'mehwish', name: 'Mehwish Tariq', role: 'Skin & Spa Lead', photo: 'assets/stylist-mehwish.jpg', speciality: 'Facials, massage & spa rituals', bio: 'A certified aesthetician who built our spa menu around one idea: unhurried care. Mehwish leads skin consultations and the head spa ritual.', services: ['signature-facial', 'hydra-glow', 'express-polish', 'brow-shape', 'aroma-massage', 'hot-stone', 'body-scrub', 'head-spa'] },
    { id: 'zara', name: 'Zara Fatima', role: 'Nail Artist', photo: 'assets/stylist-zara.jpg', crop: 'crop-face', speciality: 'Gel extensions & hand-painted art', bio: 'Zara turns nails into small works of art — her hand-painted florals are the most requested designs in the salon.', services: ['classic-manicure', 'gel-extensions', 'spa-pedicure', 'nail-art'] }
  ];

  var REVIEWS = [
    { name: 'Mahnoor S.', service: 'Balayage & Gloss', stars: 5, text: 'Aisha understood exactly the colour I wanted from one photo. The salon is calm, spotless and never rushed.' },
    { name: 'Fatima R.', service: 'Velvet Head Spa Ritual', stars: 5, text: 'The head spa is unlike anything in Lahore. I booked my next visit before I left the chair.' },
    { name: 'Hira K.', service: 'Gel Extensions', stars: 5, text: 'Zara’s nail art gets me compliments everywhere. Booking online took two minutes and the reminder came on WhatsApp.' },
    { name: 'Amna J.', service: 'Signature Stone Facial', stars: 4, text: 'My skin was glowing for my sister’s wedding. Mehwish explained every step and never pushed products.' }
  ];

  var data = { CATEGORIES: CATEGORIES, SERVICES: SERVICES, STYLISTS: STYLISTS, REVIEWS: REVIEWS };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  global.VSData = data;
})(typeof window !== 'undefined' ? window : globalThis);
