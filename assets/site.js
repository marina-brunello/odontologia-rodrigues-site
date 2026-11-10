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

  /* tag do Google, carregada somente depois do aceite */
  function loadTag() {
    if (!CFG.gtagId || window.__tagLoaded) return;
    window.__tagLoaded = true;
    window.dataLayer = window.dataLayer || [];
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
  if (CFG.gtagId) {
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

  /* conversao: clique em qualquer link do WhatsApp */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (!a || typeof window.gtag !== 'function') return;
    window.gtag('event', 'whatsapp_click', { link_url: a.href });
    if (CFG.adsId && CFG.whatsappConversionLabel) {
      window.gtag('event', 'conversion', { send_to: CFG.adsId + '/' + CFG.whatsappConversionLabel });
    }
  });
})();
