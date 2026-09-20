/* ============================================================
   POŽIČAJTEPOVAČ.sk — Vanilla JS (ES6+)
   Sticky header · mobilné menu · FAQ accordion · smooth scroll
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Sticky header shadow on scroll ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Mobile navigation toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    const closeNav = () => {
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Otvoriť menu');
    };
    navToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
    });
    // Close after picking a link
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ---------- 3. FAQ accordion ---------- */
  const faqList = document.getElementById('faq-list');
  if (faqList) {
    const questions = faqList.querySelectorAll('.faq__q');
    questions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const answer = document.getElementById(btn.getAttribute('aria-controls'));

        // Close all others (single-open accordion)
        questions.forEach((other) => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const a = document.getElementById(other.getAttribute('aria-controls'));
            if (a) a.hidden = true;
          }
        });

        // Toggle current
        btn.setAttribute('aria-expanded', String(!expanded));
        if (answer) answer.hidden = expanded;
      });
    });
  }

  /* ---------- 4. Smooth-scroll offset for sticky header ---------- */
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
      // Move focus for accessibility without an extra jump
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- 5. Current year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
