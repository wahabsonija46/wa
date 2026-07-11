// Shared behavior for navigation, theme switching, search, and scroll effects.
const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const mobileToggle = document.querySelector('[data-mobile-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
const searchInput = document.querySelector('[data-search-input]');
const suggestions = document.querySelector('[data-search-suggestions]');
const progressBar = document.querySelector('[data-progress-bar]');
const backToTop = document.querySelector('[data-back-to-top]');
const modal = document.querySelector('[data-newsletter-modal]');
const closeModal = document.querySelector('[data-close-modal]');

const savedTheme = localStorage.getItem('money-master-theme') || 'light';
root.setAttribute('data-theme', savedTheme);
if (themeToggle) {
  themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');
  themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

function toggleTheme() {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('money-master-theme', current);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', current === 'dark');
    themeToggle.innerHTML = current === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileToggle && navLinks) mobileToggle.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));

const suggestionsData = [
  'How to Start a Blog',
  'Affiliate Marketing Guide',
  'Google AdSense Guide',
  'Earn with AI',
  'Freelancing for Beginners',
  'Best AI Tools',
  'SEO Basics',
  'Passive Income Ideas'
];

if (searchInput && suggestions) {
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    if (!query) {
      suggestions.style.display = 'none';
      return;
    }
    const filtered = suggestionsData.filter(item => item.toLowerCase().includes(query));
    suggestions.innerHTML = filtered.length ? filtered.map(item => `<a href="blog.html">${item}</a>`).join('') : '<a href="blog.html">No results yet. Browse the blog.</a>';
    suggestions.style.display = 'block';
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-box')) suggestions.style.display = 'none';
  });
}

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (backToTop) backToTop.classList.toggle('show', scrollTop > 600);
});

if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => observer.observe(item));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = Number(el.dataset.counter);
      let current = 0;
      const interval = setInterval(() => {
        current += Math.max(1, Math.round(target / 30));
        if (current >= target) {
          el.textContent = `${target}+`;
          clearInterval(interval);
        } else {
          el.textContent = `${current}+`;
        }
      }, 45);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
counters.forEach(counter => counterObserver.observe(counter));

const shareButtons = document.querySelectorAll('[data-share]');
shareButtons.forEach(button => button.addEventListener('click', async () => {
  const url = window.location.href;
  try { await navigator.clipboard.writeText(url); button.innerHTML = '<i class="fa-solid fa-check"></i>'; } catch { window.prompt('Copy this link', url); }
}));

const openModalButtons = document.querySelectorAll('[data-open-modal]');
openModalButtons.forEach(button => button.addEventListener('click', () => modal.classList.add('open')));
if (closeModal) closeModal.addEventListener('click', () => modal.classList.remove('open'));
if (modal) modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.remove('open'); });

setTimeout(() => {
  if (modal) modal.classList.add('open');
}, 1600);
