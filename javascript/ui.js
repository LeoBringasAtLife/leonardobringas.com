import { dom } from './constants.js';
import { escapeHTML } from './utils.js';

const prefetchedArticles = new Set();

export function prefetchArticle(post) {
  if (!post?.id) return;
  const file = post.file || `${post.id}.html`;
  if (prefetchedArticles.has(file)) return;
  prefetchedArticles.add(file);
  fetch(`posts/${file}`).catch(() => {});
}

export function renderPostList(posts, onPostClick) {
  const container = dom.postListContainer;
  if (!container) return;

  container.innerHTML = posts.map((post) => `
    <li class="post-item">
      <p class="post-meta-line">
        <time class="post-date" datetime="${escapeHTML(post.date)}">${escapeHTML(post.dateDisplay)}</time>
        ${post.readTime ? `<span class="post-read-time">${escapeHTML(post.readTime)}</span>` : ''}
      </p>
      <h3 class="post-title">
        <a href="#article/${escapeHTML(post.id)}" data-slug="${escapeHTML(post.id)}" class="post-link">${escapeHTML(post.title)}</a>
      </h3>
      ${post.summary ? `<p class="post-excerpt">${escapeHTML(post.summary)}</p>` : ''}
    </li>
  `).join('');

  container.querySelectorAll('.post-link').forEach((link) => {
    const slug = link.dataset.slug;
    const post = posts.find((p) => p.id === slug);

    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onPostClick) onPostClick(slug);
    });

    link.addEventListener('mouseenter', () => {
      if (post) prefetchArticle(post);
    }, { once: true });
  });
}
