/* AXIS additions: LinkedIn Insight Tag, CRM lead capture, WhatsApp. Keeps ChatGPT's design untouched. */
(function () {
  'use strict';
  var WA_PHONE = '97236018282';
  var LI_PARTNER_ID = '11132201';
  var LI_CONVERSION_ID = 31911553;
  var CRM_BASE = 'https://crm.axisdigital.co.il/api/public/forms/';
  var CRM_FORM_KEY = 'nGnrMhsBRevqKwfnNPY_9L91';

  // ---- LinkedIn Insight Tag ----
  window._linkedin_partner_id = LI_PARTNER_ID;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(LI_PARTNER_ID);
  (function (l) {
    if (!l) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); }; window.lintrk.q = []; }
    var s = document.getElementsByTagName('script')[0];
    var b = document.createElement('script');
    b.async = true; b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    s.parentNode.insertBefore(b, s);
  })(window.lintrk);
  function liConvert() { try { if (window.lintrk) window.lintrk('track', { conversion_id: LI_CONVERSION_ID }); } catch (e) {} }

  // ---- helpers ----
  function cookie(n) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function clickParams() {
    var q = new URLSearchParams(location.search), out = {};
    ['li_fat_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
      var v = q.get(k); if (v) out[k] = v;
    });
    if (!out.li_fat_id) { var c = cookie('li_fat_id'); if (c) out.li_fat_id = c; }
    return out;
  }
  function waUrl(text) {
    return 'https://api.whatsapp.com/send/?phone=' + WA_PHONE + '&text=' + encodeURIComponent(text) + '&type=phone_number&app_absent=0';
  }
  function sendToCrm(name, phone) {
    var values = { name: name, phone: phone };
    try {
      fetch(CRM_BASE + CRM_FORM_KEY + '/submit', {
        method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: values, website: '', context: { pageUrl: location.href, params: clickParams() } })
      }).catch(function () {});
    } catch (e) {}
  }

  // ---- event form: CRM + WhatsApp with the full request ----
  var form = document.getElementById('eventForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var g = function (k) { return String(d.get(k) || '').trim(); };
      var name = g('name'), company = g('company'), phone = g('phone');
      if (!/^[0-9+\-\s()]{9,16}$/.test(phone)) { form.elements.phone.setCustomValidity('נא לכתוב מספר טלפון תקין'); form.reportValidity(); form.elements.phone.setCustomValidity(''); return; }
      var text = ['היי אנרג\'וסר! נשמח לקבל הצעה לאירוע חברה 🌿', '',
        'שם: ' + name, 'חברה: ' + company, 'טלפון לחזרה: ' + phone,
        'כמות משתתפים: ' + g('guests'), 'סוג האירוע: ' + g('occasion')]
        .concat(g('notes') ? ['פרטים נוספים: ' + g('notes')] : []).join('\n');
      liConvert();
      sendToCrm(name + (company ? ' (' + company + ')' : ''), phone);
      var u = waUrl(text);
      if (!window.open(u, '_blank', 'noopener')) location.href = u;
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם. אפשר להמשיך גם בוואטסאפ.';
    }, true);
    var note = form.querySelector('.form-note');
    if (note) note.textContent = 'משאירים פרטים ונחזור אליכם בהקדם, גם בוואטסאפ.';
    var btn = form.querySelector('.form-submit');
    if (btn) btn.firstChild.textContent = 'שלחו לי הצעה ';
  }

  // ---- floating WhatsApp button ----
  var fab = document.createElement('a');
  fab.className = 'wa-fab'; fab.target = '_blank'; fab.rel = 'noopener';
  fab.setAttribute('aria-label', 'שלחו לנו הודעה בוואטסאפ');
  fab.href = waUrl('היי אנרג\'וסר, אשמח לקבל פרטים על אירוע חברה.');
  fab.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 1.9 6.600L3 29l7.100-2.100A12.800 12.800 0 0 0 16 28c7 0 12.700-5.600 12.700-12.500S23 3 16 3Zm0 23c-2 0-3.900-.6-5.500-1.600l-.4-.2-4.200 1.200 1.300-4-.3-.4a10.200 10.200 0 0 1-1.600-5.500C5.300 9.900 10.100 5.400 16 5.400s10.700 4.500 10.700 10.100S21.900 26 16 26Zm5.900-7.600c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.200-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-1.900-.9-3.100-1.700-4.300-3.700-.3-.5.300-.5.900-1.600.1-.2.100-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.400 5.300 4.700 2 .8 2.700.9 3.700.7.600-.1 1.900-.8 2.100-1.500.3-.7.300-1.400.2-1.500-.1-.2-.3-.3-.6-.4Z"/></svg>';
  fab.addEventListener('click', liConvert);
  document.body.appendChild(fab);

  // header CTA / any explicit WhatsApp links also count as conversions
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"],a[href*="whatsapp.com"]');
    if (a && a !== fab) liConvert();
  });
})();
