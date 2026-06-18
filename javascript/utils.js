import { VALID_VIEWS, dom, SITE_TITLE } from './constants.js';

export function normalizeView(viewId) {
  return VALID_VIEWS.includes(viewId) ? viewId : 'home';
}

export function renderSkeleton() {
  return `
    <article class="content">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
      <br>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
    </article>
  `;
}

export function updateSEO(post = null) {
  const currentUrl = window.location.href;
  const defaultDesc = "Blog personal de Leonardo Bringas sobre programación, IA, LLMs y reflexiones tecnológicas.";
  const defaultImg = "https://leonardobringas.com/images/leo.webp";

  const title = post ? `${post.titlePlain} | ${SITE_TITLE}` : SITE_TITLE;
  const description = post ? post.summary : defaultDesc;
  const image = post && post.image ? post.image : defaultImg;

  document.documentElement.lang = 'es';

  document.title = title;
  if (dom.metaDescription) dom.metaDescription.setAttribute('content', description);

  if (dom.ogTitle) dom.ogTitle.setAttribute('content', title);
  if (dom.ogDescription) dom.ogDescription.setAttribute('content', description);
  if (dom.ogUrl) dom.ogUrl.setAttribute('content', currentUrl);
  if (dom.ogImage) dom.ogImage.setAttribute('content', image);
  if (dom.ogLocale) dom.ogLocale.setAttribute('content', 'es_AR');

  if (dom.twitterTitle) dom.twitterTitle.setAttribute('content', title);
  if (dom.twitterDescription) dom.twitterDescription.setAttribute('content', description);
  if (dom.twitterImage) dom.twitterImage.setAttribute('content', image);
}

export function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
