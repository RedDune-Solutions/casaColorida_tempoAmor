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
    const setMenu = (open) => {
      drawer.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setMenu(!drawer.classList.contains('open')));
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
    /* passar para desktop com o menu aberto deixava o body com overflow:hidden
       (drawer escondido pelo media query) e a página não rolava */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && drawer.classList.contains('open')) setMenu(false);
    });
  }

  /* ============================================================
     Motor partilhado de popovers (calendário + dropdowns).
     Existe para que TODOS os campos do widget se comportem da
     mesma maneira: mesma âncora, mesmo ponto de viragem no scroll,
     nunca por cima do header fixo, e só um aberto de cada vez.
     ============================================================ */
  const ccPop = window.ccPop = (function () {
    let current = null;                 // { pop, close }
    /* altura de referência comum a todos os popovers (o calendário é o mais
       alto): a decisão cima/baixo não pode depender da altura de cada campo,
       senão um dropdown baixo abria para baixo e o calendário para cima */
    const POP_REF = 360;

    function headerBottom() {
      const h = document.querySelector('.bar') || document.querySelector('.site-header');
      if (!h) return 0;
      return Math.max(0, h.getBoundingClientRect().bottom);
    }

    /* Posiciona `pop` por `top` absoluto (nunca por `bottom`), para que
       calendário e dropdowns assentem exatamente na mesma linha de base. */
    function place(trigger, pop) {
      if (pop.hidden) return;
      pop.classList.remove('up');
      pop.style.maxHeight = '';
      pop.style.bottom = 'auto';

      const card = trigger.closest('.booking-bar');
      const hero = !!card && window.innerWidth > 980;
      /* no hero a âncora é o cartão inteiro (não o campo): assim os três
         popovers abrem alinhados e viram todos ao mesmo tempo.
         Fora do hero é o bloco do campo (label + caixa + nota) — o mesmo
         para o calendário e para os dropdowns, senão ficavam desalinhados */
      const anchorEl = hero ? card
        : (trigger.closest('.field, .field-fig, .date-field') || pop.offsetParent || trigger);
      const anchor = anchorEl.getBoundingClientRect();
      const limit = headerBottom() + 8;
      /* campo fora de vista (tapado pelo header ou abaixo do ecrã): fecha,
         em vez de deixar o popover pendurado sozinho */
      if (anchor.bottom < limit || anchor.top > window.innerHeight) {
        if (current && current.pop === pop) closeAll();
        return;
      }
      const gap = hero ? 14 : 12;
      const above = anchor.top - gap - limit;
      const below = window.innerHeight - anchor.bottom - gap - 8;

      let needed = pop.offsetHeight || 300;
      /* decisão tomada com a altura de referência, não com a do popover:
         assim todos os campos viram no mesmo ponto de scroll */
      const ref = Math.max(needed, POP_REF);
      /* no hero prefere-se abrir para cima (sobre a fotografia); em qualquer
         caso, se não cabe do lado preferido fica do lado com mais espaço */
      const up = hero ? (above >= ref || above > below)
                      : (below < ref && above > below);
      const room = up ? above : below;
      if (needed > room) {
        pop.style.maxHeight = Math.max(room, 180) + 'px';
        needed = pop.offsetHeight;
      }

      let y = up ? (anchor.top - gap - needed) : (anchor.bottom + gap);
      if (y < limit) y = limit;         // nunca por baixo/por cima do header
      pop.style.top = '0px';
      pop.style.top = (y - pop.getBoundingClientRect().top) + 'px';
    }

    function closeAll() { const c = current; current = null; if (c) c.close(); }

    function reset(pop) {
      pop.style.top = ''; pop.style.bottom = ''; pop.style.maxHeight = '';
      pop.classList.remove('up');
    }

    return {
      place: place,
      reset: reset,
      /* abrir um popover fecha o que estiver aberto */
      opened: function (entry) {
        const prev = current;
        current = entry;
        if (prev && prev.pop !== entry.pop) prev.close();
      },
      closed: function (pop) { if (current && current.pop === pop) current = null; },
      closeAll: closeAll
    };
  })();

  // Dropdowns personalizados — popover branco como o calendário, a partir de <select>
  (function () {
    let openCtl = null;
    const syncers = [];

    function closeOpen() {
      if (!openCtl) return;
      const ctl = openCtl;
      openCtl = null;
      ctl._pop.hidden = true;
      ctl.setAttribute('aria-expanded', 'false');
      if (ctl._host) ctl._host.classList.remove('pop-open');
      window.removeEventListener('scroll', ctl._place);
      window.removeEventListener('resize', ctl._place);
      ccPop.reset(ctl._pop);
      ccPop.closed(ctl._pop);
    }

    function enhance(sel) {
      const control = sel.closest('.control');
      if (!control || sel.classList.contains('cs-native')) return;  // já convertido

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

      /* bandeira opcional: `data-flag` na <option> traz a linha da sprite
         (assets/flags/sprite.webp). Usado nos indicativos telefónicos — em
         emoji o Windows mostrava só as letras do país. */
      function flagFor(opt) {
        if (!opt || !opt.dataset || opt.dataset.flag == null) return null;
        const fl = document.createElement('span');
        fl.className = 'cs-flag';
        fl.style.backgroundPosition = '0 -' + (Number(opt.dataset.flag) * 15) + 'px';
        return fl;
      }
      /* a caixa fechada mostra a bandeira do que está escolhido */
      function paintFlag(opt) {
        const old = control.querySelector(':scope > .cs-flag');
        if (old) old.remove();
        const fl = flagFor(opt);
        if (fl) control.insertBefore(fl, control.firstChild);
      }

      const items = [];
      /* as opções são reconstruídas quando o <select> muda de conteúdo (o nº de
         hóspedes depende da casa escolhida, os indicativos mudam de idioma) */
      function buildItems() {
        items.length = 0;
        pop.innerHTML = '';
        Array.prototype.forEach.call(sel.options, (opt, i) => {
          if (opt.value === '') return; // ignora placeholder ("Selecione uma opção")
          const item = document.createElement('div');
          item.className = 'cs-opt';
          item.setAttribute('role', 'option');
          const fl = flagFor(opt);
          let txt = item;
          if (fl) {
            item.appendChild(fl);
            txt = document.createElement('span');
            item.appendChild(txt);
          }
          txt.textContent = opt.text;
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            sel.selectedIndex = i;
            /* data-short: a caixa fechada pode mostrar uma etiqueta curta (o
               indicativo "+351") enquanto a lista mostra o nome do país */
            value.textContent = opt.dataset.short || opt.text;
            paintFlag(opt);
            items.forEach((x) => { x.el.classList.remove('sel'); x.el.setAttribute('aria-selected', 'false'); });
            item.classList.add('sel');
            item.setAttribute('aria-selected', 'true');
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            closeOpen();
          });
          pop.appendChild(item);
          items.push({ el: item, txt: txt, idx: i, opt: opt });
        });
      }
      buildItems();
      control.appendChild(pop);

      function sync() {
        const cur = sel.options[sel.selectedIndex];
        value.textContent = cur ? (cur.dataset.short || cur.text) : '';
        paintFlag(cur);
        items.forEach((x) => {
          x.txt.textContent = x.opt.text;   /* não é o item todo: a bandeira ficava apagada */
          const on = x.idx === sel.selectedIndex;
          x.el.classList.toggle('sel', on);
          x.el.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
      sync();
      syncers.push(sync);
      /* mexer no <select> por JS não actualiza sozinho o popover personalizado */
      sel._ccRefresh = function () { buildItems(); sync(); };

      /* mesma colocação do calendário — e reposiciona enquanto está aberto */
      const place = function () { ccPop.place(control, pop); };
      const host = control.closest('.hero-wrap') || control.closest('.bk-card');
      control._place = place;
      control._host = host;

      function toggleOpen(e) {
        e.stopPropagation();
        const willOpen = pop.hidden;
        closeOpen();
        if (willOpen) {
          pop.hidden = false;
          control.setAttribute('aria-expanded', 'true');
          openCtl = control;
          /* fechar o popover anterior primeiro: partilha o mesmo host e o
             close() dele tirava o .pop-open que acabámos de pôr */
          ccPop.opened({ pop: pop, close: closeOpen });
          if (host) host.classList.add('pop-open');
          place(); requestAnimationFrame(place);
          window.addEventListener('scroll', place, { passive: true });
          window.addEventListener('resize', place);
        }
      }
      control.addEventListener('click', toggleOpen);
      control.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(e); }
        else if (e.key === 'Escape') closeOpen();
      });
      pop.addEventListener('click', (e) => e.stopPropagation());
    }

    /* também para campos criados depois do load, senão esses ficavam com o
       <select> nativo — que abre um popup do sistema, com outro aspeto e por
       cima do header */
    function enhanceAll(root) {
      (root || document).querySelectorAll('.control select').forEach(enhance);
    }
    ccPop.enhanceSelects = enhanceAll;
    ccPop.refreshSelect = (sel) => { if (sel && sel._ccRefresh) sel._ccRefresh(); };
    enhanceAll();

    document.addEventListener('click', (e) => { if (openCtl && !openCtl.contains(e.target)) closeOpen(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOpen(); });
    window.addEventListener('langchange', () => syncers.forEach((f) => f()));
  })();

  /* ============================================================
     Hóspedes limitados pela casa escolhida.
     A Tempo & Amor recebe 2 e a Colorida 4 — o widget do hero oferecia
     sempre até 5, ou seja, dava para pedir uma estadia que nenhuma das
     casas consegue dar. O nº de opções passa a seguir a casa, aqui e no
     formulário das páginas das casas (onde também se pode trocar de casa).
     ============================================================ */
  const HOUSE_CAP = { tempo: 2, colorida: 4 };

  function capOf(houseSel) {
    if (!houseSel) return HOUSE_CAP.colorida;
    const opt = houseSel.options[houseSel.selectedIndex];
    const txt = opt ? opt.text : '';
    return HOUSE_CAP[/colorida/i.test(txt) ? 'colorida' : 'tempo'];
  }

  /* deixa o <select> de hóspedes com 1..cap, mantendo a escolha quando cabe
     (5 hóspedes numa casa de 4 passa a 4, não volta a 1) */
  const syncGuests = window.ccSyncGuests = function (houseSel, guestsSel) {
    if (!guestsSel) return;
    const cap = capOf(houseSel);
    const want = Math.min(Math.max(parseInt(guestsSel.value, 10) || 1, 1), cap);
    if (guestsSel.options.length !== cap) {
      guestsSel.innerHTML = '';
      for (let n = 1; n <= cap; n++) {
        const o = document.createElement('option');
        o.value = String(n);
        o.textContent = String(n);
        guestsSel.appendChild(o);
      }
    }
    guestsSel.value = String(want);
    if (ccPop.refreshSelect) ccPop.refreshSelect(guestsSel);
  };

  /* widget do hero e formulário das casas — os ids são os que existem em cada página */
  [['heroHouse', 'heroGuests'], ['cfHouse', 'cfGuests']].forEach((pair) => {
    const houseSel  = document.getElementById(pair[0]);
    const guestsSel = document.getElementById(pair[1]);
    if (!houseSel || !guestsSel) return;
    syncGuests(houseSel, guestsSel);
    houseSel.addEventListener('change', () => syncGuests(houseSel, guestsSel));
  });
})();
