// Slow Stays — shared site behaviour
(function () {
  // Sticky header shadow
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Dropdowns personalizados — popover branco como o calendário, a partir de <select>
  (function () {
    const selects = document.querySelectorAll('.control select');
    if (!selects.length) return;
    let openCtl = null;
    const syncers = [];

    function closeOpen() {
      if (openCtl) {
        openCtl._pop.hidden = true;
        openCtl.setAttribute('aria-expanded', 'false');
        openCtl = null;
      }
    }

    selects.forEach((sel) => {
      const control = sel.closest('.control');
      if (!control) return;

      const value = document.createElement('span');
      value.className = 'cs-value';
      control.insertBefore(value, control.firstChild);

      sel.classList.add('cs-native');
      sel.setAttribute('tabindex', '-1');
      sel.setAttribute('aria-hidden', 'true');

      control.classList.add('cs-control');
      control.setAttribute('role', 'button');
      control.setAttribute('tabindex', '0');
      control.setAttribute('aria-haspopup', 'listbox');
      control.setAttribute('aria-expanded', 'false');

      const pop = document.createElement('div');
      pop.className = 'cs-pop';
      pop.setAttribute('role', 'listbox');
      pop.hidden = true;
      control._pop = pop;

      const items = [];
      Array.prototype.forEach.call(sel.options, (opt, i) => {
        if (opt.value === '') return; // ignora placeholder ("Selecione uma opção")
        const item = document.createElement('div');
        item.className = 'cs-opt';
        item.setAttribute('role', 'option');
        item.textContent = opt.text;
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          sel.selectedIndex = i;
          value.textContent = opt.text;
          items.forEach((x) => { x.el.classList.remove('sel'); x.el.setAttribute('aria-selected', 'false'); });
          item.classList.add('sel');
          item.setAttribute('aria-selected', 'true');
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          closeOpen();
        });
        pop.appendChild(item);
        items.push({ el: item, idx: i, opt: opt });
      });
      control.appendChild(pop);

      function sync() {
        const cur = sel.options[sel.selectedIndex];
        value.textContent = cur ? cur.text : '';
        items.forEach((x) => {
          x.el.textContent = x.opt.text;
          const on = x.idx === sel.selectedIndex;
          x.el.classList.toggle('sel', on);
          x.el.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
      sync();
      syncers.push(sync);

      function positionHero() {
        const bar = control.closest('.booking-bar');
        if (!bar || window.innerWidth <= 980) { pop.style.top = ''; return; } // booking/mobile: CSS default
        pop.style.top = '0px';
        const r0 = pop.getBoundingClientRect();
        pop.style.top = (bar.getBoundingClientRect().bottom + 14 - r0.top) + 'px';
      }

      function toggleOpen(e) {
        e.stopPropagation();
        const willOpen = pop.hidden;
        closeOpen();
        if (willOpen) {
          pop.hidden = false;
          control.setAttribute('aria-expanded', 'true');
          openCtl = control;
          positionHero();
        }
      }
      control.addEventListener('click', toggleOpen);
      control.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(e); }
        else if (e.key === 'Escape') closeOpen();
      });
      pop.addEventListener('click', (e) => e.stopPropagation());
    });

    document.addEventListener('click', (e) => { if (openCtl && !openCtl.contains(e.target)) closeOpen(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOpen(); });
    window.addEventListener('resize', closeOpen);
    window.addEventListener('langchange', () => syncers.forEach((f) => f()));
  })();
})();
