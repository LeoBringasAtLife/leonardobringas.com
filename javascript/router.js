import { dom, state, SITE_TITLE, DEFAULT_TITLE, translations } from './constants.js';
import { normalizeView, renderSkeleton, updateSEO } from './utils.js';

export async function fetchArticle(slug) {
  if (dom.viewArticle) {
    dom.viewArticle.innerHTML = renderSkeleton();
  }
  
  try {
    const response = await fetch(`posts/${slug}.html`);
    if (!response.ok) throw new Error('No se pudo cargar el artículo');
    const html = await response.text();
    
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
    }
  } catch (error) {
    console.error('Error loading article:', error);
    if (dom.viewArticle) {
      dom.viewArticle.innerHTML = `<p class="error">${translations[state.language].loading_error}: ${error.message}</p>`;
    }
  }
}

export async function fetchPage(pageName, targetElement) {
  if (!targetElement) return;
  targetElement.innerHTML = renderSkeleton();
  
  try {
    const response = await fetch(`pages/${pageName}.html`);
    if (!response.ok) throw new Error(`No se pudo cargar la página ${pageName}`);
    const html = await response.text();
    targetElement.innerHTML = html;
  } catch (error) {
    console.error('Error loading page:', error);
    targetElement.innerHTML = `<p class="error">${translations[state.language].loading_error}</p>`;
  }
}

export async function showView(viewId, options = {}) {
  const settings = {
    pushHistory: true,
    scrollToTop: true,
    focusMain: true,
    ...options,
  };

  const normalizedView = normalizeView(viewId);
  state.currentView = normalizedView;
  state.currentSlug = options.slug || null;

  dom.allViews().forEach(view => view.classList.remove('active'));

  const target = document.getElementById(`view-${normalizedView}`);
  if (target) target.classList.add('active');

  dom.navLinks().forEach(link => {
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

  if (settings.focusMain && dom.mainContent) {
    dom.mainContent.focus();
  }

  if (settings.pushHistory) {
    const hash = normalizedView === 'home' ? '' : `#${normalizedView}`;
    const url = normalizedView === 'article' && options.slug ? `${hash}/${options.slug}` : hash;
    history.pushState({ view: normalizedView, slug: options.slug }, '', url || window.location.pathname);
  }

  if (normalizedView === 'article' && options.slug) {
    fetchArticle(options.slug);
    
    const post = state.currentPosts.find(p => p.id === options.slug);
    updateSEO(post);
  } else if (normalizedView === 'about') {
    const aboutFile = state.language === 'en' ? 'about_en' : 'about';
    fetchPage(aboutFile, dom.viewAbout);
    updateSEO();
  } else {
    updateSEO();
  }
}
