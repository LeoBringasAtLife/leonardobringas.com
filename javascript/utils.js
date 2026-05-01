import { VALID_VIEWS } from './constants.js';

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
