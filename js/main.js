/* ============================================================
   Conver & Winchell Insurance — Main JS
   ============================================================ */
(function () {
  'use strict';

  /* ---- NAV scroll behavior ---- */
  var nav = document.getElementById('nav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- Mobile hamburger ---- */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---- Smooth scroll for on-page anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
    });
  });

  /* ---- Scroll reveal ---- */
  var revealTargets = document.querySelectorAll(
    '.feat-item, .why-card, .team-card, .carrier-logo, .carrier-text-badge, .claim-card, .stat, .cta-box, .cov-row, .contact-info-item'
  );

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

  revealTargets.forEach(function (el, i) {
    el.classList.add('reveal');
    var siblings = Array.from((el.parentElement || document.body).querySelectorAll('.reveal'));
    var idx = siblings.indexOf(el);
    if (idx > 0 && idx < 5) el.classList.add('reveal-delay-' + idx);
    observer.observe(el);
  });

  /* ---- Quote form ---- */
  var form      = document.getElementById('quoteForm');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (form && submitBtn) {
    form.addEventListener('submit', function () {
      submitBtn.querySelector('span').textContent = 'Sending…';
      submitBtn.disabled = true;
    });
  }

  /* ---- Phone auto-format ---- */
  var phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').substring(0, 10);
      if (d.length >= 7)      this.value = '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
      else if (d.length >= 4) this.value = '(' + d.slice(0,3) + ') ' + d.slice(3);
      else if (d.length > 0)  this.value = '(' + d;
    });
  }

})();
