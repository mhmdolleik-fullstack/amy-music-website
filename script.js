/* ============================================
   Amy Eventsängerin – V2 Premium Interactive JS
   Smooth animations, cursor, parallax, tilt
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTouchDevice = 'ontouchstart' in window;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ══════════════════════════════════════════════
  // PRELOADER
  // ══════════════════════════════════════════════
  const preloader = document.getElementById('preloader');
  
  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      // Start hero animations after preloader
      setTimeout(triggerHeroAnimations, 200);
    }
  }

  // Hide preloader when page loads (or after max 3s)
  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 800);
  });
  setTimeout(hidePreloader, 3000); // fallback

  // ══════════════════════════════════════════════
  // HERO ANIMATIONS
  // ══════════════════════════════════════════════
  function triggerHeroAnimations() {
    // Already handled via CSS animation delays
    // Add parallax to hero image on mouse move
    if (!isMobile && !isTouchDevice) {
      const heroImg = document.getElementById('heroImg');
      const hero = document.getElementById('hero');
      
      if (heroImg && hero) {
        hero.addEventListener('mousemove', (e) => {
          const rect = hero.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          heroImg.style.transform = `scale(1.02) translate(${x * -5}px, ${y * -5}px)`;
        });
      }
    }
  }

  // ══════════════════════════════════════════════
  // CUSTOM CURSOR
  // ══════════════════════════════════════════════
  if (!isMobile && !isTouchDevice) {
    const cursor = document.getElementById('cursor');
    const cursorInner = cursor.querySelector('.cursor-inner');
    const cursorOuter = cursor.querySelector('.cursor-outer');
    
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let innerX = 0, innerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Inner cursor - fast follow
      innerX += (mouseX - innerX) * 0.25;
      innerY += (mouseY - innerY) * 0.25;
      cursorInner.style.left = innerX + 'px';
      cursorInner.style.top = innerY + 'px';

      // Outer cursor - smooth follow
      outerX += (mouseX - outerX) * 0.1;
      outerY += (mouseY - outerY) * 0.1;
      cursorOuter.style.left = outerX + 'px';
      cursorOuter.style.top = outerY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .gallery-item, .service-card, .tag-pill, .instrument-card');
    
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ══════════════════════════════════════════════
  // NAVBAR
  // ══════════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function handleNavbarScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleNavbarScroll);
      ticking = true;
    }
  }, { passive: true });
  
  handleNavbarScroll();

  // ══════════════════════════════════════════════
  // MOBILE NAVIGATION
  // ══════════════════════════════════════════════
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });

    // Close on background click
    mobileMenu.querySelector('.mobile-menu-bg').addEventListener('click', toggleMobileMenu);
  }

  // ══════════════════════════════════════════════
  // SMOOTH SCROLLING
  // ══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ══════════════════════════════════════════════
  // SCROLL REVEAL ANIMATIONS
  // ══════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.anim-reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay for siblings
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.anim-reveal')) : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex >= 0 ? siblingIndex * 80 : 0;
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ══════════════════════════════════════════════
  // COUNTER ANIMATION (floating badges)
  // ══════════════════════════════════════════════
  const counters = document.querySelectorAll('.floating-badge-number');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
          const current = Math.floor(eased * target);
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ══════════════════════════════════════════════
  // SERVICE CARD GLOW EFFECT
  // ══════════════════════════════════════════════
  if (!isMobile && !isTouchDevice) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // ══════════════════════════════════════════════
  // PARALLAX ON SCROLL
  // ══════════════════════════════════════════════
  if (!isMobile && !prefersReducedMotion) {
    const heroOrbs = document.querySelectorAll('.hero-orb');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      
      if (scrolled < window.innerHeight * 1.5) {
        heroOrbs.forEach((orb, i) => {
          const speed = 0.05 + (i * 0.02);
          orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
      }
    }, { passive: true });
  }

  // ══════════════════════════════════════════════
  // MAGNETIC EFFECT ON SOCIAL LINKS
  // ══════════════════════════════════════════════
  if (!isMobile && !isTouchDevice) {
    const magneticEls = document.querySelectorAll('.social-link');
    
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.03)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ══════════════════════════════════════════════
  // SMOOTH SCROLL INDICATOR HIDE
  // ══════════════════════════════════════════════
  const scrollIndicator = document.getElementById('scrollIndicator');
  
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
      }
    }, { passive: true });
  }

  // ══════════════════════════════════════════════
  // PWA INSTALL PROMPT
  // ══════════════════════════════════════════════
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; });

  // ══════════════════════════════════════════════
  // PAGE TRANSITION
  // ══════════════════════════════════════════════
  document.body.classList.add('page-transition-enter');

  // ══════════════════════════════════════════════
  // 3D CANVAS PARTICLE SYSTEM
  // ══════════════════════════════════════════════
  const heroCanvas = document.getElementById('heroCanvas3D');
  if (heroCanvas && !prefersReducedMotion) {
    const ctx = heroCanvas.getContext('2d');
    let canvasW, canvasH;
    let particles = [];
    let mouseCanvasX = -1000, mouseCanvasY = -1000;
    const PARTICLE_COUNT = isMobile ? 25 : 60;
    const MUSIC_SYMBOLS = ['♪', '♫', '♩', '♬', '✦', '✧'];

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      canvasW = heroCanvas.width = hero.offsetWidth;
      canvasH = heroCanvas.height = hero.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * (canvasW || window.innerWidth);
        this.y = Math.random() * (canvasH || window.innerHeight);
        this.size = Math.random() * 16 + 8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.symbol = MUSIC_SYMBOLS[Math.floor(Math.random() * MUSIC_SYMBOLS.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.isOrb = Math.random() > 0.6;
        this.orbRadius = Math.random() * 3 + 1;
        this.hue = Math.random() > 0.5 ? 217 : 263; // blue or purple
        this.depth = Math.random(); // 0 = far, 1 = close
      }
      update() {
        // Mouse repulsion
        const dx = this.x - mouseCanvasX;
        const dy = this.y - mouseCanvasY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.8;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.opacity += this.fadeSpeed;
        if (this.opacity > 0.5) this.fadeSpeed = -Math.abs(this.fadeSpeed);
        if (this.opacity < 0.05) this.reset();
        if (this.y < -30) this.reset();
        if (this.x < -30 || this.x > canvasW + 30) this.reset();
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity * (0.5 + this.depth * 0.5);
        if (this.isOrb) {
          // Glowing orb
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.orbRadius * (3 + this.depth * 4));
          gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, 0.6)`);
          gradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 60%, 0.2)`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.orbRadius * (3 + this.depth * 4), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Music symbol
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          const scale = 0.5 + this.depth * 0.5;
          ctx.font = `${this.size * scale}px 'Inter', sans-serif`;
          ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, 1)`;
          ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 0.5)`;
          ctx.shadowBlur = 15;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.symbol, 0, 0);
        }
        ctx.restore();
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      if (!ctx || !canvasW) return;
      ctx.clearRect(0, 0, canvasW, canvasH);
      particles.forEach(p => { p.update(); p.draw(ctx); });
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => { resizeCanvas(); });

    if (!isMobile && !isTouchDevice) {
      document.getElementById('hero').addEventListener('mousemove', (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        mouseCanvasX = e.clientX - rect.left;
        mouseCanvasY = e.clientY - rect.top;
      });
      document.getElementById('hero').addEventListener('mouseleave', () => {
        mouseCanvasX = -1000;
        mouseCanvasY = -1000;
      });
    }
  }

  // ══════════════════════════════════════════════
  // 3D TILT EFFECT ON CARDS
  // ══════════════════════════════════════════════
  if (!isMobile && !isTouchDevice && !prefersReducedMotion) {
    const tiltElements = document.querySelectorAll('.service-card, .instrument-card');
    
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = e.clientX - centerX;
        const y = e.clientY - centerY;
        const rotateY = (x / (rect.width / 2)) * 8;
        const rotateX = -(y / (rect.height / 2)) * 8;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 600);
      });
    });
  }

  // ══════════════════════════════════════════════
  // 3D HERO PARALLAX LAYERS
  // ══════════════════════════════════════════════
  if (!isMobile && !isTouchDevice && !prefersReducedMotion) {
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImgContainer = document.getElementById('heroImageContainer');

    if (hero && heroContent) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Content layer - subtle tilt
        heroContent.style.transform = `translate3d(${x * -15}px, ${y * -10}px, 0) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;

        // Image layer - deeper parallax in opposite direction  
        if (heroImgContainer) {
          heroImgContainer.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0) rotateY(${x * -3}deg) rotateX(${y * 2}deg) scale(1.02)`;
        }
      });

      hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = '';
        heroContent.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        if (heroImgContainer) {
          heroImgContainer.style.transform = '';
          heroImgContainer.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        setTimeout(() => {
          heroContent.style.transition = '';
          if (heroImgContainer) heroImgContainer.style.transition = '';
        }, 800);
      });
    }
  }

  // ══════════════════════════════════════════════
  // 3D SCROLL-DRIVEN SECTION TRANSFORMS
  // ══════════════════════════════════════════════
  if (!prefersReducedMotion) {
    const sections3D = document.querySelectorAll('.about, .services, .band, .gallery, .booking');
    
    const section3DObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-3d-enter', 'visible');
          section3DObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -80px 0px'
    });

    sections3D.forEach(section => {
      section.classList.add('section-3d-enter');
      section3DObserver.observe(section);
    });
  }

  // ══════════════════════════════════════════════
  // 3D GALLERY HOVER DEPTH
  // ══════════════════════════════════════════════
  if (!isMobile && !isTouchDevice && !prefersReducedMotion) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * 10;
        const rotateX = -y * 10;
        item.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateZ(20px)`;
        item.style.zIndex = '10';
        item.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.4), 0 0 30px rgba(96, 165, 250, 0.1)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
        item.style.zIndex = '';
        item.style.boxShadow = '';
        item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { item.style.transition = ''; }, 600);
      });
    });
  }

});

// ══════════════════════════════════════════════
// LIGHTBOX WITH NAVIGATION
// ══════════════════════════════════════════════
let currentLightboxIndex = 0;
const galleryItems = [];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    galleryItems.push(item.querySelector('img').src);
    item.setAttribute('data-index', index);
  });
});

function openLightbox(element) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  
  currentLightboxIndex = parseInt(element.getAttribute('data-index')) || 0;
  lightboxImg.src = galleryItems[currentLightboxIndex];
  counter.textContent = `${currentLightboxIndex + 1} / ${galleryItems.length}`;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryItems.length - 1;
  if (currentLightboxIndex >= galleryItems.length) currentLightboxIndex = 0;
  
  const lightboxImg = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  
  lightboxImg.style.opacity = '0';
  lightboxImg.style.transform = direction > 0 ? 'scale(0.95) translateX(20px)' : 'scale(0.95) translateX(-20px)';
  
  setTimeout(() => {
    lightboxImg.src = galleryItems[currentLightboxIndex];
    counter.textContent = `${currentLightboxIndex + 1} / ${galleryItems.length}`;
    lightboxImg.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1) translateX(0)';
  }, 200);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Close on background click
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});

// Touch swipe for lightbox
let touchStartX = 0;
let touchEndX = 0;

document.getElementById('lightbox').addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.getElementById('lightbox').addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const swipeDistance = touchStartX - touchEndX;
  
  if (Math.abs(swipeDistance) > 50) {
    if (swipeDistance > 0) {
      navigateLightbox(1); // Swipe left = next
    } else {
      navigateLightbox(-1); // Swipe right = prev
    }
  }
}, { passive: true });
