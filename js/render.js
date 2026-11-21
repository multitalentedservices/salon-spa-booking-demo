/* Velvet & Stone (Demo) — renderers for services, stylists, reviews (data-driven). */
(function () {
  'use strict';
  var L = window.VSLogic, D = window.VSData;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* Services page: category filter that actually filters */
  var svcList = document.getElementById('svcList');
  if (svcList) {
    var chips = document.querySelectorAll('.chip[data-cat]');
    var count = document.getElementById('svcCount');
    function draw(cat) {
      var items = L.filterServices(D.SERVICES, cat);
      svcList.innerHTML = items.map(function (s) {
        return '<article class="svc reveal seen"><div class="svc-main"><span class="badge">' + esc(catLabel(s.category)) + '</span>' +
          '<h3>' + esc(s.name) + '</h3><p class="meta">' + esc(s.blurb) + '</p></div>' +
          '<div class="svc-side"><div class="price">' + L.formatPKR(s.price) + '</div><div class="meta">' + L.formatDuration(s.duration) + '</div>' +
          '<a class="btn small ghost" href="booking.html?service=' + s.id + '">Book</a></div></article>';
      }).join('');
      if (count) count.textContent = items.length + (items.length === 1 ? ' service' : ' services');
    }
    function catLabel(id) { var c = D.CATEGORIES.filter(function (x) { return x.id === id; })[0]; return c ? c.label : id; }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        draw(chip.getAttribute('data-cat'));
      });
    });
    draw('all');
  }

  /* Team page + home team strip */
  document.querySelectorAll('[data-team]').forEach(function (host) {
    host.innerHTML = D.STYLISTS.map(function (st) {
      var names = st.services.map(function (id) { var s = L.serviceById(D.SERVICES, id); return s ? s.name : ''; }).filter(Boolean);
      return '<article class="card reveal"><img class="card-img tall' + (st.crop ? ' ' + st.crop : '') + '" src="' + st.photo + '" alt="Portrait of ' + esc(st.name) + ', ' + esc(st.role) + ' at Velvet and Stone demo salon">' +
        '<div class="card-body"><span class="badge">' + esc(st.role) + '</span><h3>' + esc(st.name) + '</h3>' +
        '<p><strong>' + esc(st.speciality) + '</strong></p><p class="meta">' + esc(st.bio) + '</p>' +
        '<p class="meta">Offers: ' + esc(names.slice(0, 3).join(' · ')) + (names.length > 3 ? ' · +' + (names.length - 3) + ' more' : '') + '</p>' +
        '<a class="btn small" href="booking.html?stylist=' + st.id + '">Book with ' + esc(st.name.split(' ')[0]) + '</a></div></article>';
    }).join('');
  });

  /* Reviews (demo-labelled) */
  document.querySelectorAll('[data-reviews]').forEach(function (host) {
    host.innerHTML = D.REVIEWS.map(function (r) {
      var stars = ''; for (var i = 0; i < 5; i++) stars += i < r.stars ? '★' : '☆';
      return '<article class="card review reveal"><div class="card-body"><div class="stars" aria-label="' + r.stars + ' out of 5 stars">' + stars + '</div>' +
        '<p>“' + esc(r.text) + '”</p><p class="meta"><strong>' + esc(r.name) + '</strong> · ' + esc(r.service) + ' · demo review</p></div></article>';
    }).join('');
  });

  /* Home featured services */
  var feat = document.getElementById('featuredSvc');
  if (feat) {
    var picks = ['balayage', 'head-spa', 'hydra-glow', 'gel-extensions'];
    var imgs = { 'balayage': 'assets/hair.jpg', 'head-spa': 'assets/spa.jpg', 'hydra-glow': 'assets/facial.jpg', 'gel-extensions': 'assets/nails.jpg' };
    feat.innerHTML = picks.map(function (id) {
      var s = L.serviceById(D.SERVICES, id);
      return '<article class="card reveal"><img class="card-img" src="' + imgs[id] + '" alt="' + esc(s.name) + ' at Velvet and Stone demo salon">' +
        '<div class="card-body"><h3>' + esc(s.name) + '</h3><p class="meta">' + esc(s.blurb) + '</p>' +
        '<p><span class="price">' + L.formatPKR(s.price) + '</span> <span class="meta">· ' + L.formatDuration(s.duration) + '</span></p>' +
        '<a class="btn small ghost" href="booking.html?service=' + id + '">Book this</a></div></article>';
    }).join('');
  }
})();
