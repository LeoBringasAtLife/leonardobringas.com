import { dom, state } from './constants.js';
import { normalizeView, isAllowedArticleSlug } from './utils.js';
import { showView } from './router.js';
import { loadPosts } from './api.js';

dom.allLinks().forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showView(link.dataset.view);
  });
});

if (dom.brandLink) {
  dom.brandLink.addEventListener('click', (event) => {
    event.preventDefault();
    showView('home');
  });
}

window.addEventListener('popstate', () => {
  const stateObj = history.state || {};
  let view = stateObj.view;
  let slug = stateObj.slug;

  if (!view) {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('/');
    view = parts[0];
    slug = parts[1];
  }

  const navigationChanged =
    normalizeView(view) !== state.currentView || (slug || null) !== state.currentSlug;

  showView(view, {
    slug,
    pushHistory: false,
    scrollToTop: navigationChanged,
    focusMain: false,
  });
});

function urlForView(view, slug) {
  if (view === 'home') return window.location.pathname;
  if (view === 'article' && slug) return `#article/${slug}`;
  return `#${view}`;
}

(async function init() {
  const hash = window.location.hash.replace('#', '');
  const parts = hash.split('/');
  const hashView = parts[0];
  let slug = parts[1] || null;
  let view = normalizeView(hashView);

  try {
    await loadPosts();

    if (view === 'article' && !isAllowedArticleSlug(slug, state.currentPosts)) {
      view = 'home';
      slug = null;
    }

    showView(view, { slug, pushHistory: false });
  } catch (error) {
    console.error('Init error:', error);
    if (dom.postListContainer) {
      dom.postListContainer.innerHTML = '<p class="error">Error al iniciar el blog.</p>';
    }
    showView('home', { pushHistory: false });
  }

  history.replaceState(
    { view: state.currentView, slug: state.currentSlug },
    '',
    urlForView(state.currentView, state.currentSlug)
  );
})();
