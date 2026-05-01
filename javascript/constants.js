export const SITE_TITLE = "Leonardo Bringas";
export const DEFAULT_TITLE = "Blog de Leonardo Bringas";
export const VALID_VIEWS = ['home', 'article', 'about'];

export const dom = {
  allLinks: () => document.querySelectorAll('[data-view]'),
  allViews: () => document.querySelectorAll('.view'),
  navLinks: () => document.querySelectorAll('.top nav .nav-link'),
  brandLink: document.querySelector('.nav-brand'),
  mainContent: document.getElementById('main-content'),
  postListContainer: document.getElementById('post-list-container'),
  viewArticle: document.getElementById('view-article'),
  viewAbout: document.getElementById('view-about'),
  sectionTitle: document.querySelector('.section-title'),
  btnEs: document.getElementById('btn-es'),
  btnEn: document.getElementById('btn-en'),
  metaDescription: document.getElementById('meta-description'),
  ogTitle: document.getElementById('og-title'),
  ogDescription: document.getElementById('og-description'),
  ogUrl: document.getElementById('og-url'),
  ogImage: document.getElementById('og-image'),
  ogLocale: document.getElementById('og-locale'),
  twitterTitle: document.getElementById('twitter-title'),
  twitterDescription: document.getElementById('twitter-description'),
  twitterImage: document.getElementById('twitter-image'),
};

export const translations = {
  es: {
    brand: "Blog de Leonardo Bringas",
    nav_blog: "Blog",
    nav_about: "Acerca de",
    section_posts: "Publicaciones",
    back_to_blog: "← Volver al blog",
    footer: "© 2026 Leonardo Bringas. Buenos Aires, Argentina.",
    loading_error: "Error al cargar las publicaciones.",
  },
  en: {
    brand: "Leonardo Bringas' Blog",
    nav_blog: "Blog",
    nav_about: "About",
    section_posts: "Posts",
    back_to_blog: "← Back to blog",
    footer: "© 2026 Leonardo Bringas. Buenos Aires, Argentina.",
    loading_error: "Error loading posts.",
  }
};

export let state = {
  currentPosts: [],
  language: localStorage.getItem('language') || 'es',
  currentView: 'home',
  currentSlug: null,
};
