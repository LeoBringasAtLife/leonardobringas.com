export const SITE_TITLE = "Leonardo Bringas";
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

export let state = {
  currentPosts: [],
  currentView: 'home',
  currentSlug: null,
};
