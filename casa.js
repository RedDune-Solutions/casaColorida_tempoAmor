// Páginas das casas — lightbox da galeria (partilhado)
(function () {
  var gal = document.querySelector('.gallery');
  if (!gal) return;
  var imgs = Array.prototype.slice.call(gal.querySelectorAll('.gcell img'));
  if (!imgs.length) return;

  var lb = null, cur = 0, lastFocus = null;
  function lbl(n, fb) { return gal.getAttribute('data-lb-' + n) || fb; }

  function ensure() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button type="button" class="lb-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button type="button" class="lb-nav lb-prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<figure><img alt="" /><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-nav lb-next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '<span class="lb-count"></span>';
    document.body.appendChild(lb);
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    var im = lb.querySelector('figure img');
    im.src = imgs[cur].getAttribute('src');
    im.alt = imgs[cur].getAttribute('alt') || '';
    lb.querySelector('figcaption').textContent = im.alt;
    lb.querySelector('.lb-count').textContent = (cur + 1) + ' / ' + imgs.length;
  }

  function refreshLabels() {
    lb.querySelector('.lb-close').setAttribute('aria-label', lbl('close', 'Fechar'));
    lb.querySelector('.lb-prev').setAttribute('aria-label', lbl('prev', 'Anterior'));
    lb.querySelector('.lb-next').setAttribute('aria-label', lbl('next', 'Seguinte'));
  }

  function open(i) {
    ensure();
    refreshLabels();
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    show(i);
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  imgs.forEach(function (im, i) {
    var cell = im.closest('.gcell');
    if (cell) cell.addEventListener('click', function () { open(i); });
  });
})();
