/* =========================================================
   ROHIT.STUDIO — SCRIPT
   Table of Contents:
   1. Loader
   2. Custom Cursor
   3. Scroll Progress + Navbar state
   4. Mobile Menu
   5. Particle Background (Hero canvas)
   6. Scroll Reveal (IntersectionObserver)
   7. Animated Counters
   8. Skill Progress Bars
   9. Portfolio Filters
   10. Testimonial Slider
   11. FAQ Accordion
   12. Contact Form Validation
   13. Magnetic Buttons
   14. Back To Top + Smooth Nav
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============ 1. LOADER ============ */
  (function loader() {
    const loaderEl = document.getElementById('loader');
    const progressEl = document.getElementById('loaderProgress');
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 18;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        progressEl.style.width = pct + '%';
        setTimeout(() => {
          loaderEl.classList.add('hidden');
          document.body.style.overflow = '';
        }, 350);
      } else {
        progressEl.style.width = pct + '%';
      }
    }, 180);
    document.body.style.overflow = 'hidden';
    // safety fallback in case something above stalls
    setTimeout(() => { loaderEl.classList.add('hidden'); document.body.style.overflow = ''; }, 3000);
  })();

  /* ============ 2. CUSTOM CURSOR ============ */
  (function customCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveEls = document.querySelectorAll('a, button, .service-card, .project-card, input, select, textarea');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('ring-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('ring-active'));
    });
  })();

  /* ============ 3. SCROLL PROGRESS + NAVBAR STATE ============ */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    navbar.classList.toggle('scrolled', scrollTop > 40);
    backToTop.classList.toggle('show', scrollTop > 600);

    // Active nav link based on section in view
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (scrollTop >= top) current = sec.getAttribute('id');
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ 4. MOBILE MENU ============ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ============ 5. PARTICLE BACKGROUND (HERO) ============ */
  (function particles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particlesArr = [];
    const hero = canvas.closest('.hero');

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#6E3BFF', '#00E5FF', '#A855F7'];
    const count = window.innerWidth < 700 ? 30 : 60;

    function makeParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.2
      };
    }
    for (let i = 0; i < count; i++) particlesArr.push(makeParticle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArr.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ============ 6. SCROLL REVEAL ============ */
  (function scrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), (i % 4) * 90);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  })();

  /* ============ 7. ANIMATED COUNTERS ============ */
  (function counters() {
    const counterEls = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => observer.observe(el));
  })();

  /* ============ 8. SKILL PROGRESS BARS ============ */
  (function skillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillCards.forEach(card => observer.observe(card));
  })();

  /* ============ 9. PORTFOLIO FILTERS ============ */
  (function portfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cat = card.getAttribute('data-cat');
          const show = filter === 'all' || filter === cat;
          card.classList.toggle('filtered-out', !show);
        });
      });
    });
  })();

  /* ============ 10. TESTIMONIAL SLIDER ============ */
  (function testimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsWrap = document.getElementById('sliderDots');
    if (!track || cards.length === 0) return;

    let index = 0;
    let autoTimer;

    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('span');

    function goTo(i) {
      index = (i + cards.length) % cards.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(index + 1), 6000);
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));
    resetAuto();
  })();

  /* ============ 11. FAQ ACCORDION ============ */
  (function faqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(other => {
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  })();

  /* ============ 12. CONTACT FORM VALIDATION ============ */
  (function contactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    if (!form) return;

    // Track "filled" state for select floating labels
    form.querySelectorAll('select').forEach(select => {
      select.addEventListener('change', () => {
        select.closest('.field').classList.toggle('select-filled', select.value !== '');
      });
    });

    function validateField(field) {
      const input = field.querySelector('input, select, textarea');
      if (!input) return true;
      let valid = input.checkValidity();
      if (input.type === 'email' && input.value.trim() !== '') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      }
      field.classList.toggle('invalid', !valid);
      return valid;
    }

    form.querySelectorAll('.field').forEach(field => {
      const input = field.querySelector('input, select, textarea');
      if (input) {
        input.addEventListener('blur', () => validateField(field));
        input.addEventListener('input', () => { if (field.classList.contains('invalid')) validateField(field); });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('.field');
      let allValid = true;
      fields.forEach(field => {
        const input = field.querySelector('input, select, textarea');
        if (input && input.hasAttribute('required')) {
          if (!validateField(field)) allValid = false;
        }
      });

      if (allValid) {
        successMsg.classList.add('show');
        form.reset();
        form.querySelectorAll('.select-filled').forEach(f => f.classList.remove('select-filled'));
        setTimeout(() => successMsg.classList.remove('show'), 6000);
      } else {
        const firstInvalid = form.querySelector('.field.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  })();

  /* ============ 13. MAGNETIC BUTTONS ============ */
  (function magneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;
    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  })();

  /* ============ 14. BACK TO TOP ============ */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Scroll indicator click -> scroll to about */
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
  }

});
