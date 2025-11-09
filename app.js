// SkySentinel Demo App
// All interactions are client-side and offline-friendly.

// Respect reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initLenis() {
  if (prefersReduced) return; // Avoid heavy smoothing
  if (!window.Lenis) return;
  const lenis = new Lenis({
    smoothWheel: true,
    lerp: 0.12,
    wheelMultiplier: 0.9,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.getElementById('mobile-menu');
  if (!toggle || !drawer) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    drawer.hidden = false; // ensure it's in the a11y tree
    drawer.classList.toggle('open', !open);
    if (open) {
      // Hide after animation completes for a11y
      setTimeout(() => { drawer.hidden = true; }, 300);
    }
  });
  drawer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      setTimeout(() => { drawer.hidden = true; }, 250);
    }
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
    gsap.fromTo(el, { opacity: 0, y: 14 }, {
      opacity: 1, y: 0, duration: 0.45,
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  });
  // Parallax subtle on hero art
  const art = document.querySelector('.hero-art img');
  if (art) {
    gsap.to(art, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', scrub: 0.4 }
    });
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
          duration: Math.min(2, 0.001 * target + 0.8),
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
  const after = compare.querySelector('.after');
  function setFromValue(val) {
    const pct = Math.max(0, Math.min(100, Number(val)));
    after.style.width = pct + '%';
  }
  setFromValue(slider.value);
  slider.addEventListener('input', (e) => setFromValue(e.target.value));
}

function initPricingToggle() {
  const toggle = document.getElementById('priceToggle');
  if (!toggle) return;
  const values = document.querySelectorAll('.price .value');
  function update() {
    const annual = toggle.checked;
    values.forEach(v => {
      const month = v.getAttribute('data-month');
      const year = v.getAttribute('data-year');
      const val = annual ? year : month;
      if (!prefersReduced && window.gsap) {
        gsap.fromTo(v, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.25 });
      }
      v.textContent = val;
    });
  }
  toggle.addEventListener('change', update);
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

function initForm() {
  const form = document.getElementById('leadForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;
  function showStatus(msg, ok = true) {
    status.hidden = false;
    status.textContent = msg;
    status.style.color = ok ? 'var(--brand-2)' : '#ff6b6b';
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const usecase = String(fd.get('usecase') || '');
    const message = String(fd.get('message') || '').trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !usecase || !message) {
      showStatus('Please complete all required fields with a valid email.', false);
      return;
    }
    // Offline-friendly: no network call. Simulate success.
    form.reset();
    showStatus('Message sent. We will reach out soon.');
  });
}

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
  initForm();
});

