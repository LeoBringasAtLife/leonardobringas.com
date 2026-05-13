import { dom, state } from './constants.js';
import { renderPostList } from './ui.js';
import { showView } from './router.js';

function postFromArticleLocale(article, lang) {
  const loc = article.locales?.[lang];
  if (!loc) return null;
  return {
    id: loc.id,
    lang,
    title: loc.title,
    titlePlain: loc.titlePlain,
    date: article.date,
    dateDisplay: loc.dateDisplay,
    dateArticle: loc.dateArticle,
    readTime: loc.readTime,
    summary: loc.summary,
    file: loc.file,
  };
}

export async function loadPosts() {
  try {
    const response = await fetch('posts/posts.json');
    if (!response.ok) throw new Error('No se pudo cargar el listado de posts');
    const articles = await response.json();
    state.currentPosts = articles
      .map((a) => postFromArticleLocale(a, state.language))
      .filter(Boolean);
    renderPostList(state.currentPosts, (slug) => showView('article', { slug }));
  } catch (error) {
    console.error('Error loading posts:', error);
    if (dom.postListContainer) {
      dom.postListContainer.innerHTML = `<p class="error">Error al cargar las publicaciones.</p>`;
    }
  }
}
