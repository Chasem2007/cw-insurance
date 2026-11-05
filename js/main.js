/* ============================================================
   Conver & Winchell Insurance - Main JS
   ============================================================ */
(function () {
  'use strict';

  /* ---- Opening sequence hand-off ----
     The head script sets html.intro-active before first paint; the curtain
     itself is pure CSS. Here we only mark the session and retire the
     overlay afterwards. */
  var introActive = document.documentElement.classList.contains('intro-active');

  if (introActive) {
    try { window.sessionStorage.setItem('cw-intro', '1'); } catch (e) {}
    window.scrollTo(0, 0);                    // never open mid-page behind the curtain
    setTimeout(function () {
      // Keep .intro-active (the hero's delayed timings hang off it); a second
      // class releases the scroll lock and drops the overlay from the DOM.
      document.documentElement.classList.add('intro-done');
      var el = document.getElementById('intro');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 2000);
  }

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

  // The open panel sits on white, so the bar has to go solid whatever the
  // scroll position is. A class beats :has() here - Chrome leaves the bar's
  // background transition stranded part-way when the :has() state flips.
  function setMenu(isOpen) {
    navLinks.classList.toggle('open', isOpen);
    navToggle.classList.toggle('open', isOpen);
    nav.classList.toggle('menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  navToggle.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  // Tapping the scrim lands on .nav itself, which is outside the panel
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
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

  /* ---- Scroll reveal (settle-in motion with variety) ---- */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    // Grid/list cards rise + stagger; side rails come in from a direction.
    var groupSelectors = [
      '.featured-coverage__grid', '.team-preview__grid', '.steps__grid',
      '.why-grid', '.mosaic__cols', '.team__grid', '.claims__grid', '.contact-info-strip__grid',
      '.faq__list', '.carriers__list'
    ];

    groupSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          child.classList.add('reveal');
          if (i < 5) child.classList.add('reveal-delay-' + (i % 5 + 1));
        });
      });
    });

    // Coverage rows: alternate a subtle slide-in direction
    document.querySelectorAll('.cov-row').forEach(function (row, i) {
      row.classList.add('reveal', 'reveal--left');
    });

    // Section eyebrow + subhead rise (the h2 itself word-rises separately)
    document.querySelectorAll('.section-header .section-tag, .section-header p, .mosaic__head, .mosaic__more, .team-intro__inner > div, .lifestyle__content, .cta-strip__inner, .steps__footer, .featured-coverage__all').forEach(function (el) {
      el.classList.add('reveal');
    });

    // Trust list items come in from the right, staggered
    document.querySelectorAll('.trust-list li').forEach(function (el, i) {
      el.classList.add('reveal', 'reveal--right');
      if (i < 5) el.classList.add('reveal-delay-' + (i % 5 + 1));
    });

    // The big form + stat block: scale in
    document.querySelectorAll('.cta-box').forEach(function (el) {
      el.classList.add('reveal', 'reveal--scale');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  }

  /* ---- Heading word-rise (mask up, staggered) ---- */
  function buildWordRise(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.textContent = '';
    el.classList.add('word-rise');
    var idx = 0;
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/\s+/).forEach(function (token) {
          if (!token) return;
          var word = document.createElement('span');
          word.className = 'wr-word';
          var inner = document.createElement('span');
          inner.textContent = token;
          inner.style.transitionDelay = (idx * 0.055) + 's';
          idx++;
          word.appendChild(inner);
          el.appendChild(word);
          el.appendChild(document.createTextNode(' '));
        });
      } else if (node.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
      } else {
        el.appendChild(node.cloneNode(true));
      }
    });
  }

  // Once the last word has landed, lift the mask so nothing stays clipped
  function playWordRise(el) {
    el.classList.add('visible');
    var words = el.querySelectorAll('.wr-word').length;
    setTimeout(function () { el.classList.add('wr-done'); }, words * 55 + 900);
  }

  if (!prefersReduced) {
    // Section headings only. The hero and page-hero titles are each page's
    // Largest Contentful Paint: masking their words out of view held LCP back
    // by ~2s on mobile, so those rise in with CSS (transform only) instead.
    var riseHeadings = document.querySelectorAll('.section-header h2');
    riseHeadings.forEach(buildWordRise);

    // Section headings play when scrolled into view
    var headObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { playWordRise(entry.target); headObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.section-header h2.word-rise').forEach(function (el) { headObserver.observe(el); });
  }

  /* ---- Cursor spotlight on cards (21st.dev-style glow) ---- */
  // Only on real pointers, and rAF-throttled so we repaint at most once per frame.
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.feat-item, .why-card, .tp-card, .step, .team-card').forEach(function (card) {
      var queued = false, lx = 0, ly = 0;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        lx = e.clientX - r.left; ly = e.clientY - r.top;
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
          card.style.setProperty('--mx', lx + 'px');
          card.style.setProperty('--my', ly + 'px');
          queued = false;
        });
      });
    });
  }

  /* ---- Stat count-up ---- */
  if (!prefersReduced) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statObserver.unobserve(entry.target);
        var el = entry.target;
        var m = el.textContent.trim().match(/^(\d+)(.*)$/);
        if (!m) return;                       // e.g. "24/7" - leave untouched
        var target = parseInt(m[1], 10), suffix = m[2], start = null, dur = 1100;
        function tick(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.stat__number').forEach(function (el) { statObserver.observe(el); });
  }

  /* ---- Parallax (hero background) - desktop only, skip touch/small ---- */
  var allowParallax = !prefersReduced &&
    window.matchMedia && window.matchMedia('(min-width: 900px) and (pointer: fine)').matches;
  if (allowParallax) {
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (parallaxEls.length) {
      var ticking = false;
      var runParallax = function () {
        var vh = window.innerHeight;
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
          var rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;   // offscreen - skip
          // distance of element center from viewport center, scaled by speed
          var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
          el.style.transform = 'translate3d(0,' + (-offset).toFixed(1) + 'px,0)';
        });
        ticking = false;
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { requestAnimationFrame(runParallax); ticking = true; }
      }, { passive: true });
      window.addEventListener('resize', runParallax, { passive: true });
      runParallax();
    }
  }

  /* ---- Quote form ---- */
  var form      = document.getElementById('quoteForm');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (form && submitBtn) {
    form.addEventListener('submit', function () {
      submitBtn.querySelector('span').textContent = 'Sending…';
      submitBtn.disabled = true;
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn    = item.querySelector('.faq-item__q');
    var panel  = item.querySelector('.faq-item__a');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close any other open item (single-open accordion)
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('open');
        other.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-item__a').style.maxHeight = null;
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  // Keep an open panel correctly sized if the viewport reflows the text
  window.addEventListener('resize', function () {
    var open = document.querySelector('.faq-item.open .faq-item__a');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

  /* ---- Sticky mobile action bar (appears once past the hero) ---- */
  var mobileBar = document.getElementById('mobileBar');
  if (mobileBar) {
    var footerEl = document.querySelector('.footer');
    var toggleBar = function () {
      var pastHero  = window.scrollY > 420;
      // Hide it once the footer's own contact details are on screen
      var atFooter  = footerEl && footerEl.getBoundingClientRect().top < window.innerHeight - 120;
      mobileBar.classList.toggle('visible', pastHero && !atFooter);
    };
    window.addEventListener('scroll', toggleBar, { passive: true });
    toggleBar();
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
