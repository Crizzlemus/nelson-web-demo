// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Reveal on scroll
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Active nav link on scroll
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.main-nav a')).filter(
  (a) => a.getAttribute('href')?.startsWith('#')
);

if (sections.length && navLinks.length) {
  const byId = new Map(navLinks.map((a) => [a.getAttribute('href')?.slice(1), a]));

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = byId.get(id);
        if (active) active.classList.add('active');
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
  );

  sections.forEach((s) => spy.observe(s));
}

// Back to top
const toTop = document.getElementById('toTop');
if (toTop) {
  const onScroll = () => {
    const show = window.scrollY > 700;
    toTop.hidden = !show;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// Form UX (local demo)
const form = document.getElementById('supportForm');
const toast = document.getElementById('toast');

function validateRequired(formEl) {
  const required = Array.from(formEl.querySelectorAll('[required]'));
  let ok = true;
  required.forEach((el) => {
    if (el.type === 'checkbox') {
      if (!el.checked) ok = false;
      return;
    }
    if (!String(el.value || '').trim()) ok = false;
  });
  return ok;
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateRequired(form)) {
      // Simple, visible feedback without breaking accessibility
      alert('Por favor completa los campos obligatorios y acepta el tratamiento de datos.');
      return;
    }

    if (toast) {
      toast.hidden = false;
      toast.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      setTimeout(() => {
        toast.hidden = true;
      }, 6500);
    }

    form.reset();
  });
}
