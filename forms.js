(function () {
  'use strict';
  var form = document.getElementById('contactForm');
  if (!form) return;
  var en = document.documentElement.lang === 'en';
  var button = form.querySelector('.form-submit');
  var originalLabel = button.textContent;
  var status = document.getElementById('form-status');
  var busy = false;
  var product = form.querySelector('[name="produit"]');
  var initialProduct = product.value;
  var language = form.querySelector('[name="_language"]');
  if (language) language.value = en ? 'en' : 'fr';

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    if (form.querySelector('[name="_gotcha"]').value) return;
    busy = true;
    button.disabled = true;
    button.textContent = en ? 'Sending…' : 'Envoi en cours…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    status.className = 'form-status';
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 30000);
    try {
      var response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('submission_failed');
      var confirmation = await response.json();
      if (confirmation.ok !== true) throw new Error('unconfirmed_submission');
      // Only a confirmed Formspree success counts as a lead, once per submission.
      // The product value is a fixed catalogue code; no identity or free text is tracked.
      if (typeof window.astTrack === 'function') window.astTrack('generate_lead', { form_id: 'contactForm', product: product.value, language: en ? 'en' : 'fr', page_path: location.pathname });
      form.reset();
      product.value = initialProduct;
      status.textContent = en ? 'Your request has been sent. Our team will get back to you.' : 'Votre demande a été envoyée. Notre équipe vous recontactera.';
      status.classList.add('is-success');
    } catch (error) {
      status.textContent = error.name === 'AbortError'
        ? (en ? 'The confirmation took too long. Your request may have been received. Please contact contact@ast-trade.com before sending it again.' : 'La confirmation tarde à arriver. Votre demande a peut-être été reçue. Contactez contact@ast-trade.com avant de la renvoyer.')
        : (en ? 'We could not confirm delivery. Your details have been kept. Please try again or contact contact@ast-trade.com.' : 'L’envoi n’a pas pu être confirmé. Vos informations sont conservées. Réessayez ou contactez contact@ast-trade.com.');
      status.classList.add('is-error');
      if (typeof window.astTrack === 'function') window.astTrack('quote_submit_error', { form_id: 'contactForm', language: en ? 'en' : 'fr' });
    } finally {
      clearTimeout(timeout);
      busy = false;
      button.disabled = false;
      button.textContent = originalLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
