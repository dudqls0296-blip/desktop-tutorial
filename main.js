/* ═══════════════════════════════════════════════════════════
   ASHEN THRONE — Main JavaScript
   Dark Fantasy Action Game Official Website
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════
   1. PRELOADER (단일 게이지 & 다크 판타지 연출)
══════════════════════════════ */

// ── 은은한 잿가루/불씨 파티클 ──
(function initPreloaderCanvas() {
  const canvas = document.getElementById('preloaderCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 소량의 잿가루 불씨 (35개로 절제되어 깔끔함)
  const embers = Array.from({ length: 35 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.5,
    speedY: -(Math.random() * 0.4 + 0.15),
    speedX: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.4 + 0.1,
  }));

  function renderEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const e of embers) {
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228, 204, 166, ${e.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(184, 144, 101, 0.4)';
      ctx.fill();

      e.y += e.speedY;
      e.x += e.speedX;
      if (e.y < -5) {
        e.y = canvas.height + 5;
        e.x = Math.random() * canvas.width;
      }
      if (e.x < -5) e.x = canvas.width + 5;
      if (e.x > canvas.width + 5) e.x = -5;
    }
    requestAnimationFrame(renderEmbers);
  }
  renderEmbers();
})();

// ── 단일 게이지 0% ~ 100% 진행 ──
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const barEl     = document.getElementById('preloaderBar');
  const pctEl     = document.getElementById('preloaderPercent');

  let pct = 0;
  const DURATION_MS = 1800; // 전체 로딩 시간
  const INTERVAL_MS = 20;
  const step = 100 / (DURATION_MS / INTERVAL_MS);

  const progressInterval = setInterval(() => {
    // 자연스러운 진행 가속/변동
    const increment = step * (0.8 + Math.random() * 0.6);
    pct = Math.min(pct + increment, 100);
    const displayVal = Math.floor(pct);

    if (barEl) barEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = displayVal + '%';

    if (pct >= 100) {
      clearInterval(progressInterval);
      if (barEl) barEl.style.width = '100%';
      if (pctEl) pctEl.textContent = '100%';

      // 완료 후 부드럽게 페이드아웃
      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
        revealHeroElements();
      }, 300);
    }
  }, INTERVAL_MS);
});

function revealHeroElements() {
  const els = document.querySelectorAll('[data-reveal]');
  els.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 250 + 200);
  });
}

/* ══════════════════════════════
   2. NAVIGATION
══════════════════════════════ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// 스크롤 시 navbar 변경
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (sy > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = sy;
}, { passive: true });

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// 모바일 메뉴 항목 클릭 시 닫기
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ══════════════════════════════
   3. PARALLAX
══════════════════════════════ */
const heroBg = document.getElementById('heroBg');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (heroBg && sy < window.innerHeight) {
    heroBg.style.transform = `translateY(${sy * 0.35}px)`;
  }
}, { passive: true });

/* ══════════════════════════════
   4. PARTICLE CANVAS (안개/먼지)
══════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const particles = [];
  const COUNT = 60;

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.05,
      alphaDir: (Math.random() - 0.5) * 0.003,
    });
  }

  function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.alphaDir;
      if (p.alpha <= 0.02 || p.alpha >= 0.5) p.alphaDir *= -1;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,190,200,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animParticles);
  }
  animParticles();
})();

/* ══════════════════════════════
   5. RAIN CANVAS
══════════════════════════════ */
(function initRain() {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const drops = [];
  const DROP_COUNT = 120;

  for (let i = 0; i < DROP_COUNT; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: Math.random() * 15 + 8,
      speed: Math.random() * 4 + 8,
      alpha: Math.random() * 0.25 + 0.05,
    });
  }

  function animRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1, d.y + d.len);
      ctx.strokeStyle = `rgba(160,180,200,${d.alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      d.y += d.speed;
      if (d.y > canvas.height) {
        d.y = -d.len;
        d.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(animRain);
  }
  animRain();
})();

/* ══════════════════════════════
   6. SCROLL REVEAL
══════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ══════════════════════════════
   7. STAT BARS ANIMATION
══════════════════════════════ */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.bar-fill').forEach(bar => {
      const w = bar.dataset.width;
      setTimeout(() => { bar.style.width = w + '%'; }, 300);
    });
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const charSection = document.getElementById('character');
if (charSection) barObserver.observe(charSection);

/* ══════════════════════════════
   8. TRAILER PLAY BUTTON
══════════════════════════════ */
const playBtn = document.getElementById('playBtn');
const trailerOverlay = document.getElementById('trailerOverlay');
const trailerVideo = document.getElementById('trailerVideo');

if (playBtn && trailerVideo) {
  playBtn.addEventListener('click', () => {
    trailerOverlay.classList.add('hidden');
    trailerVideo.load();
    trailerVideo.play().catch(() => {
      trailerOverlay.classList.remove('hidden');
    });
  });
  trailerVideo.addEventListener('ended', () => {
    trailerOverlay.classList.remove('hidden');
  });
}

/* ══════════════════════════════
   9. MEDIA TABS
══════════════════════════════ */
const mediaTabs = document.querySelectorAll('.media-tab');
const mediaPanels = document.querySelectorAll('.media-panel');

mediaTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    mediaTabs.forEach(t => t.classList.remove('active'));
    mediaPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* ══════════════════════════════
   10. LIGHTBOX
══════════════════════════════ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.media-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.dataset.src || item.querySelector('img')?.src;
    if (!src || !lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ══════════════════════════════
   11. ACTIVE NAV LINK HIGHLIGHT
══════════════════════════════ */
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* ══════════════════════════════
   12. CURSOR CUSTOM (Desktop)
══════════════════════════════ */
// subtle cursor enhancement for interactive elements
document.querySelectorAll('button, a, .media-item, .play-btn').forEach(el => {
  el.style.cursor = 'pointer';
});
