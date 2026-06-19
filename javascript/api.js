import { dom, state } from './constants.js';
import { renderPostList } from './ui.js';
import { showView } from './router.js';
import { renderPostListSkeleton } from './utils.js';

export async function loadPosts() {
  const container = dom.postListContainer;
  // #region agent log
  fetch('http://127.0.0.1:7529/ingest/43c216bf-730e-47ee-a7ba-b8385a005b2b', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '207ee8' }, body: JSON.stringify({ sessionId: '207ee8', location: 'api.js:loadPosts', message: 'start', data: { hasContainer: !!container }, hypothesisId: 'H5', timestamp: Date.now(), runId: 'pre-fix' }) }).catch(() => {});
  // #endregion

  if (container) {
    container.innerHTML = renderPostListSkeleton();
  }

  try {
    const response = await fetch('posts/posts.json');
    if (!response.ok) throw new Error('No se pudo cargar el listado de posts');
    state.currentPosts = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7529/ingest/43c216bf-730e-47ee-a7ba-b8385a005b2b', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '207ee8' }, body: JSON.stringify({ sessionId: '207ee8', location: 'api.js:loadPosts', message: 'fetch ok', data: { postCount: state.currentPosts?.length, status: response.status }, hypothesisId: 'H2', timestamp: Date.now(), runId: 'pre-fix' }) }).catch(() => {});
    // #endregion
    renderPostList(state.currentPosts, (s) => showView('article', { slug: s }));
  } catch (error) {
    console.error('Error loading posts:', error);
    // #region agent log
    fetch('http://127.0.0.1:7529/ingest/43c216bf-730e-47ee-a7ba-b8385a005b2b', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '207ee8' }, body: JSON.stringify({ sessionId: '207ee8', location: 'api.js:loadPosts', message: 'fetch fail', data: { message: error?.message }, hypothesisId: 'H2', timestamp: Date.now(), runId: 'pre-fix' }) }).catch(() => {});
    // #endregion
    if (container) {
      container.innerHTML = '<p class="error">Error al cargar las publicaciones.</p>';
    }
  }
}
