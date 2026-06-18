import { dom, state } from './constants.js';
import { normalizeView } from './utils.js';
import { showView } from './router.js';
import { loadPosts } from './api.js';

dom.allLinks().forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showView(link.dataset.view);
  });
});

if (dom.brandLink) {
  dom.brandLink.addEventListener('click', event => {
    event.preventDefault();
    showView('home');
  });
}

window.addEventListener('scroll', () => {
  // Acciones adicionales al hacer scroll
}, { passive: true });

window.addEventListener('popstate', event => {
  const stateObj = event.state || {};
  let view = stateObj.view;
  let slug = stateObj.slug;

  if (!view) {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('/');
    view = parts[0];
    slug = parts[1];
  }

  showView(view, { slug, pushHistory: false, scrollToTop: false, focusMain: false });
});

(async function init() {
  const hash = window.location.hash.replace('#', '');
  const parts = hash.split('/');
  const hashView = parts[0];
  const slug = parts[1];

  state.currentView = normalizeView(hashView);
  state.currentSlug = slug;

  await loadPosts();
  showView(state.currentView, { slug, pushHistory: false });

  history.replaceState({ view: state.currentView, slug: state.currentSlug }, '', window.location.hash || window.location.pathname);
})();
