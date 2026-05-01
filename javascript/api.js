import { dom, state } from './constants.js';
import { renderPostList } from './ui.js';
import { showView } from './router.js';

export async function loadPosts() {
  try {
    const response = await fetch('posts/posts.json');
    if (!response.ok) throw new Error('No se pudo cargar el listado de posts');
    const posts = await response.json();
    state.currentPosts = posts.filter(p => p.lang === state.language);
    renderPostList(state.currentPosts, (slug) => showView('article', { slug }));
  } catch (error) {
    console.error('Error loading posts:', error);
    if (dom.postListContainer) {
      dom.postListContainer.innerHTML = `<p class="error">Error al cargar las publicaciones.</p>`;
    }
  }
}
