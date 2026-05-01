import { VALID_VIEWS, dom, state, SITE_TITLE } from './constants.js';

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
  const isEn = state.language === 'en';
  
  // Textos por defecto localizados
  const defaultDesc = isEn 
    ? "Leonardo Bringas' personal blog about programming, AI, and tech reflections."
    : "Blog personal de Leonardo Bringas sobre programación, IA, LLMs y reflexiones tecnológicas.";
  
  const defaultImg = "https://leonardobringas.com/images/leo.webp";

  const title = post ? `${post.titlePlain} | ${SITE_TITLE}` : SITE_TITLE;
  const description = post ? post.summary : defaultDesc;
  const image = post && post.image ? post.image : defaultImg;
  const locale = isEn ? 'en_US' : 'es_AR';

  // Actualizar atributo lang del HTML para accesibilidad
  document.documentElement.lang = state.language;

  // Actualizar etiquetas estándar
  document.title = title;
  if (dom.metaDescription) dom.metaDescription.setAttribute('content', description);

  // Actualizar Open Graph
  if (dom.ogTitle) dom.ogTitle.setAttribute('content', title);
  if (dom.ogDescription) dom.ogDescription.setAttribute('content', description);
  if (dom.ogUrl) dom.ogUrl.setAttribute('content', currentUrl);
  if (dom.ogImage) dom.ogImage.setAttribute('content', image);
  if (dom.ogLocale) dom.ogLocale.setAttribute('content', locale);

  // Actualizar Twitter
  if (dom.twitterTitle) dom.twitterTitle.setAttribute('content', title);
  if (dom.twitterDescription) dom.twitterDescription.setAttribute('content', description);
  if (dom.twitterImage) dom.twitterImage.setAttribute('content', image);
}
