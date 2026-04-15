/* ============================================================
   ATIF FAISAL — PORTFOLIO JS
   Animations, scroll reveals, cursor, skill bars, nav
   ============================================================ */

(function () {
  'use strict';

  // ── CUSTOM CURSOR ──────────────────────────────────────────
  const cursor = document.querySelector('.cursor');

  if (cursor && window.innerWidth > 900) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    // expand on interactive elements
    const hoverEls = document.querySelectorAll(
      'a, button, .project-card, .process-item, .align-item, .cloud-tag'
    );

    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
    });
  }

  // ── SCROLL PROGRESS BAR ────────────────────────────────────
  const progressBar = document.querySelector('.scroll-progress');

  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  // ── NAV SCROLL STATE ───────────────────────────────────────
  const nav = document.querySelector('nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const sections   = document.querySelectorAll('section[id], div[id]');
  const navLinks   = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 80) current = sec.getAttribute('id');
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ── SCROLL REVEAL (IntersectionObserver) ──────────────────
  const revealEls     = document.querySelectorAll('.reveal');
  const revealStagger = document.querySelectorAll('.reveal-stagger');
  const projectCards  = document.querySelectorAll('.project-card');
  const skillBlocks   = document.querySelectorAll('.skill-block');
  const skillBars     = document.querySelectorAll('.skill-bar');
  const alignCard     = document.querySelector('.alignment-card');
  const eduCard       = document.querySelector('.edu-card');
  const aboutPs       = document.querySelectorAll('.about-text p');

  function makeObserver(threshold = 0.12) {
    return new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
  }

  const obs = makeObserver(0.12);

  revealEls.forEach((el) => obs.observe(el));
  revealStagger.forEach((el) => obs.observe(el));

  // project cards — staggered
  const cardObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          cardObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  projectCards.forEach((card, i) => {
    card.dataset.delay = i * 120;
    cardObs.observe(card);
  });

  // skill blocks — staggered
  const skillBlockObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx   = Array.from(skillBlocks).indexOf(entry.target);
          const delay = idx * 90;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          skillBlockObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  skillBlocks.forEach((b) => skillBlockObs.observe(b));

  // skill bars — animate width when in view
  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.width;
          entry.target.style.width = target;
          barObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => {
    // store width from inline style, reset to 0, let observer re-apply
    const w = bar.style.width;
    bar.dataset.width = w;
    bar.style.width   = '0';
    barObs.observe(bar);
  });

  if (alignCard) obs.observe(alignCard);
  if (eduCard)   obs.observe(eduCard);

  aboutPs.forEach((p, i) => {
    const pObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            pObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    pObs.observe(p);
  });

  // ── PROCESS STEPS HOVER COUNTER ───────────────────────────
  // Animate the large number when hovering a process step
  const processItems = document.querySelectorAll('.process-item');
  processItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const num = item.querySelector('.process-num');
      if (!num) return;
      num.style.color = 'rgba(232,98,42,0.4)';
    });
    item.addEventListener('mouseleave', () => {
      const num = item.querySelector('.process-num');
      if (!num) return;
      num.style.color = 'rgba(255,255,255,0.15)';
    });
  });

  // ── SMOOTH SCROLL FOR NAV LINKS ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── PROJECT CARD TILT ─────────────────────────────────────
  if (window.innerWidth > 900) {
    projectCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s, box-shadow 0.3s';
      });
    });
  }

  // ── MASTER SCROLL HANDLER ─────────────────────────────────
  function onScroll() {
    updateProgress();
    updateNav();
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // initial call
  onScroll();

})();
