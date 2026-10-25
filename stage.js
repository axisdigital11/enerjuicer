/* Hero: one long video scrubbed by scroll, snapping to each flavor. */
(function () {
  'use strict';
  var WA_PHONE = '97236018282';
  function boot() {
    if (!window.gsap || !window.ScrollTrigger) { return setTimeout(boot, 60); }
    gsap.registerPlugin(ScrollTrigger);
    var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
    var isMobile = window.matchMedia('(max-width: 760px)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var vid = $('#master'), pin = $('#stagePin'), uis = $$('.scene-ui'), dots = $$('#dots button'), data = $$('.still-data'), N = uis.length;
    var header = $('#siteHeader');
    var lenis = null;
    if (window.Lenis && !isMobile && !reduce) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    // wa buttons: open WhatsApp with the chosen flavor
    $$('.card-btn').forEach(function (a) {
      var t = 'היי אנרג\'וסר, אני מתעניין ב' + a.dataset.label + ' לאירוע חברה. אשמח לפרטים.';
      a.href = 'https://api.whatsapp.com/send/?phone=' + WA_PHONE + '&text=' + encodeURIComponent(t) + '&type=phone_number&app_absent=0';
      a.target = '_blank'; a.rel = 'noopener';
    });
    var HS = 0.8, CS = 4.0417, UNIT = HS + CS;          // seconds: hold on a flavor + transition
    var HV = 20, CV = 100, UV = HV + CV, TOT = N * HV + (N - 1) * CV;   // scroll length in viewport heights
    function timeAt(vh) {
      var i = Math.min(N - 1, Math.floor(vh / UV)), r = vh - i * UV;
      if (r < HV || i === N - 1) return i * UNIT + HS * Math.min(1, r / HV);
      return i * UNIT + HS + CS * ((r - HV) / CV);
    }
    var holdP = []; for (var k = 0; k < N; k++) holdP.push((k * UV + HV / 2) / TOT);
    var shown = -1, target = 0, cur = 0;
    function paint(i) {
      if (i === shown) return; shown = i;
      uis.forEach(function (u, k) { u.classList.toggle('on', k === i && i >= 0); });
      if (i < 0) return;
      var ink = data[i].dataset.ink;
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.style.borderColor = ink; d.style.background = k === i ? ink : 'transparent'; });
      pin.style.setProperty('--bgc', data[i].dataset.bg);
      document.body.classList.toggle('light-hero', ink !== '#fff');
      $('#hint').style.opacity = i === 0 ? .85 : 0;
    }
    var st = ScrollTrigger.create({
      trigger: '#top', start: 'top top', end: '+=' + TOT + '%', pin: '.stage-pin', anticipatePin: 1,
      snap: { snapTo: holdP, duration: { min: 1.1, max: 2.4 }, delay: .08, ease: 'power1.inOut' },
      onUpdate: function (s) { target = timeAt(s.progress * TOT); },
      onToggle: function (self) { header.classList.toggle('on-stage', self.isActive); if (!self.isActive) document.body.classList.remove('light-hero'); },
      onLeave: function () { document.body.classList.remove('light-hero'); },
      onEnterBack: function () { shown = -1; }
    });
    vid.pause();
    gsap.ticker.add(function () {
      cur += (target - cur) * 0.22; if (Math.abs(target - cur) < 0.004) cur = target;
      if (vid.readyState >= 2 && !vid.seeking && Math.abs(vid.currentTime - cur) > 0.012) vid.currentTime = cur;
      var k = Math.round(cur / UNIT), within = cur - k * UNIT;
      paint(within > -0.25 && within < HS + 0.1 ? Math.min(N - 1, Math.max(0, k)) : -1);
    });
    function goTo(i) {
      var y = st.start + (st.end - st.start) * holdP[i];
      if (lenis) lenis.scrollTo(y, { duration: 1.8 }); else window.scrollTo({ top: y, behavior: 'smooth' });
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { goTo(k); }); });
    $('#stageNext').addEventListener('click', function () { goTo(Math.min(N - 1, Math.max(0, shown) + 1)); });
    // in-page anchors with Lenis
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var t = document.querySelector(id); if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -70 }); else t.scrollIntoView({ behavior: 'smooth' });
      });
    });
    paint(0);
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
  boot();
})();
