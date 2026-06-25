/* ============================================================
   i18n — troca de idioma PT/EN em runtime (site estático)
   - Dicionário único (pt/en). Default: língua do browser → senão PT.
   - Escolha guardada em localStorage ('cc_lang') e partilhada entre páginas.
   - [data-i18n]       → textContent
   - [data-i18n-html]  → innerHTML (apenas strings do dicionário, confiáveis)
   - [data-i18n-attr]  → atributos, formato "attr:chave;attr2:chave2"
   - window.t(chave) / window.ccLang / evento 'langchange' para o JS dinâmico
   ============================================================ */
(function () {
  var I18N = {
    pt: {
      _months: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
      _dows:   ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],

      /* partilhado */
      'skip': 'Saltar para o conteúdo',
      'nav.tempo': 'Tempo & Amor',
      'nav.colorida': 'Casa Colorida',
      'nav.local': 'Local',
      'nav.reservar': 'Reservar →',
      'menu.open': 'Abrir menu',
      'home.aria': 'Casa Colorida e Tempo & Amor — Início',
      'lang.aria': 'Idioma / Language',
      'foot.powered': 'Desenvolvido por',
      'foot.privacidade': 'Privacidade',

      /* index — hero / widget */
      'page.title.index': 'Casa Colorida & Tempo & Amor · Vila do Bispo',
      'dates.label': 'Entrada / Saída',
      'dates.placeholder': 'Escolher datas',
      'guests.label': 'Nº de hóspedes',
      'house.label': 'Casa pretendida',
      'baby.t': 'Extras de bebé',
      'baby.s': 'Cadeira alta e berço disponíveis.',
      'pet.t': 'Extras para animais (20€ adicional)',
      'pet.s': 'Cama e taças disponíveis.',
      'pet.s.short': 'Cama e taças disponíveis.',
      'hero.book': 'RESERVAR',
      'cue.aria': 'Descer',
      'cal.prev': 'Mês anterior',
      'cal.next': 'Mês seguinte',

      /* index — welcome */
      'welcome.kicker': 'bem-vindos',
      'welcome.title': 'abrande, sinta-se em casa',
      'welcome.p': 'Sinta-se em casa connosco e descubra duas casas acolhedoras e típicas em Vila do Bispo.<span class="br"></span>Cada espaço foi preparado com cuidado para oferecer conforto, privacidade e uma experiência genuína do sudoeste algarvio.',

      /* index — casas */
      'house.tempo.kicker': 'um quarto',
      'house.tempo.body': 'Um refúgio tranquilo para abrandar.\nPensado para quem valoriza a simplicidade, o conforto e momentos de verdadeira desconexão.',
      'house.colorida.kicker': 'dois quartos',
      'house.colorida.body': 'Um espaço para reunir, relaxar e criar memórias.\nIdeal para quem procura juntar-se para uma estadia tranquila e perto da natureza.',
      'house.reserve': 'RESERVAR',
      'house.tempo.alt': 'Casa Tempo & Amor',
      'house.colorida.alt': 'Casa Colorida',

      /* index — discover */
      'discover.title': 'Descobrir',
      'discover.body': 'Descubra praias, restaurantes, cafés e experiências que fazem parte do dia a dia da nossa região.',
      'collection.body': 'Uma coleção de lugares, experiências e pequenos momentos que tornam a nossa região tão acolhedora e típica.',

      /* index — FAQ */
      'faq.q1': 'Como faço uma reserva?',
      'faq.a1': 'Escolha as datas no formulário de reserva, indique o número de hóspedes e a casa pretendida e envie o pedido. Respondemos por email ou telefone com a disponibilidade e os próximos passos.',
      'faq.q2': 'Qual é a estadia mínima?',
      'faq.a2': 'É exigido um mínimo de 3 noites por reserva.',
      'faq.q3': 'Os animais são permitidos?',
      'faq.a3': 'Sim — os animais são bem-vindos, com um custo adicional de 20€. Disponibilizamos cama e taças.',
      'faq.q4': 'Quais são os horários de entrada e saída?',
      'faq.a4': 'Entrada a partir das 15h, saída até às 11h.',
      'faq.q5': 'Existe cancelamento gratuito?',
      'faq.a5': 'Cancelamento gratuito até 7 dias antes da chegada.',

      /* booking */
      'page.title.booking': 'Pedido de Reserva · Casa Colorida · Tempo & Amor',
      'bk.eyebrow': 'falta pouco',
      'bk.title': 'a sua escapadela no Algarve\ncomeça aqui',
      'bk.stay.h': 'A sua estadia',
      'bk.stay.legend': 'Diga-nos a estadia que tem em mente\npara verificarmos a disponibilidade.',
      'bk.dates.sub': '*mínimo 3 noites',
      'bk.details.h': 'Os seus dados',
      'bk.details.legend': 'Deixe o seu contacto e responderemos para confirmar a reserva.',
      'bk.name': 'Nome completo',
      'bk.email': 'Email',
      'bk.phone': 'Telefone',
      'bk.phone.sub': 'Inclua o indicativo do país (ex.: +351)',
      'bk.nif': 'NIF ',
      'bk.nif.opt': '(opcional)',
      'bk.source': 'Como soube de nós?',
      'bk.source.opt0': 'Selecione uma opção',
      'bk.source.friends': 'Amigos e família',
      'bk.source.other': 'Outro',
      'bk.note': 'Sem pagamento agora — ligamos ou respondemos por email com a disponibilidade e os próximos passos.',
      'bk.help': 'Precisa de ajuda?',
      'bk.consent': 'Autorizo o tratamento dos meus dados para responder a este pedido de reserva, nos termos da <a href="privacidade.html" style="color:var(--sage-deep);text-decoration:underline;text-underline-offset:2px">Política de Privacidade</a>.',
      'bk.submit': 'Verificar disponibilidade',
      'bk.submit.sending': 'A enviar…',
      'bk.ssl.b': 'A sua privacidade',
      'bk.ssl.t': 'Usamos os seus dados apenas para responder sobre a sua estadia.',
      'bk.success.h': 'pedido enviado',
      'bk.success.p': 'Obrigado! O seu pedido de reserva está a caminho da Andrea e do Mató. Respondemos por email assim que verificarmos a disponibilidade.',
      'bk.success.back': 'VOLTAR AO INÍCIO',
      'bk.sum.name': 'Nome',
      'bk.sum.dates': 'Datas',
      'bk.sum.house': 'Casa',
      'bk.sum.guests': 'Hóspedes',
      'bk.sum.extras': 'Extras',
      'bk.sum.email': 'Resposta para',
      'bk.guest': 'hóspede',
      'bk.guests.plural': 'hóspedes',
      'bk.extra.baby': 'Extras de bebé',
      'bk.extra.pet': 'Extras para animais (+20€)',
      'bk.alert.cooldown': 'Acabou de enviar um pedido. Aguarde um momento antes de enviar de novo.',
      'bk.alert.error': 'Não foi possível enviar o pedido ({err}). Tente novamente ou contacte-nos por telefone.',

      /* privacidade */
      'page.title.priv': 'Política de Privacidade · Casa Colorida · Tempo & Amor',
      'priv.back.top': '← Voltar ao pedido de reserva',
      'priv.h1': 'política de privacidade',
      'priv.updated': 'Última atualização: 17 de junho de 2026',
      'priv.intro': 'Esta política explica como tratamos os dados pessoais recolhidos através do formulário de pedido de reserva deste site, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).',
      'priv.h2.1': '1. Responsável pelo tratamento',
      'priv.p.1': 'As casas <strong>Casa Colorida</strong> e <strong>Tempo &amp; Amor</strong>, em Vila do Bispo (Algarve), geridas por Andrea e Mató. Site mantido por <a href="https://reddunesolutions.pt" target="_blank" rel="noopener noreferrer" class="reddune-link">RedDune Solutions</a>.<br>Contacto: <a href="mailto:reddunesolutions@gmail.com">reddunesolutions@gmail.com</a> · Andrea (+351) 967 443 791 · Mató (+351) 961 470 100.',
      'priv.h2.2': '2. Que dados recolhemos',
      'priv.li.1': 'Nome completo, email e telefone (obrigatórios para podermos responder);',
      'priv.li.2': 'NIF (opcional);',
      'priv.li.3': 'Detalhes do pedido: datas, número de hóspedes, casa pretendida, extras (bebé/animal) e como soube de nós.',
      'priv.h2.3': '3. Finalidade e base legal',
      'priv.p.3': 'Os dados são usados <strong>exclusivamente</strong> para responder ao seu pedido de reserva e verificar disponibilidade. A base legal é o seu <strong>consentimento</strong> e as <strong>diligências pré-contratuais</strong> a seu pedido. Não fazemos marketing nem partilha com terceiros para esse fim.',
      'priv.h2.4': '4. Como são enviados',
      'priv.p.4': 'O formulário é processado pelo serviço <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">Web3Forms</a>, que reencaminha a submissão por email para os responsáveis. A ligação é cifrada (HTTPS).',
      'priv.h2.5': '5. Conservação',
      'priv.p.5': 'Guardamos os dados apenas o tempo necessário para tratar o pedido e a eventual estadia. Pode pedir a eliminação a qualquer momento.',
      'priv.h2.6': '6. Os seus direitos',
      'priv.p.6': 'Tem direito de aceder, retificar, eliminar, limitar ou opor-se ao tratamento dos seus dados, e de retirar o consentimento. Para exercer, contacte-nos pelos meios acima. Tem ainda o direito de apresentar reclamação à <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">CNPD</a>.',
      'priv.back': '← Voltar ao pedido de reserva'
    },

    en: {
      _months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      _dows:   ['Mo','Tu','We','Th','Fr','Sa','Su'],

      'skip': 'Skip to content',
      'nav.tempo': 'Tempo & Amor',
      'nav.colorida': 'Casa Colorida',
      'nav.local': 'Area',
      'nav.reservar': 'Book →',
      'menu.open': 'Open menu',
      'home.aria': 'Casa Colorida & Tempo & Amor — Home',
      'lang.aria': 'Idioma / Language',
      'foot.powered': 'Built by',
      'foot.privacidade': 'Privacy',

      'page.title.index': 'Casa Colorida & Tempo & Amor · Vila do Bispo',
      'dates.label': 'Check-In / Check-Out',
      'dates.placeholder': 'Choose dates',
      'guests.label': 'Guests Number',
      'house.label': 'Requested House',
      'baby.t': 'Baby Extras',
      'baby.s': 'High chair & baby cot available.',
      'pet.t': 'Pet Extras (20€ extra cost)',
      'pet.s': 'Pet bed & food bowls available.',
      'pet.s.short': 'Bed & food bowls available.',
      'hero.book': 'BOOK NOW',
      'cue.aria': 'Scroll down',
      'cal.prev': 'Previous month',
      'cal.next': 'Next month',

      'welcome.kicker': 'welcome',
      'welcome.title': 'stay slow, feel at home',
      'welcome.p': 'Feel at home with us and discover two cozy and typical houses in Vila do Bispo.<span class="br"></span>Each space has been carefully prepared to offer comfort, privacy, and a genuine experience of the southwest Algarve.',

      'house.tempo.kicker': 'one bedroom',
      'house.tempo.body': 'A peaceful retreat to slow down.\nDesigned for those who value simplicity, comfort, and moments of true disconnection.',
      'house.colorida.kicker': 'two bedroom',
      'house.colorida.body': 'A space to gather, relax, and create memories.\nIdeal for those looking to gather around for a relaxing stay close to nature.',
      'house.reserve': 'RESERVE NOW',
      'house.tempo.alt': 'Tempo & Amor house',
      'house.colorida.alt': 'Casa Colorida house',

      'discover.title': 'Discover',
      'discover.body': 'Discover beaches, restaurants, cafes, and experiences that are part of everyday life in our region.',
      'collection.body': 'A collection of places, experiences and small moments that make our region so welcoming and typical.',

      'faq.q1': 'How do I book a stay?',
      'faq.a1': 'Pick your dates in the booking form, tell us the number of guests and the house you want, and send the request. We’ll reply by email or phone with availability and the next steps.',
      'faq.q2': 'What is the minimum stay?',
      'faq.a2': 'A minimum of 3 nights is required for every reservation.',
      'faq.q3': 'Are pets allowed?',
      'faq.a3': 'Yes — pets are welcome with a 20€ extra cost. Bed & food bowls are available.',
      'faq.q4': 'What are the check-in and check-out times?',
      'faq.a4': 'Check-in from 3 PM, check-out until 11 AM.',
      'faq.q5': 'Is there free cancellation?',
      'faq.a5': 'Free cancellation up to 7 days before your arrival.',

      'page.title.booking': 'Booking Request · Casa Colorida · Tempo & Amor',
      'bk.eyebrow': 'you’re almost here',
      'bk.title': 'your Algarve escape\nstarts here',
      'bk.stay.h': 'Your Stay',
      'bk.stay.legend': 'Tell us about the stay you have in mind\nso we can check availability for you.',
      'bk.dates.sub': '*3 nights minimum',
      'bk.details.h': 'Your Details',
      'bk.details.legend': 'Leave your contact and we’ll get back to you to confirm your reservation.',
      'bk.name': 'Full Name',
      'bk.email': 'Email',
      'bk.phone': 'Phone Number',
      'bk.phone.sub': 'Include country code (e.g. +351)',
      'bk.nif': 'NIF ',
      'bk.nif.opt': '(optional)',
      'bk.source': 'How did you hear about us?',
      'bk.source.opt0': 'Select an option',
      'bk.source.friends': 'Friends & Family',
      'bk.source.other': 'Other',
      'bk.note': 'No payment now — we’ll call you or reply by email with availability and the next steps.',
      'bk.help': 'Need help?',
      'bk.consent': 'I authorise the processing of my data to reply to this booking request, under the <a href="privacidade.html" style="color:var(--sage-deep);text-decoration:underline;text-underline-offset:2px">Privacy Policy</a>.',
      'bk.submit': 'Check Availability',
      'bk.submit.sending': 'Sending…',
      'bk.ssl.b': 'Your privacy',
      'bk.ssl.t': 'We’ll only use your details to reply about your stay.',
      'bk.success.h': 'request sent',
      'bk.success.p': 'Thank you! Your booking request is on its way to Andrea & Mató. We’ll get back to you by email as soon as we’ve checked availability.',
      'bk.success.back': 'BACK TO HOME',
      'bk.sum.name': 'Name',
      'bk.sum.dates': 'Dates',
      'bk.sum.house': 'House',
      'bk.sum.guests': 'Guests',
      'bk.sum.extras': 'Extras',
      'bk.sum.email': 'Reply to',
      'bk.guest': 'guest',
      'bk.guests.plural': 'guests',
      'bk.extra.baby': 'Baby extras',
      'bk.extra.pet': 'Pet extras (+20€)',
      'bk.alert.cooldown': 'You’ve just sent a request. Please wait a moment before sending again.',
      'bk.alert.error': 'We couldn’t send your request ({err}). Please try again or contact us by phone.',

      'page.title.priv': 'Privacy Policy · Casa Colorida · Tempo & Amor',
      'priv.back.top': '← Back to booking request',
      'priv.h1': 'privacy policy',
      'priv.updated': 'Last updated: 17 June 2026',
      'priv.intro': 'This policy explains how we handle the personal data collected through the booking request form on this site, in line with the General Data Protection Regulation (GDPR).',
      'priv.h2.1': '1. Data controller',
      'priv.p.1': 'The houses <strong>Casa Colorida</strong> and <strong>Tempo &amp; Amor</strong>, in Vila do Bispo (Algarve), run by Andrea and Mató. Site maintained by <a href="https://reddunesolutions.pt" target="_blank" rel="noopener noreferrer" class="reddune-link">RedDune Solutions</a>.<br>Contact: <a href="mailto:reddunesolutions@gmail.com">reddunesolutions@gmail.com</a> · Andrea (+351) 967 443 791 · Mató (+351) 961 470 100.',
      'priv.h2.2': '2. What data we collect',
      'priv.li.1': 'Full name, email and phone (required so we can reply);',
      'priv.li.2': 'Tax number / NIF (optional);',
      'priv.li.3': 'Request details: dates, number of guests, requested house, extras (baby/pet) and how you heard about us.',
      'priv.h2.3': '3. Purpose and legal basis',
      'priv.p.3': 'The data is used <strong>solely</strong> to reply to your booking request and check availability. The legal basis is your <strong>consent</strong> and the <strong>pre-contractual steps</strong> taken at your request. We do not do marketing or share data with third parties for that purpose.',
      'priv.h2.4': '4. How it is sent',
      'priv.p.4': 'The form is processed by the <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">Web3Forms</a> service, which forwards the submission by email to the owners. The connection is encrypted (HTTPS).',
      'priv.h2.5': '5. Retention',
      'priv.p.5': 'We keep the data only for as long as needed to handle the request and any stay. You may request deletion at any time.',
      'priv.h2.6': '6. Your rights',
      'priv.p.6': 'You have the right to access, rectify, erase, restrict or object to the processing of your data, and to withdraw consent. To exercise these, contact us via the means above. You also have the right to lodge a complaint with the Portuguese DPA (<a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">CNPD</a>).',
      'priv.back': '← Back to booking request'
    }
  };

  function pick() {
    var saved = null;
    try { saved = localStorage.getItem('cc_lang'); } catch (e) {}
    if (saved === 'pt' || saved === 'en') return saved;
    var nav = (navigator.language || navigator.userLanguage || 'pt').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  var lang = pick();

  function t(key) {
    var d = I18N[lang] || I18N.pt;
    return (key in d) ? d[key] : (I18N.pt[key] != null ? I18N.pt[key] : key);
  }

  function apply(l) {
    lang = (l === 'en') ? 'en' : 'pt';
    window.ccLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    try { localStorage.setItem('cc_lang', lang); } catch (e) {}

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 0) return;
        var attr = pair.slice(0, i).trim();
        var v = t(pair.slice(i + 1).trim());
        if (v != null) el.setAttribute(attr, v);
      });
    });

    document.querySelectorAll('[data-setlang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === lang ? 'true' : 'false');
    });

    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  /* API pública para o JS dinâmico (calendário, formulário) */
  window.ccLang = lang;
  window.t = t;
  window.ccMonths = function () { return (I18N[lang] || I18N.pt)._months; };
  window.ccDows = function () { return (I18N[lang] || I18N.pt)._dows; };
  window.setLang = apply;

  function init() {
    document.querySelectorAll('[data-setlang]').forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-setlang')); });
    });
    apply(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
