/* ============================================================
   Conver & Winchell Insurance — Main JS v2
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAV: scroll behavior ---- */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- NAV: mobile hamburger ---- */
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

  /* ---- SERVICE TABS ---- */
  var tabs  = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.service-card');

  /* Initialize: show personal cards, hide property */
  cards.forEach(function (card) {
    if (card.dataset.category !== 'personal') {
      card.style.display = 'none';
    }
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      var category = tab.dataset.tab;
      cards.forEach(function (card) {
        if (card.dataset.category === category) {
          card.style.display = 'flex';
          card.classList.remove('visible');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.classList.add('visible');
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---- SCROLL REVEAL ---- */
  function setupReveal() {
    var targets = document.querySelectorAll(
      '.service-card, .why-card, .team-card, .carrier-logo, .carrier-text-badge, .claim-card, .stat, .cta-box, .lifestyle__content'
    );

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -24px 0px' }
    );

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      /* Stagger siblings in the same grid */
      var parent = el.parentElement;
      if (parent) {
        var siblings = Array.from(parent.querySelectorAll('.reveal'));
        var idx = siblings.indexOf(el);
        if (idx >= 0 && idx < 5) {
          el.classList.add('reveal-delay-' + (idx + 1));
        }
      }
      observer.observe(el);
    });
  }

  requestAnimationFrame(setupReveal);

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---- QUOTE FORM ---- */
  var form      = document.getElementById('quoteForm');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form && submitBtn) {
    form.addEventListener('submit', function () {
      /* Allow native Netlify POST — just update the button state */
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
    });

    /* Clear error borders on input */
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        if (this.value.trim()) this.style.borderColor = '';
      });
    });
  }

  /* ---- PHONE FORMATTING ---- */
  var phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var digits = this.value.replace(/\D/g, '').substring(0, 10);
      if (digits.length >= 7) {
        this.value = '(' + digits.slice(0,3) + ') ' + digits.slice(3,6) + '-' + digits.slice(6);
      } else if (digits.length >= 4) {
        this.value = '(' + digits.slice(0,3) + ') ' + digits.slice(3);
      } else if (digits.length > 0) {
        this.value = '(' + digits;
      }
    });
  }

})();
