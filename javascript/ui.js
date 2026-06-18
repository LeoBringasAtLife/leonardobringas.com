import { dom } from './constants.js';
import { escapeHTML } from './utils.js';

export function renderPostList(posts, onPostClick) {
  const container = dom.postListContainer;
  if (!container) return;

  container.innerHTML = posts.map(post => `
    <li class="post-item">
      <time class="post-date" datetime="${escapeHTML(post.date)}">${escapeHTML(post.dateDisplay)}</time>
      <h3 class="post-title">
        <a href="#article/${escapeHTML(post.id)}" data-slug="${escapeHTML(post.id)}" class="post-link">${escapeHTML(post.title)}</a>
      </h3>
    </li>
  `).join('');

  // Agregar event listeners a los links de los posts
  container.querySelectorAll('.post-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onPostClick) onPostClick(link.dataset.slug);
    });
  });
}

