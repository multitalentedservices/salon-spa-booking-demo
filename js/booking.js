/* Velvet & Stone (Demo) — multi-step booking engine.
   Steps: 1 services → 2 stylist → 3 date & time → 4 your details → 5 review → confirmation.
   Validation runs through VSLogic.validateBooking; errors clear LIVE as fields are fixed. */
(function () {
  'use strict';
  var host = document.getElementById('bookingApp');
  if (!host) return;
  var L = window.VSLogic, D = window.VSData;

  var state = { serviceIds: [], stylistId: '', date: '', time: '', name: '', phone: '' };
  var step = 1;

  /* Preselect from query string (?service= / ?stylist=) */
  var q = new URLSearchParams(location.search);
  if (q.get('service') && L.serviceById(D.SERVICES, q.get('service'))) state.serviceIds = [q.get('service')];
  if (q.get('stylist') && L.stylistById(D.STYLISTS, q.get('stylist'))) state.stylistId = q.get('stylist');

  var panels = host.querySelectorAll('.step-panel');
  var stepItems = host.querySelectorAll('.steps li');
  var formErr = document.getElementById('formErr');

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function showStep(n) {
    step = n;
    panels.forEach(function (p) { p.classList.toggle('on', Number(p.getAttribute('data-step')) === n); });
    stepItems.forEach(function (li, i) { li.classList.toggle('on', i === n - 1); });
    formErr.classList.remove('show');
    window.scrollTo({ top: host.offsetTop - 90, behavior: 'smooth' });
  }
  function fail(msg) { formErr.textContent = msg; formErr.classList.add('show'); formErr.scrollIntoView({ block: 'center', behavior: 'smooth' }); }

  /* ---- Step 1: services (checkbox picks) ---- */
  var svcHost = document.getElementById('bkServices');
  svcHost.innerHTML = D.SERVICES.map(function (s) {
    return '<label class="pick' + (state.serviceIds.indexOf(s.id) !== -1 ? ' sel' : '') + '"><input type="checkbox" value="' + s.id + '"' +
      (state.serviceIds.indexOf(s.id) !== -1 ? ' checked' : '') + '><span class="pick-main"><strong>' + esc(s.name) + '</strong><br>' +
      '<span class="meta">' + esc(s.blurb) + '</span></span><span class="svc-side"><span class="price">' + L.formatPKR(s.price) + '</span><br><span class="meta">' + L.formatDuration(s.duration) + '</span></span></label>';
  }).join('');
  var svcErr = document.getElementById('err-services');
  function syncSvc() {
    state.serviceIds = Array.prototype.map.call(svcHost.querySelectorAll('input:checked'), function (i) { return i.value; });
    svcHost.querySelectorAll('.pick').forEach(function (p) {
      p.classList.toggle('sel', p.querySelector('input').checked);
    });
    if (state.serviceIds.length) svcErr.style.display = 'none';
    drawStylists(); drawSummary();
  }
  svcHost.addEventListener('change', syncSvc);

  /* ---- Step 2: stylists (radio picks, filtered by coverage) ---- */
  var styHost = document.getElementById('bkStylists');
  var styErr = document.getElementById('err-stylist');
  function drawStylists() {
    var eligible = L.stylistsForServices(D.STYLISTS, state.serviceIds);
    if (state.stylistId && state.stylistId !== 'any' && !L.stylistById(eligible, state.stylistId)) state.stylistId = '';
    var html = '<label class="pick' + (state.stylistId === 'any' ? ' sel' : '') + '"><input type="radio" name="sty" value="any"' + (state.stylistId === 'any' ? ' checked' : '') + '><span class="pick-main"><strong>First available</strong><br><span class="meta">We match you with the first stylist free at your time.</span></span></label>';
    html += eligible.map(function (st) {
      return '<label class="pick' + (state.stylistId === st.id ? ' sel' : '') + '"><input type="radio" name="sty" value="' + st.id + '"' + (state.stylistId === st.id ? ' checked' : '') + '><span class="pick-main"><strong>' + esc(st.name) + '</strong> · ' + esc(st.role) + '<br><span class="meta">' + esc(st.speciality) + '</span></span></label>';
    }).join('');
    styHost.innerHTML = html;
  }
  styHost.addEventListener('change', function () {
    var r = styHost.querySelector('input:checked');
    state.stylistId = r ? r.value : '';
    styHost.querySelectorAll('.pick').forEach(function (p) { p.classList.toggle('sel', !!p.querySelector('input:checked')); });
    if (state.stylistId) styErr.style.display = 'none';
    drawSlots(); drawSummary();
  });

  /* ---- Step 3: date + slots ---- */
  var dateInput = document.getElementById('bkDate');
  var slotHost = document.getElementById('bkSlots');
  var dateField = document.getElementById('field-date');
  dateInput.min = L.todayStr();
  function setFieldError(fieldEl, errEl, msg) {
    if (msg) { fieldEl.classList.add('invalid'); errEl.textContent = msg; }
    else { fieldEl.classList.remove('invalid'); errEl.textContent = ''; }
  }
  function drawSlots() {
    state.time = '';
    if (!state.date) { slotHost.innerHTML = '<p class="meta">Pick a date first — available times appear here.</p>'; return; }
    var slots = L.generateSlots(state.date, state.stylistId === 'any' ? '' : state.stylistId);
    if (!slots.length) { slotHost.innerHTML = '<p class="meta">No slots — we are closed on Mondays. Please pick another day.</p>'; return; }
    slotHost.innerHTML = slots.map(function (s) {
      return '<button type="button" class="slot" data-time="' + s.time + '"' + (s.available ? '' : ' disabled aria-disabled="true"') + '>' + s.time + (s.taken ? ' · taken' : '') + '</button>';
    }).join('');
  }
  dateInput.addEventListener('change', function () {
    state.date = dateInput.value;
    var errs = L.validateBooking({ serviceIds: ['x'], stylistId: 'any', date: state.date, time: '10:00', name: 'Valid Name', phone: '03214567890' });
    setFieldError(dateField, document.getElementById('err-date'), errs.date || '');
    drawSlots(); drawSummary();
  });
  slotHost.addEventListener('click', function (e) {
    var b = e.target.closest('.slot'); if (!b || b.disabled) return;
    state.time = b.getAttribute('data-time');
    slotHost.querySelectorAll('.slot').forEach(function (s) { s.classList.toggle('sel', s === b); });
    document.getElementById('err-time').style.display = 'none';
    drawSummary();
  });

  /* ---- Step 4: details with LIVE error clearing ---- */
  var nameInput = document.getElementById('bkName'), phoneInput = document.getElementById('bkPhone');
  function liveCheck() {
    state.name = nameInput.value; state.phone = phoneInput.value;
    var errs = L.validateBooking({ serviceIds: ['x'], stylistId: 'any', date: L.todayStr(), time: '10:00', name: state.name, phone: state.phone });
    if (nameInput.dataset.touched) setFieldError(document.getElementById('field-name'), document.getElementById('err-name'), errs.name || '');
    if (phoneInput.dataset.touched) setFieldError(document.getElementById('field-phone'), document.getElementById('err-phone'), errs.phone || '');
    drawSummary();
  }
  nameInput.addEventListener('input', liveCheck);
  phoneInput.addEventListener('input', liveCheck);
  nameInput.addEventListener('blur', function () { nameInput.dataset.touched = '1'; liveCheck(); });
  phoneInput.addEventListener('blur', function () { phoneInput.dataset.touched = '1'; liveCheck(); });

  /* ---- Summary (step 5 + side totals) ---- */
  function stylistName() {
    if (!state.stylistId) return '—';
    return state.stylistId === 'any' ? 'First available' : (L.stylistById(D.STYLISTS, state.stylistId) || {}).name;
  }
  function drawSummary() {
    var t = L.totals(D.SERVICES, state.serviceIds);
    var names = state.serviceIds.map(function (id) { return (L.serviceById(D.SERVICES, id) || {}).name; }).filter(Boolean);
    var html = '<dl><dt>Services</dt><dd>' + (names.length ? esc(names.join(', ')) : 'None chosen yet') + '</dd>' +
      '<dt>Stylist</dt><dd>' + esc(stylistName()) + '</dd>' +
      '<dt>When</dt><dd>' + (state.date ? esc(state.date) : '—') + (state.time ? ' at ' + esc(state.time) : '') + '</dd>' +
      '<dt>Guest</dt><dd>' + (state.name ? esc(state.name) : '—') + '</dd>' +
      '<dt>Total</dt><dd><span class="price">' + L.formatPKR(t.price) + '</span> · ' + L.formatDuration(t.duration) + '</dd></dl>';
    document.getElementById('bkSummary').innerHTML = html;
    var live = document.getElementById('bkLiveTotal');
    if (live) live.textContent = state.serviceIds.length ? L.formatPKR(t.price) + ' · ' + L.formatDuration(t.duration) : 'No services chosen yet';
  }

  /* ---- Navigation with per-step validation ---- */
  function stepErrors(n) {
    var errs = L.validateBooking(state);
    if (n === 1) return errs.services ? [errs.services, 'services'] : [];
    if (n === 2) return errs.stylist ? [errs.stylist, 'stylist'] : [];
    if (n === 3) { if (errs.date) return [errs.date, 'date']; if (errs.time) return [errs.time, 'time']; return []; }
    if (n === 4) { if (errs.name) return [errs.name, 'name']; if (errs.phone) return [errs.phone, 'phone']; return []; }
    return [];
  }
  host.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var bad = stepErrors(step);
      if (bad.length) {
        if (bad[1] === 'services') svcErr.style.display = 'block';
        if (bad[1] === 'stylist') styErr.style.display = 'block';
        if (bad[1] === 'time') document.getElementById('err-time').style.display = 'block';
        if (bad[1] === 'date') setFieldError(dateField, document.getElementById('err-date'), bad[0]);
        if (bad[1] === 'name') { nameInput.dataset.touched = '1'; liveCheck(); }
        if (bad[1] === 'phone') { phoneInput.dataset.touched = '1'; liveCheck(); }
        fail(bad[0]); return;
      }
      showStep(step + 1);
    });
  });
  host.querySelectorAll('[data-back]').forEach(function (btn) {
    btn.addEventListener('click', function () { showStep(step - 1); });
  });

  /* ---- Confirm: save to localStorage, show confirmation + WhatsApp path ---- */
  document.getElementById('confirmBtn').addEventListener('click', function () {
    var errs = L.validateBooking(state);
    var first = Object.keys(errs)[0];
    if (first) { fail(errs[first]); return; }
    var booking = Object.assign({}, state, { ref: L.bookingRef(state), totals: L.totals(D.SERVICES, state.serviceIds), savedAt: new Date().toISOString() });
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem('velvetstone_bookings') || '[]'); } catch (e) { saved = []; }
    saved.push(booking);
    try { localStorage.setItem('velvetstone_bookings', JSON.stringify(saved)); } catch (e) { /* storage unavailable — demo continues */ }

    document.getElementById('c-ref').textContent = booking.ref;
    document.getElementById('c-summary').innerHTML = document.getElementById('bkSummary').innerHTML;
    var wa = document.getElementById('waBtn');
    wa.href = L.buildWhatsAppLink(state, D.SERVICES, D.STYLISTS);
    wa.addEventListener('click', function () {
      var log = [];
      try { log = JSON.parse(localStorage.getItem('velvetstone_wa_log') || '[]'); } catch (e) { log = []; }
      log.push({ ref: booking.ref, at: new Date().toISOString(), channel: 'whatsapp' });
      try { localStorage.setItem('velvetstone_wa_log', JSON.stringify(log)); } catch (e) {}
    });
    showStep(6);
    drawMyBookings();
  });

  /* ---- My bookings (returning-visit lookup from localStorage) ---- */
  function drawMyBookings() {
    var host2 = document.getElementById('myBookings');
    if (!host2) return;
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem('velvetstone_bookings') || '[]'); } catch (e) { saved = []; }
    if (!saved.length) { host2.innerHTML = '<p class="meta">No bookings saved on this device yet — your confirmed demo bookings will appear here.</p>'; return; }
    host2.innerHTML = saved.map(function (b) {
      var names = (b.serviceIds || []).map(function (id) { return (L.serviceById(D.SERVICES, id) || {}).name; }).filter(Boolean).join(', ');
      return '<article class="svc"><div class="svc-main"><strong>' + esc(b.ref) + '</strong><br><span class="meta">' + esc(names) + ' · ' + esc(b.date) + ' at ' + esc(b.time) + ' · ' + esc(b.name) + '</span></div><div class="svc-side"><span class="price">' + L.formatPKR(b.totals.price) + '</span></div></article>';
    }).join('');
  }

  drawStylists(); drawSlots(); drawSummary(); drawMyBookings();
  showStep(1);
})();
