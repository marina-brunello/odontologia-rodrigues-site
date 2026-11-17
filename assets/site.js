(function () {
  var CFG = window.RODRIGUES_TRACKING || {};
  var KEY = 'rodrigues-cookies';

  /* cabecalho e menu */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* mapa do Google: so carrega depois do clique */
  document.querySelectorAll('.map-load').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.parentNode;
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-src');
      f.title = box.getAttribute('data-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      box.replaceChild(f, b);
    });
  });

  /* tag do Google, carregada somente depois do aceite */
  function loadTag() {
    if (window.__tagLoaded) return;
    window.dataLayer = window.dataLayer || [];
    if (CFG.gtmId) {
      window.__tagLoaded = true;
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CFG.gtmId);
      document.head.appendChild(g);
      return;
    }
    if (!CFG.gtagId) return;
    window.__tagLoaded = true;
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.gtagId);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', CFG.gtagId);
    if (CFG.adsId && CFG.adsId !== CFG.gtagId) window.gtag('config', CFG.adsId);
  }

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var banner = document.getElementById('cookie-banner');
  if (CFG.gtmId || CFG.gtagId) {
    var choice = getChoice();
    if (choice === 'aceitar') {
      loadTag();
    } else if (!choice && banner) {
      banner.hidden = false;
    }
    if (banner) {
      banner.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-cookie]');
        if (!btn) return;
        var v = btn.getAttribute('data-cookie');
        setChoice(v);
        banner.hidden = true;
        if (v === 'aceitar') loadTag();
      });
    }
  }

  /* origem do contato (site ou Google Ads), enviada ao Analytics e nao na mensagem */
  function origemDoContato() {
    var o = null;
    try { o = sessionStorage.getItem('rodrigues-origem'); } catch (e) {}
    if (!o) {
      var q = location.search;
      o = (/[?&](gclid|gbraid|wbraid)=/.test(q) || /utm_source=google/i.test(q)) ? 'Google Ads' : 'site';
      try { sessionStorage.setItem('rodrigues-origem', o); } catch (e) {}
    }
    return o;
  }
  var pagina = (document.title || '').split('|')[0].trim() || 'Início';
  var origem = origemDoContato();

  /* conversao: clique em qualquer link do WhatsApp */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    if (CFG.gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'whatsapp_click', link_url: a.href, origem: origem, pagina: pagina });
      return;
    }
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'whatsapp_click', { link_url: a.href, origem: origem, pagina: pagina });
    if (CFG.adsId && CFG.whatsappConversionLabel) {
      window.gtag('event', 'conversion', { send_to: CFG.adsId + '/' + CFG.whatsappConversionLabel, value: 1.0, currency: 'BRL' });
    }
  });
})();
