import { dom, state, translations } from './constants.js';
import { normalizeView } from './utils.js';
import { showView } from './router.js';
import { loadPosts } from './api.js';

// --- i18n Logic ---
function updateLanguageUI() {
  const t = translations[state.language];
  
  // Update static elements
  if (dom.brandLink) dom.brandLink.textContent = t.brand;
  
  const navLinks = dom.navLinks();
  if (navLinks[0]) navLinks[0].textContent = t.nav_blog;
  if (navLinks[1]) navLinks[1].textContent = t.nav_about;
  
  if (dom.sectionTitle) dom.sectionTitle.textContent = t.section_posts;
  
  const footer = document.querySelector('footer p');
  if (footer) footer.textContent = t.footer;

  // Update switcher active state
  if (dom.btnEs) dom.btnEs.classList.toggle('active', state.language === 'es');
  if (dom.btnEn) dom.btnEn.classList.toggle('active', state.language === 'en');
  
  // Smart content reload
  if (state.currentView === 'article' && state.currentSlug) {
    const baseId = state.currentSlug.replace('-en', '');
    const newSlug = state.language === 'en' ? `${baseId}-en` : baseId;
    showView('article', { slug: newSlug });
  } else {
    showView(state.currentView);
  }

  // Reload posts list (for home view)
  loadPosts();
}

function setLanguage(lang) {
  if (state.language === lang) return;
  state.language = lang;
  localStorage.setItem('language', lang);
  updateLanguageUI();
}

// Event Listeners Globales
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

if (dom.btnEs) dom.btnEs.addEventListener('click', () => setLanguage('es'));
if (dom.btnEn) dom.btnEn.addEventListener('click', () => setLanguage('en'));

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

// Inicialización
(async function init() {
  const hash = window.location.hash.replace('#', '');
  const parts = hash.split('/');
  const hashView = parts[0];
  const slug = parts[1];
  
  const initialView = normalizeView(hashView);

  // Set initial language UI
  updateLanguageUI();

  showView(initialView, { slug, pushHistory: false, scrollToTop: false, focusMain: false });
  history.replaceState({ view: initialView, slug }, '', window.location.hash || window.location.pathname);
})();
