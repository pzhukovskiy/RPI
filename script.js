// Инициализация года в футере
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Бургер-меню
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('nav__menu--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Плавный скролл
const links = document.querySelectorAll('a[href^="#"]');
links.forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navMenu?.classList.remove('nav__menu--open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Модалка портфолио
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

function openModal(src, caption) {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  if (modalImg) modalImg.src = src;
  if (modalCaption) modalCaption.textContent = caption || '';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  if (modalImg) modalImg.src = '';
  document.body.style.overflow = '';
}

if (modal) {
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.work').forEach((el) => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      const caption = el.getAttribute('data-caption') || el.querySelector('figcaption')?.textContent || '';
      if (img) openModal(img.src, caption);
    });
    el.addEventListener('keypress', (e) => { if (e.key === 'Enter') el.click(); });
  });
}

// Кнопка "вверх"
const toTop = document.getElementById('toTop');
if (toTop) {
  const toggleToTop = () => {
    if (window.scrollY > 600) toTop.classList.add('to-top--visible');
    else toTop.classList.remove('to-top--visible');
  };
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Валидация формы
const form = document.getElementById('contactForm');
if (form) {
  const showError = (name, text) => {
    const span = form.querySelector(`.form__error[data-for="${name}"]`);
    if (span) span.textContent = text || '';
  };
  const validators = {
    name: (v) => v.trim().length >= 2 || 'Укажите имя (мин. 2 символа)',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Некорректный email',
    message: (v) => v.trim().length >= 10 || 'Опишите задачу (мин. 10 символов)'
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ['name','email','message'].forEach((field) => {
      const input = form.querySelector(`#${field}`);
      const value = input?.value || '';
      const result = validators[field](value);
      if (result !== true) { ok = false; showError(field, result); }
      else showError(field, '');
    });

    if (ok) {
      const success = document.getElementById('formSuccess');
      if (success) success.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
      form.reset();
      setTimeout(() => { if (success) success.textContent = ''; }, 4000);
    }
  });

  form.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('input', () => {
      const name = el.getAttribute('name');
      const result = validators[name](el.value);
      showError(name, result === true ? '' : result);
    });
  });
}
