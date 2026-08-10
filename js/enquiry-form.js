/* ═══════════════════════════════════════════════════════════
   JAY DURGA · Unified enquiry form
   ---------------------------------------------------------------
   Drop <div data-enquiry-form id="enquire"></div> on any page and
   this script renders the same form there.

   Per-page overrides (all optional):
     data-title   → replaces the H2
     data-lede    → replaces the intro paragraph (may contain <strong>)
     data-source  → hidden "source" field value (defaults to page path)

   Styles live in css/wireframe.css under "ENQUIRE · unified form".
   Backend: Google Apps Script — see GOOGLE-SHEETS-FORM-SETUP.md.
   To wire it live, set GAS_ENDPOINT_URL below to your deployed URL.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────
  // TODO · Replace with the deployed Apps Script Web App URL.
  var GAS_ENDPOINT_URL = 'GAS_ENDPOINT_URL';

  // ── Copy defaults ──────────────────────────────────────────
  var DEFAULT_TITLE = 'Tell us the window, the room, or the whole home.';
  var DEFAULT_LEDE  = 'Fill this in and we\'ll reply <strong>within the same working day</strong>. Or reach us directly — three ways, one team.';

  var PHONE_TEL     = '+917337332652';
  var PHONE_LABEL   = '+91 733 733 2652';
  var WHATSAPP_URL  = 'https://wa.me/917337332652?text=Hi%20Jay%20Durga%20%E2%80%94%20I\'d%20like%20to%20send%20a%20photo%20of%20my%20space%20and%20get%20a%20quick%20quote.';
  var MAPS_URL      = 'https://maps.google.com/?q=Jay+Durga+Furnishings+Ameerpet+Hyderabad';

  var INTERESTS = [
    'Curtains & Windows',
    'Sofa Fabrics & Cushioning',
    'Mattresses',
    'Carpets & Rugs',
    'Bedding',
    'Bath',
    'Décor & Accessories',
    'Complete home consultation',
    'Not sure yet'
  ];

  // ── Boot ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var mounts = document.querySelectorAll('[data-enquiry-form]');
    if (!mounts.length) return;
    Array.prototype.forEach.call(mounts, render);
  }

  // ── Render ─────────────────────────────────────────────────
  function render(mount, index) {
    if (mount.dataset.enquiryFormRendered === 'true') return;
    mount.dataset.enquiryFormRendered = 'true';

    var title  = mount.getAttribute('data-title')  || DEFAULT_TITLE;
    var lede   = mount.getAttribute('data-lede')   || DEFAULT_LEDE;
    var source = mount.getAttribute('data-source') || location.pathname.replace(/^\//, '') || 'homepage';

    // Build interest <option>s
    var options = '<option value="">Please choose</option>';
    for (var i = 0; i < INTERESTS.length; i++) {
      options += '<option>' + INTERESTS[i] + '</option>';
    }

    // Section markup mirrors the original index.html enquire block
    // so existing CSS + anchor links (#enquire) keep working.
    mount.classList.add('enquire', 'stack');
    mount.setAttribute('aria-label', 'Enquire');

    mount.innerHTML = [
      '<div class="enquire__intro">',
      '  <p class="eyebrow eyebrow--light">Enquire</p>',
      '  <h2>' + escapeHtml(title) + '</h2>',
      '  <p>' + lede + '</p>',
      '  <div class="enquire__ways">',
      '    <a class="enquire__way" href="tel:' + PHONE_TEL + '">',
      '      <span class="enquire__way-ic" aria-hidden="true">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5c0 8 7 15 15 15l2-3-4-2-2 2c-3-1-6-4-7-7l2-2-2-4-4 1Z" stroke-linejoin="round"/></svg>',
      '      </span>',
      '      <div>Call us<small>' + PHONE_LABEL + '</small></div>',
      '    </a>',
      '    <a class="enquire__way" href="' + WHATSAPP_URL + '" target="_blank" rel="noopener">',
      '      <span class="enquire__way-ic" aria-hidden="true">',
      '        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Zm5.5 12.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.9-.5-1.9-1-2.6-1.9-.7-.9-1.2-1.9-1.5-2.7-.1-.3 0-.5.1-.6.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.6-.9-2.1-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.8.4-.3.4-1.1 1.1-1.1 2.6 0 1.6 1.2 3.1 1.4 3.3.2.2 2.4 3.6 5.7 5.1.8.3 1.4.5 1.9.6.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"/></svg>',
      '      </span>',
      '      <div>WhatsApp us<small>Send a photo · quick reply</small></div>',
      '    </a>',
      '    <a class="enquire__way" href="' + MAPS_URL + '" target="_blank" rel="noopener">',
      '      <span class="enquire__way-ic" aria-hidden="true">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4"/></svg>',
      '      </span>',
      '      <div>Get directions<small>Ameerpet Main Road · Metro-side</small></div>',
      '    </a>',
      '  </div>',
      '</div>',
      '<form class="enquire__form" data-enquiry-form-el novalidate>',
      '  <div>',
      '    <label for="ef-name-' + index + '">Your name</label>',
      '    <input id="ef-name-' + index + '" name="name" type="text" required autocomplete="name" placeholder="Full name" />',
      '  </div>',
      '  <div class="enquire__row">',
      '    <div>',
      '      <label for="ef-phone-' + index + '">Phone</label>',
      '      <input id="ef-phone-' + index + '" name="phone" type="tel" required autocomplete="tel" placeholder="10-digit mobile" pattern="[0-9+\\s\\-()]{7,}" />',
      '    </div>',
      '    <div>',
      '      <label for="ef-area-' + index + '">Area</label>',
      '      <input id="ef-area-' + index + '" name="area" type="text" placeholder="e.g. Kondapur" />',
      '    </div>',
      '  </div>',
      '  <div>',
      '    <label for="ef-interest-' + index + '">I\'m looking for</label>',
      '    <select id="ef-interest-' + index + '" name="interest" required>' + options + '</select>',
      '  </div>',
      '  <div>',
      '    <label for="ef-notes-' + index + '">Anything else? (optional)</label>',
      '    <textarea id="ef-notes-' + index + '" name="notes" placeholder="Room, window count, preferred visit time..."></textarea>',
      '  </div>',
      '  <input type="hidden" name="source" value="' + escapeAttr(source) + '" />',
      '  <div class="honeypot" aria-hidden="true">',
      '    <label for="ef-website-' + index + '">Do not fill</label>',
      '    <input id="ef-website-' + index + '" name="_gotcha" type="text" tabindex="-1" autocomplete="off" />',
      '  </div>',
      '  <button class="enquire__submit" type="submit">',
      '    Send enquiry',
      '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '  </button>',
      '  <p class="enquire__status" role="status" aria-live="polite" data-form-status></p>',
      '</form>'
    ].join('\n');

    wire(mount);
  }

  // ── Wire submission ────────────────────────────────────────
  function wire(root) {
    var form   = root.querySelector('[data-enquiry-form-el]');
    var status = root.querySelector('[data-form-status]');
    var submit = root.querySelector('.enquire__submit');
    if (!form || !status || !submit) return;

    function setStatus(msg, kind) {
      status.textContent = msg;
      status.classList.remove('is-error', 'is-success');
      if (kind) status.classList.add('is-' + kind);
    }

    // If the endpoint isn't wired, submit via WhatsApp with form data pre-filled.
    if (GAS_ENDPOINT_URL === 'GAS_ENDPOINT_URL') {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var honey = form.querySelector('input[name="_gotcha"]');
        if (honey && honey.value) return;
        if (!form.checkValidity()) {
          setStatus('Please fill in your name, phone and what you\'re looking for.', 'error');
          form.reportValidity();
          return;
        }
        var name     = (form.querySelector('[name="name"]').value     || '').trim();
        var phone    = (form.querySelector('[name="phone"]').value    || '').trim();
        var area     = (form.querySelector('[name="area"]').value     || '').trim();
        var interest = (form.querySelector('[name="interest"]').value || '').trim();
        var notes    = (form.querySelector('[name="notes"]').value    || '').trim();
        var msg = 'Hi Jay Durga — I\'d like to enquire about: ' + (interest || 'furnishings') + '.'
          + (name    ? '\nName: '  + name    : '')
          + (phone   ? '\nPhone: ' + phone   : '')
          + (area    ? '\nArea: '  + area    : '')
          + (notes   ? '\nNotes: ' + notes   : '');
        window.open(WHATSAPP_URL.split('?')[0] + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        setStatus('Opening WhatsApp with your enquiry pre-filled — just hit send.', 'success');
        form.reset();
      });
      return;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot — silently succeed
      var honey = form.querySelector('input[name="_gotcha"]');
      if (honey && honey.value) {
        setStatus('Thanks — we\'ll be in touch.', 'success');
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        setStatus('Please fill in your name, phone and what you\'re looking for.', 'error');
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      data.append('submittedAt', new Date().toISOString());
      data.append('pageUrl', location.href);

      submit.disabled = true;
      setStatus('Sending...');

      fetch(GAS_ENDPOINT_URL, { method: 'POST', body: data })
        .then(function (r) { return r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)); })
        .then(function () {
          setStatus('Thanks — we\'ll reply within the same working day.', 'success');
          form.reset();
        })
        .catch(function () {
          setStatus('Something went wrong. Please WhatsApp or call us instead.', 'error');
        })
        .then(function () {
          submit.disabled = false;
        });
    });
  }

  // ── Helpers ────────────────────────────────────────────────
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;');
  }
})();
