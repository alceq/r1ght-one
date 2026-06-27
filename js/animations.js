/**
 * animations.js — GSAP ScrollTrigger Animations
 * Handles all scroll-driven reveal animations, parallax effects,
 * and section entrance transitions.
 */

(function () {
  'use strict';

  // Wait for GSAP to load
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Reveal Animations ──
  // Fade-up elements
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach((el, i) => {
      // Check if element is inside a grid — stagger siblings
      const parent = el.parentElement;
      const isGridChild =
        parent &&
        (parent.classList.contains('services-grid') ||
          parent.classList.contains('guarantee-grid') ||
          parent.classList.contains('results-metrics') ||
          parent.classList.contains('pricing-grid'));

      if (isGridChild) {
        // Will be handled by grid batch animation
        return;
      }

      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // ── Grid stagger animations ──
    const grids = document.querySelectorAll(
      '.services-grid, .guarantee-grid, .results-metrics, .pricing-grid'
    );

    grids.forEach((grid) => {
      const children = grid.querySelectorAll('.reveal');

      gsap.fromTo(
        children,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: {
            amount: 0.4,
            from: 'start',
          },
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  // ── Hero entrance animation ──
  function initHeroAnimation() {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      '.hero-badge',
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )
      .fromTo(
        '.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        '.hero-typed-wrap',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        '.hero-ctas .btn',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.15,
        },
        '-=0.3'
      )
      .fromTo(
        '.stats-bar',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      );
  }

  // ── Section title parallax ──
  function initParallax() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach((title) => {
      // Skip hero title
      if (title.closest('#hero')) return;

      gsap.fromTo(
        title,
        { y: 0 },
        {
          y: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: title,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });
  }

  // ── Guarantee cards glow pulse on scroll ──
  function initGuaranteeEffects() {
    const cards = document.querySelectorAll('.guarantee-card');

    cards.forEach((card, i) => {
      gsap.fromTo(
        card.querySelector('.guarantee-icon'),
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: i * 0.15,
        }
      );
    });
  }

  // ── Results quote entrance ──
  function initResultsStory() {
    const story = document.querySelector('.results-story');
    if (!story) return;

    gsap.fromTo(
      story,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: story,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // ── CTA form entrance ──
  function initCTAAnimation() {
    const form = document.querySelector('.audit-form');
    if (!form) return;

    gsap.fromTo(
      form.querySelectorAll('.form-group, .form-submit'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: form,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // ── Navbar scroll effect ──
  function initNavbarScroll() {
    ScrollTrigger.create({
      start: 80,
      onUpdate: (self) => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        if (self.scroll() > 80) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      },
    });
  }

  // ── Active nav link highlighting ──
  function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a');

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => highlightNav(section.id),
        onEnterBack: () => highlightNav(section.id),
      });
    });

    function highlightNav(id) {
      navLinks.forEach((link) => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--accent-cyan)';
        }
      });
    }
  }

  // ── Initialize all animations ──
  function init() {
    initHeroAnimation();
    initRevealAnimations();
    initParallax();
    initGuaranteeEffects();
    initResultsStory();
    initCTAAnimation();
    initNavbarScroll();
    initActiveNavLinks();

    // Refresh ScrollTrigger after everything loads
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
