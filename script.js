/* ═══════════════════════════════════════════════════════════
   LUNA SKIN CLINIC — script.js
   Features: Custom Cursor · Particle Canvas · Navbar Scroll
             Counter Animation · Scroll Reveal · Service Filter
             Testimonial Slider · Form Validation · Mobile Menu
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── DOM READY ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initServiceFilter();
  initTestimonialSlider();
  initFormValidation();
  initSmoothScroll();
  initHoverSounds();
  initDateMinimum();
  console.log('☽ Luna Skin Clinic — Loaded & Glowing');
});


/* ═══════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let isVisible = false;

  // Mouse move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      cursor.style.opacity   = '1';
      follower.style.opacity = '1';
      isVisible = true;
    }

    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .service-card, .gallery-card, .filter-btn, input, select, textarea'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor-follower--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor-follower--hover');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
    isVisible = false;
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
    isVisible = true;
  });
}


/* ═══════════════════════════════════════════════════════════
   2. PARTICLE CANVAS
   ═══════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const PARTICLE_COUNT = 80;
  const particles = [];

  // Particle constructor
  function createParticle() {
    return {
      x:      Math.random() * W,
      y:      Math.random() * H,
      r:      Math.random() * 1.5 + 0.3,
      vx:     (Math.random() - 0.5) * 0.3,
      vy:     (Math.random() - 0.5) * 0.3 - 0.1,
      alpha:  Math.random() * 0.5 + 0.1,
      pulse:  Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color:  Math.random() > 0.7 ? '#c9a96e' : (Math.random() > 0.5 ? '#8b6fd4' : '#d4748b')
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  // Constellation lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Mouse repel effect
  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();

    particles.forEach(p => {
      // Update
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Repel from mouse
      const dx   = p.x - mx;
      const dy   = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Pulsating alpha
      const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `, ${pulseAlpha})`).replace('rgb', 'rgba')
                      || `rgba(201,169,110,${pulseAlpha})`;

      // Parse hex color for stars
      if (p.color.startsWith('#')) {
        const hex = p.color.slice(1);
        const r   = parseInt(hex.slice(0,2), 16);
        const g   = parseInt(hex.slice(2,4), 16);
        const b   = parseInt(hex.slice(4,6), 16);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulseAlpha})`;
      }

      ctx.fill();

      // Glow for brighter particles
      if (p.alpha > 0.45) {
        ctx.shadowBlur  = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }
    });

    requestAnimationFrame(animate);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}


/* ═══════════════════════════════════════════════════════════
   3. NAVBAR SCROLL BEHAVIOR
   ═══════════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking    = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Scroll class
        if (scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        // Hide/show on scroll direction (optional UX enhancement)
        if (scrollY > lastScroll && scrollY > 300) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
        nav.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s, padding 0.4s, backdrop-filter 0.4s';

        lastScroll = scrollY;
        ticking    = false;
      });
      ticking = true;
    }
  });

  // Active link highlight based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('nav__link--active');
      }
    });
  });
}


/* ═══════════════════════════════════════════════════════════
   4. MOBILE MENU
   ═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.5);
    z-index:998;opacity:0;pointer-events:none;
    transition:opacity 0.4s;backdrop-filter:blur(4px);
  `;
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) { closeMenu(); } else { openMenu(); }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}


/* ═══════════════════════════════════════════════════════════
   5. SCROLL REVEAL
   ═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-fade, .reveal-up, .reveal-left, .reveal-right'
  );

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if parent has multiple reveal children
        const siblings = entry.target.parentElement.querySelectorAll(
          '.reveal-fade, .reveal-up, .reveal-left, .reveal-right'
        );
        siblings.forEach((sibling, index) => {
          if (entry.target === sibling) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
          }
        });
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════════════════
   6. COUNTER ANIMATION (Hero Stats)
   ═══════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.hero__stat-num[data-count]');
  if (!counters.length) return;

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = Math.round(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Trigger when hero is visible
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  let started = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      // Delay slightly for impact
      setTimeout(() => counters.forEach(animateCounter), 500);
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(heroSection);
}


/* ═══════════════════════════════════════════════════════════
   7. SERVICE FILTER
   ═══════════════════════════════════════════════════════════ */
function initServiceFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;

      serviceCards.forEach((card, index) => {
        const category = card.dataset.category;
        const show     = filter === 'all' || category === filter;

        if (show) {
          // Staggered reveal
          card.classList.remove('hidden');
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, index * 60);
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
}


/* ═══════════════════════════════════════════════════════════
   8. TESTIMONIAL SLIDER
   ═══════════════════════════════════════════════════════════ */
function initTestimonialSlider() {
  const slider    = document.getElementById('testimonialSlider');
  const prevBtn   = document.getElementById('testimonialPrev');
  const nextBtn   = document.getElementById('testimonialNext');
  const dotsWrap  = document.getElementById('testimonialDots');
  if (!slider || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards     = slider.querySelectorAll('.testimonial-card');
  const total     = cards.length;
  let   current   = 0;
  let   autoTimer = null;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonial-dot');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('testimonial-dot--active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.testimonial-dot');

  function goTo(index, direction = 'next') {
    // Animate out current
    cards[current].style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    cards[current].style.opacity    = '0';
    cards[current].style.transform  = direction === 'next' ? 'translateX(-40px)' : 'translateX(40px)';

    setTimeout(() => {
      cards[current].classList.remove('testimonial-card--active');
      cards[current].style.opacity   = '';
      cards[current].style.transform = '';

      current = (index + total) % total;

      // Animate in next
      cards[current].style.transition = 'none';
      cards[current].style.opacity    = '0';
      cards[current].style.transform  = direction === 'next' ? 'translateX(40px)' : 'translateX(-40px)';
      cards[current].classList.add('testimonial-card--active');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cards[current].style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          cards[current].style.opacity    = '1';
          cards[current].style.transform  = 'translateX(0)';
        });
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('testimonial-dot--active', i === current);
      });
    }, 350);
  }

  nextBtn.addEventListener('click', () => {
    resetAuto();
    goTo(current + 1, 'next');
  });
  prevBtn.addEventListener('click', () => {
    resetAuto();
    goTo(current - 1, 'prev');
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { resetAuto(); goTo(current + 1, 'next'); }
    if (e.key === 'ArrowLeft')  { resetAuto(); goTo(current - 1, 'prev'); }
  });

  // Auto-advance
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1, 'next'), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();

  // Touch swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      resetAuto();
      if (dx < 0) goTo(current + 1, 'next');
      else        goTo(current - 1, 'prev');
    }
  });
}


/* ═══════════════════════════════════════════════════════════
   9. FORM VALIDATION & SUBMISSION
   ═══════════════════════════════════════════════════════════ */
function initFormValidation() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const fields = {
    name:      { el: document.getElementById('name'),      err: document.getElementById('nameError'),      validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name (at least 2 characters).' },
    email:     { el: document.getElementById('email'),     err: document.getElementById('emailError'),     validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    treatment: { el: document.getElementById('treatment'), err: document.getElementById('treatmentError'), validate: v => v !== '' ? '' : 'Please select a treatment.' },
    date:      { el: document.getElementById('date'),      err: document.getElementById('dateError'),      validate: v => { if (!v) return 'Please select a preferred date.'; const d = new Date(v); const today = new Date(); today.setHours(0,0,0,0); return d >= today ? '' : 'Please select a future date.'; } }
  };

  const successEl = document.getElementById('formSuccess');

  // Real-time validation
  Object.values(fields).forEach(({ el, err, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const msg = validate(el.value);
        err.textContent = msg;
        el.classList.toggle('error', !!msg);
      }
    });
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el, err, validate }) => {
      if (!el) return;
      const msg = validate(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) valid = false;
    });

    if (!valid) {
      // Shake animation on first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.style.animation = 'none';
        requestAnimationFrame(() => {
          firstError.style.animation = 'shake 0.4s ease';
        });
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '☽ Sending...';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '0.7';

    // Fake async
    setTimeout(() => {
      form.style.transition = 'opacity 0.3s';
      form.style.opacity    = '0';
      setTimeout(() => {
        // Hide form fields, show success
        Array.from(form.children).forEach(child => {
          if (!child.classList.contains('form-success')) {
            child.style.display = 'none';
          }
        });
        successEl.classList.add('show');
        form.style.opacity = '1';

        // Confetti-like particles (CSS only via injected spans)
        spawnConfetti();
      }, 300);
    }, 1400);
  });

  // Shake keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}


/* ═══════════════════════════════════════════════════════════
   10. CONFETTI SPARKLES (Form Success)
   ═══════════════════════════════════════════════════════════ */
function spawnConfetti() {
  const colors  = ['#c9a96e', '#e8c98a', '#8b6fd4', '#d4748b', '#ffffff'];
  const symbols = ['✦', '☽', '◎', '❋', '✿', '◈'];
  const container = document.getElementById('bookingForm');
  if (!container) return;

  for (let i = 0; i < 24; i++) {
    const span = document.createElement('span');
    span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    span.style.cssText = `
      position:fixed;
      left:${Math.random() * 100}vw;
      top:${Math.random() * 40 + 30}vh;
      color:${colors[Math.floor(Math.random() * colors.length)]};
      font-size:${Math.random() * 16 + 10}px;
      pointer-events:none;
      z-index:9999;
      animation: confettiFall ${Math.random() * 1.5 + 1}s ease forwards;
      animation-delay:${Math.random() * 0.5}s;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 2500);
  }

  // Keyframe
  if (!document.querySelector('#confetti-style')) {
    const s = document.createElement('style');
    s.id = 'confetti-style';
    s.textContent = `
      @keyframes confettiFall {
        0%   { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
        100% { opacity:0; transform:translateY(120px) rotate(${Math.random() > 0.5 ? 360 : -360}deg) scale(0.2); }
      }
    `;
    document.head.appendChild(s);
  }
}


/* ═══════════════════════════════════════════════════════════
   11. SMOOTH SCROLL (offset for fixed nav)
   ═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navH   = document.getElementById('nav')?.offsetHeight || 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ═══════════════════════════════════════════════════════════
   12. MICRO INTERACTIONS — Hover sound simulation (visual only)
   ═══════════════════════════════════════════════════════════ */
function initHoverSounds() {
  // Ripple effect on buttons
  document.querySelectorAll('.btn, .filter-btn, .service-card__cta').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        width:${size}px;
        height:${size}px;
        left:${x}px;
        top:${y}px;
        background:rgba(255,255,255,0.12);
        animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;
        z-index:10;
      `;

      // Ensure position relative
      if (getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Ripple keyframe
  if (!document.querySelector('#ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `
      @keyframes rippleAnim {
        0%   { transform: scale(0); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
}


/* ═══════════════════════════════════════════════════════════
   13. DATE INPUT MINIMUM (no past dates)
   ═══════════════════════════════════════════════════════════ */
function initDateMinimum() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;

  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}


/* ═══════════════════════════════════════════════════════════
   14. SCROLL PROGRESS INDICATOR (top bar)
   ═══════════════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed;
    top:0;left:0;
    height:2px;
    background:linear-gradient(90deg, #c9a96e, #e8c98a, #8b6fd4);
    z-index:10000;
    width:0%;
    transition:width 0.1s linear;
    pointer-events:none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = (window.scrollY / scrollable) * 100;
    bar.style.width  = progress + '%';
  }, { passive: true });
})();


/* ═══════════════════════════════════════════════════════════
   15. GALLERY CARD PARALLAX (subtle depth effect on hover)
   ═══════════════════════════════════════════════════════════ */
(function initGalleryParallax() {
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 6;
      const rotY   =  dx * 6;

      card.style.transform         = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      card.style.transition        = 'transform 0.1s ease';
      card.style.boxShadow         = `${-dx * 12}px ${-dy * 12}px 40px rgba(201,169,110,0.15)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      card.style.boxShadow  = '';
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   16. SERVICE CARD 3D TILT
   ═══════════════════════════════════════════════════════════ */
(function initCardTilt() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 4;
      const rotY =  dx * 4;

      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   17. LAZY IMAGE PLACEHOLDER COLOR ANIMATION
   ═══════════════════════════════════════════════════════════ */
(function initPlaceholderAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    .gallery-card {
      background: linear-gradient(
        135deg,
        var(--clr-surface) 0%,
        var(--clr-surface-2) 50%,
        var(--clr-surface) 100%
      );
      background-size: 200% 200%;
      animation: shimmerGallery 4s ease infinite;
    }
    @keyframes shimmerGallery {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .gallery-card:hover {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(style);
})();


/* ═══════════════════════════════════════════════════════════
   18. SECTION ENTRANCE ORCHESTRATION
   — adds stagger delays to children of .section
   ═══════════════════════════════════════════════════════════ */
(function orchestrateSectionAnimations() {
  document.querySelectorAll('.section').forEach(section => {
    const children = section.querySelectorAll('.reveal-up');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   19. FOOTER LINK RIPPLE
   ═══════════════════════════════════════════════════════════ */
(function initFooterLinks() {
  document.querySelectorAll('.footer__links-group a').forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.paddingLeft = '0.4rem';
      this.style.transition  = 'padding-left 0.2s ease, color 0.25s';
    });
    link.addEventListener('mouseleave', function () {
      this.style.paddingLeft = '0';
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   20. PERFORMANCE: Pause particle canvas when tab not visible
   ═══════════════════════════════════════════════════════════ */
(function initVisibilityPause() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  document.addEventListener('visibilitychange', () => {
    canvas.style.animationPlayState =
      document.hidden ? 'paused' : 'running';
  });
})();