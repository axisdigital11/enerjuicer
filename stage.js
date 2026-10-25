/* Hero: layered flavor slides that drop in from above as you scroll (depth via per-layer parallax). */
(function () {
  'use strict';
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  function boot() {
    if (!window.gsap || !window.ScrollTrigger) { return setTimeout(boot, 60); }
    gsap.registerPlugin(ScrollTrigger);
    var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
    var isMobile = window.matchMedia('(max-width: 900px)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var slides = $$('.slide'), dots = $$('#dots button'), N = slides.length, header = $('#siteHeader');
    var lenis = null;
    if (window.Lenis && !isMobile && !reduce) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    $$('.s-prod').forEach(function (im) { var ok = function () { im.classList.add('ld'); }; if (im.complete && im.naturalWidth) ok(); else im.addEventListener('load', ok); });
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var target = 0, cur = 0, active = -1;
    var STEP = isMobile ? 120 : 150;                     // % viewport height of scroll per slide
    var st = ScrollTrigger.create({
      trigger: '#top', start: 'top top', end: '+=' + (STEP * (N - 1)) + '%', pin: '.stage-pin', anticipatePin: 1,
      snap: { snapTo: 1 / (N - 1), duration: { min: .9, max: 1.7 }, delay: .04, ease: 'power2.inOut' },
      onUpdate: function (s) { target = s.progress * (N - 1); },
      onToggle: function (s) { header.classList.toggle('on-stage', s.isActive); if (!s.isActive) document.body.classList.remove('light-hero'); }
    });
    function render() {
      for (var i = 0; i < N; i++) {
        var d = i - cur, el = slides[i], vis = d > -1.15 && d < 1.02;
        el.classList.toggle('vis', vis);
        if (!vis) continue;
        var panel, wx, px, cx, rot, co, sc;
        if (d > 0) {                                     // entering from the right
          panel = -d * 100; wx = -d * 34; px = d * 22; cx = -d * 12; rot = d * 7; sc = 1 - clamp(d, 0, 1) * 0.22; co = clamp(1 - d * 1.6, 0, 1);
        } else {                                         // leaving to the left
          panel = -d * 22; wx = -d * 9; px = -d * 34; cx = -d * 16; rot = d * 9; sc = 1 - clamp(-d, 0, 1) * 0.12; co = clamp(1 + d * 1.8, 0, 1);
        }
        el.style.transform = 'translate3d(0,' + panel + 'vh,0)';
        el.style.zIndex = i + 1;
        el.style.setProperty('--wx', wx); el.style.setProperty('--px', px); el.style.setProperty('--cx', cx);
        el.style.setProperty('--rot', rot + 'deg'); el.style.setProperty('--sc', sc); el.style.setProperty('--co', co);
      }
      var a = clamp(Math.round(cur), 0, N - 1);
      if (a !== active) {
        active = a;
        var ink = slides[a].dataset.ink;
        dots.forEach(function (dd, k) { dd.classList.toggle('on', k === a); dd.style.borderColor = ink; dd.style.background = k === a ? ink : 'transparent'; });
        $('#stageFrame').style.background = getComputedStyle(slides[a]).getPropertyValue('--bg');
        document.body.classList.toggle('light-hero', ink !== '#fff');
        var h = $('#hint'); if (h) h.style.opacity = a === 0 ? .85 : 0;
      }
    }
    gsap.ticker.add(function () {
      cur += (target - cur) * (reduce ? 1 : 0.075);
      if (Math.abs(target - cur) < 0.0008) cur = target;
      render();
    });
    function goTo(i) {
      var y = st.start + (st.end - st.start) * (i / (N - 1));
      if (lenis) lenis.scrollTo(y, { duration: 1.3 }); else window.scrollTo({ top: y, behavior: 'smooth' });
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { goTo(k); }); });
    $('#stageNext').addEventListener('click', function () { goTo(Math.min(N - 1, active + 1)); });
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var t = document.querySelector(id); if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -70 }); else t.scrollIntoView({ behavior: 'smooth' });
      });
    });
    cur = target = st.progress * (N - 1);
    render();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
  boot();
})();
