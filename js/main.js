/**
 * main.js — App Initialization
 * Lenis smooth scroll, mobile menu, page loader,
 * and GSAP + Lenis integration.
 */

(function () {
  'use strict';

  // ── Page Loader ──
  function initLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');

        // Remove from DOM after transition
        setTimeout(() => {
          loader.remove();
        }, 600);
      }, 800);
    });

    // Failsafe — hide loader after 4 seconds regardless
    setTimeout(() => {
      if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
      }
    }, 4000);
  }

  // ── Lenis Smooth Scroll ──
  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not loaded — using native scroll');
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Expose for anchor scroll usage
    window.__lenis = lenis;

    // Integrate with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback RAF loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // ── Mobile Menu ──
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');

      if (isOpen) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        navLinks.classList.add('open');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Prefers Reduced Motion ──
  function checkReducedMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Disable Lenis smooth scroll
      if (window.__lenis) {
        window.__lenis.destroy();
      }

      // Kill GSAP animations
      if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.clear();
      }

      // Show all reveal elements
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });

      // Stop CSS animations
      document.querySelectorAll('.marquee-track, .testimonials-track').forEach((el) => {
        el.style.animationPlayState = 'paused';
      });
    }
  }

  // ── Init ──
  function init() {
    initLoader();
    initLenis();
    initMobileMenu();
    checkReducedMotion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
