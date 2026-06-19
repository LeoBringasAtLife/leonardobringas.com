export const SITE_TITLE = "Leonardo Bringas";
export const SITE_ORIGIN = "https://leonardobringas.com";
export const VALID_VIEWS = ['home', 'article', 'about'];

function el(id) {
  return document.getElementById(id);
}

export const dom = {
  allLinks: () => document.querySelectorAll('[data-view]'),
  allViews: () => document.querySelectorAll('.view'),
  navLinks: () => document.querySelectorAll('.top nav .nav-link'),
  get brandLink() { return document.querySelector('.nav-brand'); },
  get mainContent() { return el('main-content'); },
  get postListContainer() { return el('post-list-container'); },
  get viewArticle() { return el('view-article'); },
  get viewAbout() { return el('view-about'); },
  get sectionTitle() { return document.querySelector('.section-title'); },
  get canonicalLink() { return el('canonical-link'); },
  get ldJson() { return el('ld-json'); },
  get metaDescription() { return el('meta-description'); },
  get ogType() { return el('og-type'); },
  get ogTitle() { return el('og-title'); },
  get ogDescription() { return el('og-description'); },
  get ogUrl() { return el('og-url'); },
  get ogImage() { return el('og-image'); },
  get ogLocale() { return el('og-locale'); },
  get twitterTitle() { return el('twitter-title'); },
  get twitterDescription() { return el('twitter-description'); },
  get twitterImage() { return el('twitter-image'); },
};

export let state = {
  currentPosts: [],
  currentView: 'home',
  currentSlug: null,
};
