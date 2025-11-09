// StratoRelief Demo App
// All interactions are client-side and offline-friendly.

// Respect reduced motion and detect mobile to tune animations
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// Single scroll dispatcher to minimize multiple scroll listeners
const __scrollUpdates = [];
let __scrollScheduled = false;
function addScrollUpdate(fn) {
  if (typeof fn === 'function') __scrollUpdates.push(fn);
  if (!addScrollUpdate._installed) {
    window.addEventListener('scroll', () => {
      if (__scrollScheduled) return;
      __scrollScheduled = true;
      requestAnimationFrame(() => {
        __scrollScheduled = false;
        for (const cb of __scrollUpdates) cb();
      });
    }, { passive: true });
    addScrollUpdate._installed = true;
  }
}

function initLenis() {
  // Disabled to preserve CSS scroll-snap behavior in presentation mode
  return;
}

function initMobileMenu() {
  const toggle = document.getElementById('tocToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;
  const setState = (open) => {
    sidebar.classList.toggle('open', open);
    document.body.classList.toggle('sidebar-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    sidebar.setAttribute('aria-hidden', String(!open));
  };
  toggle.addEventListener('click', () => {
    const willOpen = !sidebar.classList.contains('open');
    setState(willOpen);
  });
  // Close on link click for small screens
  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('a') && window.innerWidth < 1024) setState(false);
  });
  // Default open on desktop
  const desktop = window.innerWidth >= 1024;
  setState(desktop);
  window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop !== document.body.classList.contains('sidebar-open')) setState(isDesktop);
  });
}

function initHeroAnim() {
  if (prefersReduced || !window.gsap) return;
  gsap.set('.headline, .subcopy, .actions, .kpi-chips', { opacity: 0, y: 16 });
  gsap.timeline({ defaults: { duration: 0.5, ease: 'power2.out' } })
    .to('.headline', { opacity: 1, y: 0 })
    .to('.subcopy', { opacity: 1, y: 0 }, '-=0.2')
    .to('.actions', { opacity: 1, y: 0 }, '-=0.25')
    .to('.kpi-chips', { opacity: 1, y: 0 }, '-=0.3');
}

function initScrollAnims() {
  if (prefersReduced || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // Fade-in cards
  document.querySelectorAll('.fade-in, .feature, .stat').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 12 }, {
      opacity: 1, y: 0, duration: isMobile ? 0.32 : 0.45,
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  });
  // Parallax subtle on hero art
  const art = document.querySelector('.hero-art img');
  if (art && !isMobile) {
    // Keep very subtle to avoid heavy parallax
    gsap.to(art, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.hero', scrub: 0.2 } });
  }
}

function initCounters() {
  if (!window.gsap || !window.ScrollTrigger) return;
  document.querySelectorAll('.stat .num').forEach((el) => {
    const target = Number(el.dataset.target || '0');
    let started = false;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (started) return; started = true;
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target,
          duration: Math.min(1.6, 0.001 * target + (isMobile ? 0.6 : 0.8)),
          ease: 'power1.out',
          snap: { innerText: 1 },
          onUpdate: () => { el.textContent = Math.floor(el.innerText).toLocaleString(); }
        });
      }
    });
  });
}

function initTabs() {
  const tablist = document.querySelector('.tablist');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  function activate(id) {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.id === id)));
    panels.forEach(p => p.classList.toggle('is-active', p.id === document.getElementById(id).getAttribute('aria-controls')));
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab.id));
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(document.activeElement);
      if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); }
      if (e.key === 'Home') { e.preventDefault(); tabs[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); tabs[tabs.length - 1].focus(); }
    });
  });
}

function initCompareSlider() {
  const compare = document.querySelector('.compare');
  if (!compare) return;
  const slider = compare.querySelector('.slider');
  const wrap = compare.querySelector('.after-wrap');
  const handle = compare.querySelector('.handle');
  function setFromValue(val) {
    const pct = Math.max(0, Math.min(100, Number(val)));
    wrap.style.width = pct + '%';
    handle.style.left = pct + '%';
  }
  setFromValue(slider.value);
  slider.addEventListener('input', (e) => setFromValue(e.target.value));
}

function initPricingToggle() {
  // Pricing removed in presentation mode
}

function initFAQ() {
  document.querySelectorAll('.acc-btn').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
    });
  });
}

// Form removed in presentation mode

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (current === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    localStorage.setItem('theme', current === 'light' ? 'light' : 'dark');
  });
}

function scrollToSectionByIndex(index) {
  const slides = Array.from(document.querySelectorAll('.section.slide'));
  const target = slides[index];
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getCurrentSlideIndex() {
  const slides = Array.from(document.querySelectorAll('.section.slide'));
  const y = window.scrollY + window.innerHeight * 0.5;
  let idx = 0;
  slides.forEach((s, i) => { if (s.offsetTop <= y) idx = i; });
  return idx;
}

function initNextPrev() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const nextLink = document.getElementById('scrollNext');
  function go(delta) { scrollToSectionByIndex(getCurrentSlideIndex() + delta); }
  if (prev) prev.addEventListener('click', () => go(-1));
  if (next) next.addEventListener('click', () => go(1));
  if (nextLink) nextLink.addEventListener('click', (e) => { e.preventDefault(); go(1); });
  document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); go(1); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    if (e.key === 'Home') { e.preventDefault(); scrollToSectionByIndex(0); }
    if (e.key === 'End') { e.preventDefault(); scrollToSectionByIndex(document.querySelectorAll('.section.slide').length - 1); }
  });
  const toggleDisabled = () => {
    const idx = getCurrentSlideIndex();
    const total = document.querySelectorAll('.section.slide').length;
    if (prev) prev.toggleAttribute('disabled', idx === 0);
    if (next) next.toggleAttribute('disabled', idx >= total - 1);
  };
  addScrollUpdate(toggleDisabled);
  window.addEventListener('resize', toggleDisabled);
  toggleDisabled();
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.sidebar a'));
  const slides = Array.from(document.querySelectorAll('.section.slide'));
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
        slides.forEach((s, i) => {
          if (s === entry.target) {
            links.forEach(l => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
            const id = '#' + s.id; const link = links.find(l => l.getAttribute('href') === id);
            if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'true'); }
            s.classList.add('is-visible');
          }
        });
      }
    });
  }, { threshold: [0.35], rootMargin: '-64px 0px -40% 0px' });
  slides.forEach(s => observer.observe(s));
  // Ensure the current slide is visible on scroll (mobile safety net)
  addScrollUpdate(() => {
    const idx = getCurrentSlideIndex();
    if (slides[idx]) slides[idx].classList.add('is-visible');
  });
}

function initSlideCounter() {
  const el = document.getElementById('slideCounter');
  if (!el) return;
  const total = document.querySelectorAll('.section.slide').length;
  const update = () => {
    const current = getCurrentSlideIndex() + 1;
    el.textContent = `${current} / ${total}`;
  };
  addScrollUpdate(update);
  window.addEventListener('resize', update);
  update();
}

function initProgressBar() {
  const bar = document.querySelector('#progressBar span');
  if (!bar) return;
  function update() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    bar.style.width = Math.max(0, Math.min(1, scrolled)) * 100 + '%';
  }
  addScrollUpdate(update);
  update();
}

function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  const main = document.getElementById('main');
  const getScrollTop = () => {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  };
  const update = () => {
    const atTop = getScrollTop() <= 4;
    btn.classList.toggle('is-hidden', atTop);
    btn.setAttribute('aria-hidden', String(atTop));
  };
  btn.addEventListener('click', () => scrollToSectionByIndex(0));
  addScrollUpdate(update);
  window.addEventListener('resize', update);
  if (main) main.addEventListener('scroll', update, { passive: true });
  update();
}

// Export removed (no PDF handout triggers)

window.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initMobileMenu();
  initHeroAnim();
  initScrollAnims();
  initCounters();
  initTabs();
  initCompareSlider();
  initPricingToggle();
  initFAQ();
  initThemeToggle();
  initNextPrev();
  initScrollSpy();
  initProgressBar();
  initBackToTop();
  initSlideCounter();
  // export removed
});
