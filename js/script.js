/* =========================================================
   Teenager Theater — site scripts
   1) Mobile nav toggle (hamburger)
   2) Manual image carousel — autoplay intentionally disabled
   3) Contact form real-time validation (DOM manipulation)
   4) Footer year (small dynamic-content touch)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initCarousel();
  initContactForm();
  initFooterYear();
});

/* ---------- 1) Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu when a link is chosen
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 2) Manual carousel (no autoplay) ---------- */
function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  if (!track || slides.length === 0) return;

  let index = 0;

  // Build dot indicators dynamically
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));

  // Keyboard support when carousel has focus
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // NOTE: no setInterval anywhere here — autoplay is intentionally
  // turned off so visitors stay in control of the carousel.
  update();
}

/* ---------- 3) Contact form validation ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  const validators = {
    name: (value) => (value.trim().length >= 2 ? '' : 'Please enter your full name.'),
    email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address.'),
    message: (value) => (value.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'),
  };

  function showError(field, message) {
    const wrap = field.closest('.form-field');
    const errorEl = wrap.querySelector('.field-error');
    wrap.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(field) {
    const validate = validators[field.name];
    if (!validate) return true;
    const message = validate(field.value);
    showError(field, message);
    return message === '';
  }

  // Real-time validation as the visitor types / leaves a field
  Object.keys(validators).forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = Object.keys(validators).map((name) => form.elements[name]);
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      status.classList.remove('success');
      status.style.display = 'none';
      fields.find((f) => f.closest('.form-field').classList.contains('has-error'))?.focus();
      return;
    }

    // No backend wired up for this class project — simulate a
    // successful send and reset the form via the DOM.
    status.textContent = `Thanks, ${form.elements.name.value.trim()}! Your message has been sent — we'll reply soon.`;
    status.classList.add('success');
    form.reset();
  });
}

/* ---------- 4) Footer year ---------- */
function initFooterYear() {
  const el = document.querySelector('#current-year');
  if (el) el.textContent = new Date().getFullYear();
}
