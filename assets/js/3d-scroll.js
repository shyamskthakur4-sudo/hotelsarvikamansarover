/**
 * HOTEL SARVIKA MANSAROVER - 3D SPATIAL & SCROLL ENGINE
 * Pure vanilla JavaScript with requestAnimationFrame lerping
 * Handcrafted physical depth, dynamic card tilt, specular sheen & scroll reveal
 */

(function () {
  'use strict';

  // Smooth lerp state
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = window.scrollY;
  let ticking = false;

  // Cache Elements
  const heroSection = document.querySelector('.hero-immersive-section');
  const heroCard = document.querySelector('.hero-editorial-card');
  const heroReservationBar = document.querySelector('.reservation-bar-glass');

  // 1. Reading Progress Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3.5px;
    width: 0%;
    background: linear-gradient(90deg, #9A783E 0%, #DFCA9B 50%, #9A783E 100%);
    box-shadow: 0 0 10px rgba(223, 202, 155, 0.6);
    z-index: 99999;
    pointer-events: none;
    transition: width 0.12s ease-out;
  `;
  document.body.appendChild(progressBar);

  // 2. Back to Top Floating Button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top-btn';
  backToTopBtn.setAttribute('aria-label', 'Back to top of page');
  backToTopBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 95px;
    right: 28px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #FFFFFF;
    color: #9A783E;
    border: 1.5px solid rgba(154, 120, 62, 0.35);
    box-shadow: 0 8px 24px rgba(26, 24, 22, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 990;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  `;
  document.body.appendChild(backToTopBtn);

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.background = 'linear-gradient(135deg, #CBB279 0%, #9A783E 100%)';
    backToTopBtn.style.color = '#FFFFFF';
    backToTopBtn.style.transform = 'translateY(-3px) scale(1.08)';
    backToTopBtn.style.boxShadow = '0 12px 28px rgba(154, 120, 62, 0.35)';
  });

  backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.background = '#FFFFFF';
    backToTopBtn.style.color = '#9A783E';
    backToTopBtn.style.transform = 'translateY(0) scale(1)';
    backToTopBtn.style.boxShadow = '0 8px 24px rgba(26, 24, 22, 0.12)';
  });

  // Track Mouse Position for Hero Parallax
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.targetX = x;
    mouse.targetY = y;
  }, { passive: true });

  // Track Scroll Position
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    // Update progress bar
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      const progress = (scrollY / maxScroll) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Toggle Back to Top visibility
    if (scrollY > 450) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.transform = 'translateY(0)';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.transform = 'translateY(20px)';
      backToTopBtn.style.pointerEvents = 'none';
    }

    // Request animation tick
    if (!ticking) {
      requestAnimationFrame(updateScrollScene);
      ticking = true;
    }
  }, { passive: true });

  function updateScrollScene() {
    // Subtle background parallax on hero section
    if (heroSection && scrollY < window.innerHeight * 1.2) {
      const heroOffset = scrollY * 0.22;
      heroSection.style.backgroundPositionY = `calc(50% + ${heroOffset}px)`;
    }

    ticking = false;
  }

  // Continuous Lerp Loop for 3D Hero Perspective
  function render3DHero() {
    if (window.innerWidth < 992) {
      if (heroCard && heroCard.style.transform !== 'none') {
        heroCard.style.transform = 'none';
      }
      requestAnimationFrame(render3DHero);
      return;
    }

    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    if (heroCard && scrollY < window.innerHeight) {
      const rotY = mouse.x * 3.5;  // Max 3.5 deg
      const rotX = -mouse.y * 3.5; // Max 3.5 deg
      heroCard.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    }

    requestAnimationFrame(render3DHero);
  }

  if (heroCard) {
    heroCard.style.transition = 'transform 0.15s ease-out';
    requestAnimationFrame(render3DHero);
  }

  // 3. Dynamic 3D Card Tilt with Specular Glare Sheen
  const tiltSelectors = [
    '.suite-feature-card',
    '.transit-card',
    '.amenity-box',
    '.policy-card',
    '.editorial-floating-plate',
    '.reservation-bar-glass',
    '.room-comparison-card'
  ];

  const tiltCards = document.querySelectorAll(tiltSelectors.join(', '));

  tiltCards.forEach((card) => {
    // Prepare card container for 3D perspective
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';
    card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';

    // Inject dynamic specular glare overlay
    const glare = document.createElement('div');
    glare.className = 'card-specular-glare';
    glare.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10;
      mix-blend-mode: overlay;
      border-radius: inherit;
    `;
    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    card.appendChild(glare);

    card.addEventListener('mousemove', (e) => {
      // Don't tilt if user prefers reduced motion or on small touch devices
      if (window.innerWidth < 992) return;

      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle, refined 3D tilt
      const tiltX = ((cardY - centerY) / centerY) * -4.5;
      const tiltY = ((cardX - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px)`;

      // Specular sheen highlight follows mouse
      const glareX = (cardX / rect.width) * 100;
      const glareY = (cardY / rect.height) * 100;
      glare.style.opacity = '0.35';
      glare.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      glare.style.opacity = '0';
    });
  });

  // 4. Staggered Scroll-Reveal Observer (Hardware-Accelerated)
  const revealElements = document.querySelectorAll(
    '.section-header, .suite-feature-card, .amenity-box, .transit-card, .policy-card, .gallery-item, .editorial-bento-grid, .romance-glass-box, .contact-section-grid, .privileges-grid'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el, index) => {
      el.classList.add('scroll-hidden');
      // Apply subtle stagger delay based on index in row
      const delay = (index % 4) * 0.08;
      el.style.transitionDelay = `${delay}s`;
      revealObserver.observe(el);
    });
  }

  // 5. Interactive Room Photo Thumbnail Switcher (Instant Angle Preview)
  const roomCards = document.querySelectorAll('.suite-feature-card');
  roomCards.forEach((card) => {
    const mainImg = card.querySelector('.suite-image-side img');
    const thumbButtons = card.querySelectorAll('.room-thumb-btn');

    if (mainImg && thumbButtons.length > 0) {
      thumbButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetSrc = btn.getAttribute('data-img-src');
          const targetAlt = btn.getAttribute('data-img-alt') || mainImg.alt;

          if (!targetSrc || mainImg.getAttribute('src') === targetSrc) return;

          // Update active state on thumbnails
          thumbButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          // Smooth crossfade transition
          mainImg.style.opacity = '0.3';
          mainImg.style.transform = 'scale(0.98)';

          setTimeout(() => {
            mainImg.src = targetSrc;
            mainImg.alt = targetAlt;
            mainImg.style.opacity = '1';
            mainImg.style.transform = 'scale(1)';
          }, 160);
        });
      });
    }
  });

})();
