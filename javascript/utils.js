import { VALID_VIEWS, dom, SITE_TITLE, SITE_ORIGIN } from './constants.js';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeView(viewId) {
  return VALID_VIEWS.includes(viewId) ? viewId : 'home';
}

export function isAllowedArticleSlug(slug, posts) {
  if (!slug || !SLUG_PATTERN.test(slug)) return false;
  return posts.some((p) => p.id === slug);
}

export function articleFileForPost(slug, posts) {
  const post = posts.find((p) => p.id === slug);
  return post?.file || `${slug}.html`;
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

export function renderPostListSkeleton(count = 3) {
  return Array.from({ length: count }, () => `
    <li class="post-item post-item--skeleton" aria-hidden="true">
      <div class="skeleton skeleton-text short post-skeleton-date"></div>
      <div class="skeleton skeleton-title post-skeleton-title"></div>
      <div class="skeleton skeleton-text post-skeleton-excerpt"></div>
    </li>
  `).join('');
}

function canonicalUrlForView(view, slug) {
  if (view === 'article' && slug) {
    return `${SITE_ORIGIN}/#article/${slug}`;
  }
  if (view === 'about') {
    return `${SITE_ORIGIN}/#about`;
  }
  return `${SITE_ORIGIN}/`;
}

function setStructuredData(post, canonicalUrl) {
  if (!dom.ldJson) return;

  const data = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.titlePlain,
        name: post.title,
        datePublished: post.date,
        description: post.summary,
        author: { '@type': 'Person', name: 'Leonardo Bringas' },
        publisher: { '@type': 'Person', name: 'Leonardo Bringas' },
        mainEntityOfPage: canonicalUrl,
        image: post.image || `${SITE_ORIGIN}/images/leo.webp`,
        inLanguage: 'es',
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Blog de Leonardo Bringas',
        url: SITE_ORIGIN,
        description: 'Blog personal de Leonardo Bringas sobre programación e IA.',
        author: { '@type': 'Person', name: 'Leonardo Bringas' },
        inLanguage: 'es',
      };

  dom.ldJson.textContent = JSON.stringify(data);
}

export function updateSEO(post = null, view = 'home', slug = null) {
  const canonicalUrl = canonicalUrlForView(view, slug);
  const defaultDesc = 'Blog personal de Leonardo Bringas sobre programación, IA, LLMs y reflexiones tecnológicas.';
  const defaultImg = `${SITE_ORIGIN}/images/leo.webp`;

  const title = post ? `${post.titlePlain} | ${SITE_TITLE}` : `Blog de ${SITE_TITLE}`;
  const description = post ? post.summary : defaultDesc;
  const image = post?.image ? post.image : defaultImg;

  document.documentElement.lang = 'es';
  document.title = title;

  if (dom.canonicalLink) dom.canonicalLink.setAttribute('href', canonicalUrl);
  if (dom.metaDescription) dom.metaDescription.setAttribute('content', description);

  if (dom.ogType) dom.ogType.setAttribute('content', post ? 'article' : 'website');
  if (dom.ogTitle) dom.ogTitle.setAttribute('content', title);
  if (dom.ogDescription) dom.ogDescription.setAttribute('content', description);
  if (dom.ogUrl) dom.ogUrl.setAttribute('content', canonicalUrl);
  if (dom.ogImage) dom.ogImage.setAttribute('content', image);
  if (dom.ogLocale) dom.ogLocale.setAttribute('content', 'es_AR');

  if (dom.twitterTitle) dom.twitterTitle.setAttribute('content', title);
  if (dom.twitterDescription) dom.twitterDescription.setAttribute('content', description);
  if (dom.twitterImage) dom.twitterImage.setAttribute('content', image);

  setStructuredData(post, canonicalUrl);
}

export function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

export function initCopyableCodeBlocks(root) {
  if (!root) return;

  root.querySelectorAll('.code-copy').forEach((block) => {
    const btn = block.querySelector('.code-copy-btn');
    const code = block.querySelector('code');
    if (!btn || !code || btn.dataset.copyBound === '1') return;

    btn.dataset.copyBound = '1';
    const defaultLabel = btn.textContent.trim() || 'Copiar';
    const defaultAria = btn.getAttribute('aria-label') || defaultLabel;

    btn.addEventListener('click', async () => {
      const text = code.textContent?.trim() ?? '';
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copiado';
        btn.classList.add('is-copied');
        btn.setAttribute('aria-label', 'Comando copiado al portapapeles');
        window.setTimeout(() => {
          btn.textContent = defaultLabel;
          btn.classList.remove('is-copied');
          btn.setAttribute('aria-label', defaultAria);
        }, 2000);
      } catch {
        btn.textContent = 'No se pudo copiar';
        window.setTimeout(() => {
          btn.textContent = defaultLabel;
        }, 2000);
      }
    });
  });
}
