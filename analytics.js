/* Analytics loads only after consent. No form contents are sent to Google. */
(function () {
  'use strict';
  var measurementId = 'G-KJX42G51Q4';
  var choiceKey = 'ast-cookie-consent';
  var dateKey = 'ast-cookie-consent-at';
  var maxAge = 180 * 24 * 60 * 60 * 1000;
  var consent = null;
  var loaded = false;
  var returnFocus = null;
  var en = document.documentElement.lang === 'en';

  try {
    var stored = localStorage.getItem(choiceKey);
    var savedAt = Number(localStorage.getItem(dateKey));
    if ((stored === 'granted' || stored === 'denied') && savedAt > 0 && Date.now() - savedAt < maxAge) consent = stored;
  } catch (error) { /* The banner also works when storage is unavailable. */ }

  function startAnalytics() {
    window['ga-disable-' + measurementId] = false;
    if (loaded) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    // Avoid sending contact information someone may have put in a query string.
    window.gtag('config', measurementId, { page_location: location.origin + location.pathname, allow_google_signals: false, allow_ad_personalization_signals: false });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    tag.id = 'ast-google-tag';
    document.head.appendChild(tag);
  }

  function removeAnalyticsCookies() {
    var domains = ['', location.hostname, '.' + location.hostname];
    if (location.hostname === 'www.ast-trade.com') domains.push('ast-trade.com', '.ast-trade.com');
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (!/^(_ga(?:_|$)|_gid$|_gat)/.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }

  function choose(value) {
    consent = value;
    try {
      localStorage.setItem(choiceKey, value);
      localStorage.setItem(dateKey, String(Date.now()));
    } catch (error) { /* Keep the current choice in memory for this page. */ }
    if (value === 'granted') startAnalytics();
    else {
      window['ga-disable-' + measurementId] = true;
      if (loaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      removeAnalyticsCookies();
    }
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.remove();
    if (returnFocus) returnFocus.focus();
  }

  function openPreferences(event) {
    if (event) event.preventDefault();
    var existing = document.getElementById('cookie-banner');
    if (existing) { existing.querySelector('button').focus(); return; }
    returnFocus = event ? event.currentTarget : null;
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', en ? 'Cookie preferences' : 'Préférences de cookies');
    banner.setAttribute('aria-describedby', 'cookie-description');
    banner.innerHTML = '<div class="cookie-banner-inner"><p class="cookie-banner-text" id="cookie-description">' +
      (en ? 'With your consent, Google Analytics measures visits to this site. You can refuse or change your choice at any time. <a href="/en/privacy-policy">Privacy policy</a>.' : 'Avec votre accord, Google Analytics mesure les visites de ce site. Vous pouvez refuser ou modifier votre choix à tout moment. <a href="/politique-confidentialite">Politique de confidentialité</a>.') +
      '</p><div class="cookie-banner-actions"><button type="button" class="cookie-btn cookie-btn-refuse" id="cookieRefuse">' + (en ? 'Refuse' : 'Refuser') + '</button><button type="button" class="cookie-btn cookie-btn-accept" id="cookieAccept">' + (en ? 'Accept' : 'Accepter') + '</button></div></div>';
    document.body.appendChild(banner);
    document.getElementById('cookieRefuse').addEventListener('click', function () { choose('denied'); });
    document.getElementById('cookieAccept').addEventListener('click', function () { choose('granted'); });
    if (event) document.getElementById('cookieRefuse').focus();
  }

  window.astTrack = function (eventName, parameters) {
    if (consent !== 'granted' || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, parameters);
  };
  document.querySelectorAll('[data-cookie-settings]').forEach(function (button) { button.addEventListener('click', openPreferences); });
  document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      window.astTrack(link.getAttribute('href').indexOf('tel:') === 0 ? 'contact_phone' : 'contact_email', { page_path: location.pathname, language: en ? 'en' : 'fr' });
    });
  });
  if (consent === 'granted') startAnalytics();
  else {
    window['ga-disable-' + measurementId] = true;
    removeAnalyticsCookies();
    if (!consent) openPreferences();
  }
})();
