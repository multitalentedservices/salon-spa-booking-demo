/* Velvet & Stone (Demo) — pure logic, shared by the site and the Node test battery.
   No DOM access in this file. */
(function (global) {
  'use strict';

  var OPEN_HOUR = 10;          // salon opens 10:00
  var LAST_START = 19;         // last appointment starts 19:00 (closes 20:00)
  var CLOSED_WEEKDAY = 1;      // Monday closed
  var DEMO_WHATSAPP = '923214567890';

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function filterServices(services, category) {
    if (!category || category === 'all') return services.slice();
    return services.filter(function (s) { return s.category === category; });
  }

  function serviceById(services, id) {
    for (var i = 0; i < services.length; i++) if (services[i].id === id) return services[i];
    return null;
  }

  function stylistById(stylists, id) {
    for (var i = 0; i < stylists.length; i++) if (stylists[i].id === id) return stylists[i];
    return null;
  }

  /* Stylists who can perform at least one of the selected services.
     A stylist qualifies only if they cover EVERY selected service. */
  function stylistsForServices(stylists, serviceIds) {
    if (!serviceIds || !serviceIds.length) return stylists.slice();
    return stylists.filter(function (st) {
      return serviceIds.every(function (sid) { return st.services.indexOf(sid) !== -1; });
    });
  }

  function totals(services, serviceIds) {
    var price = 0, mins = 0;
    (serviceIds || []).forEach(function (id) {
      var s = serviceById(services, id);
      if (s) { price += s.price; mins += s.duration; }
    });
    return { price: price, duration: mins };
  }

  function formatPKR(n) { return 'PKR ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function formatDuration(mins) {
    if (mins < 60) return mins + ' min';
    var h = Math.floor(mins / 60), m = mins % 60;
    return m ? h + ' hr ' + m + ' min' : h + ' hr';
  }

  function todayStr(now) {
    now = now || new Date();
    return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  }

  function isPastDate(dateStr, now) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || '')) return true;
    return dateStr < todayStr(now);
  }

  function isClosedDay(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    return d.getDay() === CLOSED_WEEKDAY;
  }

  /* Deterministic demo hash so "taken" slots are stable across loads/tests. */
  function hashStr(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }

  /* Slots for a date + stylist. Returns [{time:'10:00', taken:bool, past:bool}].
     Closed Mondays return []. Past dates return []. */
  function generateSlots(dateStr, stylistId, now) {
    now = now || new Date();
    if (!dateStr || isPastDate(dateStr, now) || isClosedDay(dateStr)) return [];
    var slots = [];
    var isToday = dateStr === todayStr(now);
    var nowMins = now.getHours() * 60 + now.getMinutes();
    for (var h = OPEN_HOUR; h <= LAST_START; h++) {
      var time = pad(h) + ':00';
      var taken = hashStr(dateStr + '|' + (stylistId || 'any') + '|' + time) % 4 === 0;
      var past = isToday && (h * 60 <= nowMins);
      slots.push({ time: time, taken: taken, past: past, available: !taken && !past });
    }
    return slots;
  }

  function validPhone(p) {
    if (!p) return false;
    var digits = String(p).replace(/[\s+-]/g, '');
    if (!/^\d+$/.test(digits)) return false;
    if (/^03\d{9}$/.test(digits)) return true;          // local mobile 03XX-XXXXXXX
    if (/^92\d{10}$/.test(digits)) return true;          // international format
    return digits.length >= 10 && digits.length <= 13;
  }

  /* Booking validation. state: {serviceIds, stylistId, date, time, name, phone} */
  function validateBooking(state, now) {
    var errors = {};
    if (!state.serviceIds || !state.serviceIds.length) errors.services = 'Choose at least one service.';
    if (!state.stylistId) errors.stylist = 'Choose a stylist, or First Available.';
    if (!state.date) errors.date = 'Choose a date.';
    else if (isPastDate(state.date, now)) errors.date = 'That date has passed — pick a day from today onwards.';
    else if (isClosedDay(state.date)) errors.date = 'We are closed on Mondays — pick another day.';
    if (!state.time) errors.time = 'Choose a time slot.';
    if (!state.name || state.name.trim().length < 3) errors.name = 'Please enter your full name.';
    if (!validPhone(state.phone)) errors.phone = 'Enter a valid mobile number, e.g. 0321 4567890.';
    return errors;
  }

  function bookingRef(state) {
    var seed = (state.serviceIds || []).join(',') + '|' + state.date + '|' + state.time + '|' + (state.phone || '');
    return 'VS-DEMO-' + (1000 + (hashStr(seed) % 9000));
  }

  function buildWhatsAppMessage(state, services, stylists) {
    var names = (state.serviceIds || []).map(function (id) {
      var s = serviceById(services, id); return s ? s.name : id;
    });
    var st = state.stylistId === 'any' ? 'First available' : (stylistById(stylists, state.stylistId) || {}).name;
    var t = totals(services, state.serviceIds);
    var lines = [
      'Hello Velvet & Stone (Demo), I would like to confirm my booking.',
      'Ref: ' + bookingRef(state),
      'Name: ' + state.name,
      'Services: ' + names.join(', '),
      'Stylist: ' + st,
      'Date: ' + state.date + ' at ' + state.time,
      'Total: ' + formatPKR(t.price) + ' (' + formatDuration(t.duration) + ')'
    ];
    return lines.join('\n');
  }

  function buildWhatsAppLink(state, services, stylists) {
    return 'https://wa.me/' + DEMO_WHATSAPP + '?text=' + encodeURIComponent(buildWhatsAppMessage(state, services, stylists));
  }

  var api = {
    OPEN_HOUR: OPEN_HOUR, LAST_START: LAST_START, DEMO_WHATSAPP: DEMO_WHATSAPP,
    filterServices: filterServices, serviceById: serviceById, stylistById: stylistById,
    stylistsForServices: stylistsForServices, totals: totals, formatPKR: formatPKR,
    formatDuration: formatDuration, todayStr: todayStr, isPastDate: isPastDate,
    isClosedDay: isClosedDay, generateSlots: generateSlots, validPhone: validPhone,
    validateBooking: validateBooking, bookingRef: bookingRef,
    buildWhatsAppMessage: buildWhatsAppMessage, buildWhatsAppLink: buildWhatsAppLink
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.VSLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
