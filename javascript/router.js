import { dom, state } from './constants.js';
import {
  normalizeView,
  renderSkeleton,
  updateSEO,
  escapeHTML,
  isAllowedArticleSlug,
  articleFileForPost,
  initCopyableCodeBlocks,
} from './utils.js';

let articleFetchController = null;

export async function fetchArticle(slug) {
  if (articleFetchController) {
    articleFetchController.abort();
  }
  articleFetchController = new AbortController();
  const { signal } = articleFetchController;

  if (dom.viewArticle) {
    dom.viewArticle.innerHTML = renderSkeleton();
  }

  const file = articleFileForPost(slug, state.currentPosts);

  try {
    const response = await fetch(`posts/${file}`, { signal });
    if (!response.ok) throw new Error('No se pudo cargar el artículo');
    const html = await response.text();

    if (signal.aborted) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const content = doc.querySelector('article') || doc.body;

    if (dom.viewArticle) {
      dom.viewArticle.innerHTML = content.outerHTML;

      const backLink = dom.viewArticle.querySelector('.back-link');
      if (backLink) {
        backLink.addEventListener('click', (e) => {
          e.preventDefault();
          showView('home');
        });
      }

      initCopyableCodeBlocks(dom.viewArticle);
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error('Error loading article:', error);
    if (dom.viewArticle) {
      const msg = escapeHTML(error.message || 'Error desconocido');
      dom.viewArticle.innerHTML = `<p class="error">Error al cargar el artículo: ${msg}</p>`;
    }
  }
}

export async function fetchPage(pageName, targetElement) {
  if (!targetElement) return;
  if (!/^[a-z]+$/.test(pageName)) return;

  targetElement.innerHTML = renderSkeleton();

  try {
    const response = await fetch(`pages/${pageName}.html`);
    if (!response.ok) throw new Error(`No se pudo cargar la página ${pageName}`);
    const html = await response.text();
    targetElement.innerHTML = html;
  } catch (error) {
    console.error('Error loading page:', error);
    targetElement.innerHTML = '<p class="error">Error al cargar la página Acerca de.</p>';
  }
}

export async function showView(viewId, options = {}) {
  const settings = {
    pushHistory: true,
    scrollToTop: true,
    focusMain: true,
    ...options,
  };

  let normalizedView = normalizeView(viewId);
  let slug = options.slug || null;

  if (normalizedView === 'article') {
    if (!isAllowedArticleSlug(slug, state.currentPosts)) {
      normalizedView = 'home';
      slug = null;
    }
  }

  state.currentView = normalizedView;
  state.currentSlug = slug;

  dom.allViews().forEach((view) => view.classList.remove('active'));

  const target = document.getElementById(`view-${normalizedView}`);
  if (target) target.classList.add('active');

  dom.navLinks().forEach((link) => {
    const linkView = link.dataset.view;
    const isActive =
      linkView === normalizedView ||
      (linkView === 'home' && normalizedView === 'article');
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

  if (settings.focusMain && dom.mainContent) {
    dom.mainContent.focus();
  }

  if (settings.pushHistory) {
    const hash = normalizedView === 'home' ? '' : `#${normalizedView}`;
    const url = normalizedView === 'article' && slug ? `${hash}/${slug}` : hash;
    history.pushState({ view: normalizedView, slug }, '', url || window.location.pathname);
  }

  if (normalizedView === 'article' && slug) {
    fetchArticle(slug);
    const post = state.currentPosts.find((p) => p.id === slug);
    updateSEO(post, 'article', slug);
  } else if (normalizedView === 'about') {
    fetchPage('about', dom.viewAbout);
    updateSEO(null, 'about');
  } else {
    updateSEO(null, 'home');
  }

  // #region agent log
  fetch('http://127.0.0.1:7529/ingest/43c216bf-730e-47ee-a7ba-b8385a005b2b', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '207ee8' }, body: JSON.stringify({ sessionId: '207ee8', location: 'router.js:showView', message: 'view applied', data: { normalizedView, slug, activeId: document.querySelector('.view.active')?.id }, hypothesisId: 'H3', timestamp: Date.now(), runId: 'pre-fix' }) }).catch(() => {});
  // #endregion
}
