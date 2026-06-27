/**
 * components.js — Interactive Components
 * Typed.js hero text, Vanilla Tilt cards, animated counters,
 * form handling, and testimonial carousel logic.
 */

(function () {
  'use strict';

  // ── Typed.js — Rotating hero subheadline ──
  function initTyped() {
    if (typeof Typed === 'undefined') return;

    const el = document.getElementById('heroTyped');
    if (!el) return;

    new Typed('#heroTyped', {
      strings: [
        'Websites that convert at 3× industry average.',
        'Chatbots that handle 80% of inquiries while you sleep.',
        'Lead scoring that finds your highest-value customers.',
        'SEO engines that keep you on page one — automatically.',
        'Analytics that tell you exactly what to do next.',
      ],
      typeSpeed: 35,
      backSpeed: 20,
      backDelay: 2500,
      startDelay: 1000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });
  }

  // ── Vanilla Tilt — 3D card hover ──
  function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;

    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach((el) => {
      // Skip on mobile
      if (window.innerWidth < 768) return;

      const maxTilt = el.dataset.tiltMax || 8;

      VanillaTilt.init(el, {
        max: parseInt(maxTilt),
        speed: 400,
        glare: true,
        'max-glare': 0.08,
        perspective: 1000,
        gyroscope: false,
      });
    });
  }

  // ── Animated Counters ──
  function initCounters() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const counters = document.querySelectorAll('.counter');

    counters.forEach((counter) => {
      const target = parseFloat(counter.dataset.target);
      const isDecimal = counter.dataset.decimal === 'true';
      const suffix = counter.dataset.suffix || '';

      // Set initial display
      counter.textContent = '0' + suffix;

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { value: 0 };

          gsap.to(obj, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              if (isDecimal) {
                counter.textContent = obj.value.toFixed(1) + suffix;
              } else {
                counter.textContent = Math.round(obj.value).toLocaleString() + suffix;
              }
            },
          });
        },
      });
    });
  }

  // ── Form Handling ──
  function initForm() {
    const form = document.getElementById('auditForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.btn');
      const originalText = submitBtn.textContent;

      // Animate button
      submitBtn.textContent = 'Sending...';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.7';

      // Simulate submission (replace with actual endpoint)
      setTimeout(() => {
        submitBtn.textContent = '✓ Audit Requested!';
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        submitBtn.style.opacity = '1';

        // Reset after delay
        setTimeout(() => {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.pointerEvents = '';
        }, 3000);
      }, 1500);
    });

    // Input focus animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(input, {
            scale: 1.01,
            duration: 0.2,
            ease: 'power2.out',
          });
        }
      });

      input.addEventListener('blur', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(input, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
          });
        }
      });
    });
  }

  // ── Lucide Icons ──
  function initIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // ── Smooth scroll for anchor links ──
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Close mobile menu if open
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.getElementById('menuToggle');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          menuToggle.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Use Lenis if available, otherwise native
        if (window.__lenis) {
          window.__lenis.scrollTo(target, {
            offset: -80,
            duration: 1.2,
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── CTA Button Hover Ripple Effect ──
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary');

    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          left: ${x}px;
          top: ${y}px;
        `;

        btn.appendChild(ripple);

        if (typeof gsap !== 'undefined') {
          gsap.to(ripple, {
            width: 300,
            height: 300,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => ripple.remove(),
          });
        } else {
          ripple.remove();
        }
      });
    });
  }

  // ── Announcement Banner ──
  function initAnnouncementBar() {
    const bar = document.getElementById('announcementBar');
    const closeBtn = document.getElementById('annClose');
    if (!bar || !closeBtn) return;

    const dismissed = sessionStorage.getItem('ann-dismissed');
    if (dismissed) {
      bar.classList.add('hidden');
      document.body.classList.remove('with-banner');
      return;
    }

    closeBtn.addEventListener('click', () => {
      bar.classList.add('hidden');
      document.body.classList.remove('with-banner');
      sessionStorage.setItem('ann-dismissed', '1');
    });
  }

  // ── Live Chat Widget ──
  function initChatWidget() {
    const bubble = document.getElementById('chatBubble');
    const popup = document.getElementById('chatPopup');
    const closeBtn = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const body = document.getElementById('chatBody');
    const badge = document.getElementById('chatBadge');

    if (!bubble || !popup) return;

    const REPLIES = [
      "Great question! One of our AI specialists will follow up shortly. In the meantime, grab your <a href=\"#cta\">free AI audit →</a>",
      "Thanks for reaching out! We typically respond within minutes during business hours.",
      "Awesome! Book a quick call and we’ll walk you through exactly what we’d build for your business.",
    ];
    let replyIdx = 0;

    const openChat = () => {
      popup.classList.add('open');
      if (badge) badge.style.display = 'none';
      input && input.focus();
    };

    const closeChat = () => popup.classList.remove('open');

    bubble.addEventListener('click', () =>
      popup.classList.contains('open') ? closeChat() : openChat()
    );
    bubble.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChat(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    function appendMsg(html, isUser = false) {
      const msg = document.createElement('div');
      msg.className = 'chat-message' + (isUser ? ' user' : '');
      msg.innerHTML = isUser
        ? `<div class="chat-msg-bubble"><p>${html}</p><span class="chat-msg-time">Just now</span></div>`
        : `<div class="chat-msg-avatar">R1</div><div class="chat-msg-bubble"><p>${html}</p><span class="chat-msg-time">Just now</span></div>`;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function send() {
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;
      appendMsg(text, true);
      input.value = '';
      setTimeout(() => {
        appendMsg(REPLIES[replyIdx % REPLIES.length]);
        replyIdx++;
      }, 900);
    }

    if (sendBtn) sendBtn.addEventListener('click', send);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') send();
      });
    }

    // Re-show badge after 10s to re-engage if not opened
    setTimeout(() => {
      if (badge && !popup.classList.contains('open')) {
        badge.style.display = 'flex';
      }
    }, 10000);
  }

  // ── Initialize all components ──
  function init() {
    initIcons();
    initTyped();
    initTilt();
    initCounters();
    initForm();
    initAnchorScroll();
    initButtonEffects();
    initAnnouncementBar();
    initChatWidget();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure CDN scripts are loaded
    setTimeout(init, 100);
  }
})();
