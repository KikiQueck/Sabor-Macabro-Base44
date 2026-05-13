// ====== NAVBAR TOGGLE ======
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navbar-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Close nav on link click
  document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav && nav.classList.remove('open');
    });
  });

  // ====== SCROLL ANIMATIONS ======
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

  // ====== CATALOG FILTER ======
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.catalog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'todos' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // ====== RECIPE ACCORDION ======
  document.querySelectorAll('.btn-receita').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.recipe-card');
      const content = card.querySelector('.recipe-expand');
      if (!content) return;
      const isOpen = content.classList.contains('open');
      document.querySelectorAll('.recipe-expand.open').forEach(c => c.classList.remove('open'));
      if (!isOpen) content.classList.add('open');
      const arrow = btn.querySelector('.arrow');
      document.querySelectorAll('.arrow').forEach(a => a.style.transform = '');
      if (!isOpen && arrow) arrow.style.transform = 'rotate(180deg)';
    });
  });

  // ====== CONTACT FORM ======
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.textContent = '✓ Mensagem Enviada ao Vazio!';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.textContent = '✦ Enviar Mensagem ao Vazio';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }
});
