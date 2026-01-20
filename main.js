(function () {
  'use strict';

  const MOBILE_BREAKPOINT = 900; // matches CSS breakpoint

  // Helpers
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Elements
  const navToggle = $('#navToggle');
  const primaryNav = $('#primaryNav');
  const navLinks = $$('.nav-link');
  const siteHeader = $('.site-header');
  const yearEl = $('#year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // NAV LOGIC
  function isNavOpen() {
    return primaryNav && primaryNav.classList.contains('show');
  }

  function openNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.add('show');
    navToggle.setAttribute('aria-expanded', 'true');
    // trap focus is intentionally not implemented here (lightweight)
  }

  function closeNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    if (isNavOpen()) closeNav();
    else openNav();
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });
  }

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!primaryNav || !isNavOpen()) return;
    const clickedInside = primaryNav.contains(e.target) || (navToggle && navToggle.contains(e.target));
    if (!clickedInside) closeNav();
  }, true);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isNavOpen()) closeNav();
  });

  // Close when resizing to desktop to avoid stuck open state
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT && isNavOpen()) closeNav();
  });

  // Smooth scroll with dynamic offset (header height)
  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return; // allow normal links
      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      // compute offset using header height
      const headerHeight = siteHeader ? Math.round(siteHeader.getBoundingClientRect().height) : 88;
      const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 8);

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // close mobile nav after navigation
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        closeNav();
      }
    });
  });

  // ACTIVE LINK USING INTERSECTION OBSERVER
  const sections = $$('main section[id]');
  const navMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) navMap[href.slice(1)] = link;
  });

  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          Object.values(navMap).forEach((l) => l.classList.remove('active'));
          const link = navMap[id];
          if (link) link.classList.add('active');
        }
      });
    }, { root: null, threshold: 0.55 });

    sections.forEach((s) => observer.observe(s));
  }

  // CAROUSEL (projects)
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = $('.carousel-track', carousel);
    const items = $$('.carousel-item', track);
    const btnPrev = $('[data-carousel-button="prev"]', carousel);
    const btnNext = $('[data-carousel-button="next"]', carousel);

    if (!track || items.length === 0) return;

    // Ensure items have correct flex basis (in case CSS missing)
    items.forEach((it) => {
      it.style.flex = '0 0 100%';
    });

    // Create indicators dynamically for reliability
    const indicatorsWrap = document.createElement('div');
    indicatorsWrap.className = 'custom-indicators';
    indicatorsWrap.setAttribute('role', 'tablist');
    items.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Slide ${idx + 1}`);
      btn.dataset.slideTo = String(idx);
      if (idx === 0) btn.classList.add('active');
      indicatorsWrap.appendChild(btn);
    });
    carousel.appendChild(indicatorsWrap);
    const indicators = Array.from(indicatorsWrap.children);

    let index = items.findIndex(i => i.classList.contains('active'));
    if (index < 0) index = 0;

    // Ensure only the active item has sensible tabindex and aria-hidden
    function refreshA11y() {
      items.forEach((it, i) => {
        const active = i === index;
        it.classList.toggle('active', active);
        it.setAttribute('aria-hidden', active ? 'false' : 'true');
        it.tabIndex = active ? 0 : -1;
      });
      indicators.forEach((btn, i) => btn.classList.toggle('active', i === index));
    }

    function show(i) {
      index = ((i % items.length) + items.length) % items.length;
      // translate track
      track.style.transform = `translateX(-${index * 100}%)`;
      refreshA11y();
    }

    // Prev/Next handlers
    if (btnPrev) btnPrev.addEventListener('click', () => { show(index - 1); resetAuto(); });
    if (btnNext) btnNext.addEventListener('click', () => { show(index + 1); resetAuto(); });

    // Indicator clicks
    indicators.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const i = Number(btn.dataset.slideTo);
        show(i);
        resetAuto();
      });
    });

    // Keyboard support when carousel has focus
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { show(index - 1); resetAuto(); }
      if (e.key === 'ArrowRight') { show(index + 1); resetAuto(); }
    });

    // Touch / pointer swipe support (small, resilient implementation)
    let startX = 0, dx = 0, pointerDown = false;
    track.addEventListener('pointerdown', (e) => {
      pointerDown = true;
      startX = e.clientX;
      track.style.transition = 'none';
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!pointerDown) return;
      dx = e.clientX - startX;
      const percent = (dx / track.clientWidth) * 100;
      track.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
    });
    track.addEventListener('pointerup', (e) => {
      pointerDown = false;
      track.style.transition = '';
      const threshold = track.clientWidth * 0.15; // 15% swipe threshold
      if (dx > threshold) show(index - 1);
      else if (dx < -threshold) show(index + 1);
      else show(index);
      dx = 0;
    });
    track.addEventListener('pointercancel', () => { pointerDown = false; dx = 0; show(index); });

    // Auto-advance with pause on hover / focus
    let auto = null;
    function startAuto() {
      stopAuto();
      auto = setInterval(() => show(index + 1), 8000);
    }
    function stopAuto() {
      if (auto) { clearInterval(auto); auto = null; }
    }
    function resetAuto() {
      stopAuto();
      startAuto();
    }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);

    // Initialize
    // Ensure track has transition enabled
    track.style.transition = track.style.transition || '';
    show(index);
    startAuto();

    // Keep layout consistent on resize
    window.addEventListener('resize', () => {
      // reapply transform because percent-based translate still works; but ensure items keep proper flex-basis
      items.forEach((it) => it.style.flex = '0 0 100%');
      show(index);
    });
  }

  // Lazy load images (if present)
  const lazyImgs = $$('img[data-src]');
  if ('IntersectionObserver' in window && lazyImgs.length) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, { threshold: 0.1 });
    lazyImgs.forEach((img) => imgObserver.observe(img));
  }

  // Respect prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion');
  }

  // SCROLL REVEAL (lazy-load style animation)
  const revealEls = $$('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // animate once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
  
  // Footer year range
  const year = new Date().getFullYear();
  document.getElementById("footer-year").textContent = `2023 - ${year}`;
})();