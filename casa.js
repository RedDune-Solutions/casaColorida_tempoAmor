/* ============================================================
   PÁGINA DE CASA — carrossel de fotos, calendário e pedido curto.
   Partilhado por casa-colorida.html e tempo-amor.html.
   ============================================================ */

/* header transparente ganha fundo assim que sai do topo (igual à home) */
(function () {
  var bar = document.querySelector('.bar');
  if (!bar) return;
  function sync() { bar.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', sync, { passive: true });
  sync();
})();

/* ---------- fotos por casa ---------- */
var CASA_SHOTS = {
  colorida: {
    dir: 'assets/casas/colorida/',
    shots: [
      ['colorida-07', 'ph.living'],  ['colorida-06', 'ph.living'],   ['colorida-01', 'ph.kitchen'],
      ['colorida-09', 'ph.kitchen'], ['colorida-02', 'ph.bedroom'],  ['colorida-03', 'ph.bedroom'],
      ['colorida-04', 'ph.twin'],    ['colorida-05', 'ph.twin'],     ['colorida-11', 'ph.patio'],
      ['colorida-10', 'ph.patio'],   ['colorida-08', 'ph.facade']
    ]
  },
  tempo: {
    dir: 'assets/casas/tempo/',
    shots: [
      ['tempo-02', 'ph.living'],  ['tempo-06', 'ph.living'],   ['tempo-01', 'ph.kitchen'],
      ['tempo-04', 'ph.bedroom'], ['tempo-05', 'ph.bedroom'],  ['tempo-03', 'ph.bathroom'],
      ['tempo-07', 'ph.terrace'], ['tempo-08', 'ph.exterior']
    ]
  }
};
var FALLBACK_ALT = {
  'ph.living': 'Sala de estar', 'ph.kitchen': 'Cozinha equipada', 'ph.bedroom': 'Quarto de casal',
  'ph.twin': 'Quarto com duas camas', 'ph.patio': 'Pátio com churrasqueira', 'ph.facade': 'Fachada da casa',
  'ph.bathroom': 'Casa de banho', 'ph.terrace': 'Terraço com vista', 'ph.exterior': 'Pátio de entrada e escadas'
};
function casaLabel(k) { return (window.t && window.t(k) !== k) ? window.t(k) : (FALLBACK_ALT[k] || ''); }

/* ---------- carrossel ---------- */
(function () {
  var host = document.getElementById('slider');
  if (!host) return;
  var house = CASA_SHOTS[host.getAttribute('data-house')];
  if (!house) return;
  var dotsBox = host.querySelector('.cs-dots');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var imgs = [], dots = [], i = 0, timer = null, hovered = false, lbOpen = false;

  house.shots.forEach(function (s, n) {
    var im = new Image();
    im.src = house.dir + s[0] + '.webp';
    im.alt = casaLabel(s[1]);
    im.setAttribute('data-i18n-attr', 'alt:' + s[1]);
    if (n === 0) im.className = 'on'; else im.setAttribute('aria-hidden', 'true');
    /* só a foto visível deve ser clicável para abrir em grande */
    im.addEventListener('click', function () { if (n === i) openLb(i); });
    host.insertBefore(im, host.querySelector('.cs-nav'));
    imgs.push(im);

    var d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-selected', n === 0 ? 'true' : 'false');
    d.setAttribute('aria-label', String(n + 1));
    d.addEventListener('click', function () { stop(); show(n); });
    dotsBox.appendChild(d);
    dots.push(d);
  });

  function show(n) {
    i = (n + imgs.length) % imgs.length;
    imgs.forEach(function (im, k) {
      im.classList.toggle('on', k === i);
      /* o cursor e o pointer-events vêm do CSS (.casa-slider img.on) */
      if (k === i) im.removeAttribute('aria-hidden');
      else im.setAttribute('aria-hidden', 'true');
    });
    dots.forEach(function (d, k) { d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
  }
  function start() { if (!timer && !reduce) timer = setInterval(function () { if (!hovered && !lbOpen && !document.hidden) show(i + 1); }, 6000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  host.querySelector('.cs-nav.prev').addEventListener('click', function () { stop(); show(i - 1); });
  host.querySelector('.cs-nav.next').addEventListener('click', function () { stop(); show(i + 1); });
  host.addEventListener('mouseenter', function () { hovered = true; });
  host.addEventListener('mouseleave', function () { hovered = false; });
  host.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { stop(); show(i - 1); }
    if (e.key === 'ArrowRight') { stop(); show(i + 1); }
  });
  window.addEventListener('langchange', function () {
    imgs.forEach(function (im, n) { im.alt = casaLabel(house.shots[n][1]); });
  });
  show(0); start();

  /* ---------- lightbox ---------- */
  var lb = document.createElement('div');
  lb.className = 'lb'; lb.hidden = true;
  lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
  lb.innerHTML =
    '<img alt="" />' +
    '<button type="button" class="lb-close" aria-label="' + ((window.t && window.t('lb.close')) || 'Fechar') + '">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<span class="lb-count"></span>';
  document.body.appendChild(lb);
  var big = lb.querySelector('img');
  var count = lb.querySelector('.lb-count');
  var lastFocus = null;

  function paintLb() {
    var s = house.shots[i];
    big.src = house.dir + s[0] + '.webp';
    big.alt = casaLabel(s[1]);
    count.textContent = (i + 1) + ' / ' + house.shots.length;
  }
  function openLb(n) {
    i = n; paintLb();
    lastFocus = document.activeElement;
    lbOpen = true; lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function closeLb() {
    lb.hidden = true; lbOpen = false;
    document.body.style.overflow = '';
    big.src = '';
    show(i);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  big.addEventListener('click', function () { i = (i + 1) % house.shots.length; paintLb(); });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') { i = (i + 1) % house.shots.length; paintLb(); }
    if (e.key === 'ArrowLeft')  { i = (i - 1 + house.shots.length) % house.shots.length; paintLb(); }
  });
})();

/* ---------- calendário de intervalo ---------- */
(function () {
  var trigger = document.getElementById('dateTrigger');
  var pop     = document.getElementById('calPop');
  var val     = document.getElementById('dateValue');
  if (!trigger || !pop || !val) return;

  function MON()  { return (window.ccMonths ? window.ccMonths() : ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']); }
  function DOWS() { return (window.ccDows  ? window.ccDows()  : ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']); }
  var now = new Date();
  var viewYear = now.getFullYear(), viewMonth = now.getMonth();
  var selStart = null, selEnd = null;
  var mlabel = pop.querySelector('.mlabel');
  var grid   = pop.querySelector('.cal-grid');
  var navs   = pop.querySelectorAll('.cal-nav');
  var host   = trigger.closest('.cf-card');

  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function fmtD(d) { return (d.getDate() < 10 ? '0' : '') + d.getDate() + ' ' + MON()[d.getMonth()]; }
  function fmtISO(d) { var m = d.getMonth() + 1, day = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day; }

  function render() {
    mlabel.textContent = MON()[viewMonth] + ' ' + viewYear;
    var firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    var dim = new Date(viewYear, viewMonth + 1, 0).getDate();
    var prevDays = new Date(viewYear, viewMonth, 0).getDate();
    var today = new Date(); today.setHours(0,0,0,0);
    var html = DOWS().map(function (x) { return '<div class="dow">' + x + '</div>'; }).join('');
    for (var k = firstDow - 1; k >= 0; k--) html += '<div class="day muted">' + (prevDays - k) + '</div>';
    for (var d = 1; d <= dim; d++) {
      var dt = new Date(viewYear, viewMonth, d), cls = 'day';
      if (dt < today) cls += ' muted';
      else if ((selStart && sameDay(dt, selStart)) || (selEnd && sameDay(dt, selEnd))) cls += ' active';
      else if (selStart && selEnd && dt > selStart && dt < selEnd) cls += ' range';
      html += '<div class="' + cls + '" data-iso="' + fmtISO(dt) + '">' + d + '</div>';
    }
    var trail = (7 - ((firstDow + dim) % 7)) % 7;
    for (var t = 1; t <= trail; t++) html += '<div class="day muted">' + t + '</div>';
    grid.innerHTML = html;
    Array.prototype.forEach.call(grid.querySelectorAll('.day:not(.muted)'), function (el) {
      el.addEventListener('click', function () {
        var dt = new Date(el.dataset.iso + 'T12:00:00');
        if (!selStart || (selStart && selEnd)) { selStart = dt; selEnd = null; }
        else if (dt < selStart) { selEnd = selStart; selStart = dt; }
        else if (sameDay(dt, selStart)) { return; }
        else { selEnd = dt; }
        render(); update();
        if (selStart && selEnd) setTimeout(close, 120);
      });
    });
  }
  function update() {
    if (selStart && selEnd) { val.textContent = fmtD(selStart) + ' — ' + fmtD(selEnd); val.style.color = 'var(--ink)'; }
    else if (selStart)      { val.textContent = fmtD(selStart) + ' — …'; val.style.color = 'var(--ink)'; }
  }
  /* escolhe o lado com espaço e nunca fica escondido sob o header */
  function place() {
    pop.style.maxHeight = '';
    var anchor = pop.offsetParent || trigger;
    var r = anchor.getBoundingClientRect();
    var barH = (document.querySelector('.bar') || {}).offsetHeight || 0;
    var needed = pop.offsetHeight || 330;
    var below = window.innerHeight - r.bottom - 12;
    var above = r.top - barH - 12;
    var up = below < needed && above > below;
    pop.classList.toggle('up', up);
    var room = up ? above : below;
    if (needed > room) pop.style.maxHeight = Math.max(room, 180) + 'px';
  }
  function open() {
    render(); pop.hidden = false; trigger.setAttribute('aria-expanded','true');
    if (host) host.classList.add('pop-open');
    place(); requestAnimationFrame(place);
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
  }
  function close() {
    pop.hidden = true; trigger.setAttribute('aria-expanded','false');
    if (host) host.classList.remove('pop-open');
    window.removeEventListener('scroll', place);
    window.removeEventListener('resize', place);
  }
  trigger.addEventListener('click', function (e) { e.stopPropagation(); pop.hidden ? open() : close(); });
  pop.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function (e) { if (!pop.hidden && !pop.contains(e.target) && !trigger.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  if (navs[0]) navs[0].addEventListener('click', function () { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); });
  if (navs[1]) navs[1].addEventListener('click', function () { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); });
  window.addEventListener('langchange', function () { render(); update(); });

  window.ccCasaDates = function () { return (selStart && selEnd) ? { cin: fmtISO(selStart), cout: fmtISO(selEnd) } : null; };
})();

/* ---------- envio: leva tudo para o booking (onde vive o RGPD + captcha) ---------- */
(function () {
  var form = document.getElementById('casaForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hs = document.getElementById('cfHouse');
    var slug = (hs && hs.selectedIndex === 0 && /Colorida/i.test(hs.value)) ? 'colorida'
             : (hs && /Tempo/i.test(hs.value)) ? 'tempo' : 'colorida';
    var q = [];
    var d = window.ccCasaDates && window.ccCasaDates();
    if (d) { q.push('checkin=' + d.cin); q.push('checkout=' + d.cout); }
    q.push('house=' + slug);
    var g = document.getElementById('cfGuests');
    if (g) q.push('guests=' + encodeURIComponent(g.value));
    q.push('baby=' + (document.getElementById('cfBaby') && document.getElementById('cfBaby').checked ? '1' : '0'));
    q.push('pet='  + (document.getElementById('cfPet')  && document.getElementById('cfPet').checked  ? '1' : '0'));
    /* contacto vai por sessionStorage — nunca dados pessoais no URL */
    try {
      sessionStorage.setItem('cc_prefill', JSON.stringify({
        name:  (document.getElementById('cfName')  || {}).value || '',
        phone: (document.getElementById('cfPhone') || {}).value || '',
        email: (document.getElementById('cfEmail') || {}).value || ''
      }));
    } catch (err) {}
    window.location.href = 'booking.html?' + q.join('&');
  });
})();
