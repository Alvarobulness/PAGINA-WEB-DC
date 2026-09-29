const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

navLinks.addEventListener('show.bs.collapse', () => {
  toggle.setAttribute('aria-label', 'Cerrar menú');
});

navLinks.addEventListener('hide.bs.collapse', () => {
  toggle.setAttribute('aria-label', 'Abrir menú');
});

navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 980px)').matches) {
      bootstrap.Collapse.getOrCreateInstance(navLinks).hide();
    }
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.counter);
    const duration = 900;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      el.textContent = Math.round(target * progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));

const form = document.getElementById('contactForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  const original = button.textContent;
  const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

  button.textContent = 'Enviando…';
  button.disabled = true;
  status.textContent = '';
  status.className = 'form-status';

  try {
    const formData = new FormData(form);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    if (!response.ok) throw new Error('No se pudo enviar el formulario');

    form.reset();
    status.textContent = 'Tu consulta se ha enviado correctamente. Nos pondremos en contacto contigo lo antes posible.';
    status.classList.add('success');
  } catch (error) {
    status.textContent = 'No hemos podido enviar tu consulta. Inténtalo de nuevo o escríbenos a cazalloasesoramiento@gmail.com.';
    status.classList.add('error');
  } finally {
    button.textContent = original;
    button.disabled = false;
  }
});
