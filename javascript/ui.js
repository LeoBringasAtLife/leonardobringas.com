import { dom } from './constants.js';

export function renderPostList(posts, onPostClick) {
  const container = dom.postListContainer;
  if (!container) return;

  container.innerHTML = posts.map(post => `
    <li class="post-item">
      <time class="post-date" datetime="${post.date}">${post.dateDisplay}</time>
      <h3 class="post-title">
        <a href="#article/${post.id}" data-slug="${post.id}" class="post-link">${post.title}</a>
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
