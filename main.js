/* ==========================================================================
   SHAZAY — main.js
   Lightweight, dependency-free interactions:
   header state, mobile nav, scroll reveals, subtle parallax, newsletter form
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- boot ---- */
  window.addEventListener('load', function () {
    document.body.classList.add('is-ready');
  });
  // fallback in case load event already fired / is slow
  setTimeout(function () { document.body.classList.add('is-ready'); }, 1800);

  /* ---- header: scrolled state ---- */
  var header = document.getElementById('siteHeader');
  var lastY = window.scrollY;

  function updateHeader() {
    if (!header) return;
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    lastY = y;
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---- mobile nav toggle ---- */
  var burger = document.getElementById('burgerBtn');
  var nav = document.getElementById('siteNav');

  if (burger && nav && header) {
    burger.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- subtle parallax on hero + divider bands ---- */
  var parallaxEls = document.querySelectorAll('[data-parallax] img, [data-parallax]');
  if (!reducedMotion && parallaxEls.length) {
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        targets.forEach(function (wrap) {
          var img = wrap.tagName === 'IMG' ? wrap : wrap.querySelector('img');
          if (!img) return;
          var rect = wrap.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;
          var progress = (rect.top) / vh; // -1..1 roughly
          var shift = Math.max(-24, Math.min(24, progress * 22));
          img.style.transform = 'translateY(' + shift.toFixed(1) + 'px) scale(1.06)';
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- smooth-scroll offset correction for fixed header ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = 84;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---- newsletter form (static demo — no backend) ---- */
  var form = document.getElementById('subscribeForm');
  var note = document.getElementById('subscribeNote');

  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        note.textContent = 'Дякуємо! Перевір свою поштову скриньку, щоб підтвердити підписку.';
        form.reset();
      }
    });
  }
})();
