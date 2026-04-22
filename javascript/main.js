const allLinks = document.querySelectorAll('[data-view]');
const allViews = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.top nav .nav-link');
const brandLink = document.querySelector('.nav-brand');
const mainContent = document.getElementById('main-content');
const readingProgressBar = document.getElementById('reading-progress-bar');

const VALID_VIEWS = ['home', 'article', 'about'];

function normalizeView(viewId) {
  return VALID_VIEWS.includes(viewId) ? viewId : 'home';
}

function updateReadingProgress(activeView) {
  if (!readingProgressBar) return;

  if (activeView !== 'article') {
    readingProgressBar.style.width = '0';
    return;
  }

  const article = document.querySelector('#view-article article');
  if (!article) return;

  const articleRect = article.getBoundingClientRect();
  const articleTop = window.scrollY + articleRect.top;
  const maxScrollable = Math.max(article.offsetHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max((window.scrollY - articleTop) / maxScrollable, 0), 1);
  readingProgressBar.style.width = `${Math.round(progress * 100)}%`;
}

function showView(viewId, options = {}) {
  const settings = {
    pushHistory: true,
    scrollToTop: true,
    focusMain: true,
    ...options,
  };

  const normalizedView = normalizeView(viewId);

  allViews.forEach(view => view.classList.remove('active'));

  const target = document.getElementById(`view-${normalizedView}`);
  if (target) target.classList.add('active');

  navLinks.forEach(link => {
    const isActive = link.dataset.view === normalizedView;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (settings.scrollToTop) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  if (settings.focusMain && mainContent) {
    mainContent.focus();
  }

  if (settings.pushHistory) {
    history.pushState({ view: normalizedView }, '', `#${normalizedView}`);
  }

  updateReadingProgress(normalizedView);
}

allLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showView(link.dataset.view);
  });
});

if (brandLink) {
  brandLink.addEventListener('click', event => {
    event.preventDefault();
    showView('home');
  });
}

window.addEventListener('scroll', () => {
  const activeView = document.querySelector('.view.active');
  const currentId = activeView ? activeView.id.replace('view-', '') : 'home';
  updateReadingProgress(currentId);
}, { passive: true });

window.addEventListener('popstate', event => {
  const stateView = event.state && event.state.view ? event.state.view : window.location.hash.replace('#', '');
  showView(stateView, { pushHistory: false, scrollToTop: false, focusMain: false });
});

(function init() {
  const hashView = window.location.hash.replace('#', '');
  const initialView = normalizeView(hashView);

  showView(initialView, { pushHistory: false, scrollToTop: false, focusMain: false });
  history.replaceState({ view: initialView }, '', `#${initialView}`);
})();
