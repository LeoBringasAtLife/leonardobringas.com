# AGENT.md — leonardobringas.com

Guía para asistentes de código y personas que mantienen este repositorio. **Fuente de verdad:** el código y los archivos en el árbol; si algo diverge de este documento, prevalece el repo.

## Qué es el proyecto

Sitio web **estático** del blog personal **Leonardo Bringas** (dominio público: `leonardobringas.com`). Contenido en **español**. Una sola página shell (`index.html`) y navegación tipo SPA con **hash + History API**: no hay servidor de aplicaciones ni bundler en el cliente.

## Stack

- **HTML5** (vistas en `index.html`, fragmentos en `posts/` y `pages/`).
- **CSS** modular importado desde `css/styles.css` (sin preprocesador).
- **JavaScript** en **módulos ES** (`import` / `export`), entrada `javascript/main.js`.
- **Despliegue:** GitHub Actions → GitHub Pages (`.github/workflows/static.yml`): copia solo `css/`, `images/`, `javascript/`, `pages/`, `posts/` e `index.html` a `_site/` antes de publicar.

No hay `package.json`: las rutas `fetch()` deben resolver contra la **raíz del sitio** tal como se sirve en producción.

## Estructura de directorios (resumen)

| Ruta | Rol |
|------|-----|
| `index.html` | Shell: meta SEO, CSP, header, nav, tres `<section class="view">`, footer, script `type="module"`. |
| `javascript/` | Estado, router, carga de posts, UI de lista, SEO y validación de slugs. |
| `posts/` | Artículos `*.html` (fragmento `<article>`) y `posts.json` (metadatos planos). |
| `pages/` | Páginas bajo demanda: `about.html`. |
| `css/` | Hojas parciales + `styles.css` con `@import`. |
| `images/` | Favicon, foto de perfil, `posts-images/`. |
| `.github/workflows/` | CI/CD hacia Pages. |

## Flujo de ejecución

1. El navegador carga `index.html` y ejecuta `javascript/main.js`.
2. `init()` lee `location.hash`, normaliza la vista y guarda `slug` si aplica.
3. `loadPosts()` muestra skeleton en la lista, hace `fetch('posts/posts.json')` y renderiza `#post-list-container`.
4. `showView()` activa la vista, historial, SEO y carga artículo o página según corresponda.

## Vistas y rutas

Vistas válidas (`VALID_VIEWS`): `home`, `article`, `about`.

- **Inicio:** hash vacío → `home`. Enlaces del nav usan `/` o hash coherente.
- **Artículo:** `#article/{slug}` (ej. `#article/opencode`). HTML vía `fetch('posts/{file}')` donde `file` viene de `posts.json` (`file` o `{id}.html`).
- **Acerca de:** `#about` → `pages/about.html`.

**Historial:** `history.pushState({ view, slug })`. `popstate` re-sincroniza; hace scroll al inicio si cambió vista o slug.

**Slugs:** solo `[a-z0-9-]+` y deben existir en `state.currentPosts` (`isAllowedArticleSlug` en `utils.js`).

## `posts/posts.json` — esquema

Array de objetos planos:

```json
{
  "date": "YYYY-MM-DD",
  "id": "slug-url",
  "title": "Título con formato",
  "titlePlain": "Título corto SEO",
  "dateDisplay": "Texto lista",
  "dateArticle": "Texto en artículo",
  "readTime": "N minutos de lectura",
  "summary": "Extracto para lista y meta description",
  "file": "archivo.html"
}
```

- **`id`:** slug en la URL; debe coincidir con el stem del HTML salvo que `file` indique otro nombre.
- **`file`:** ruta bajo `posts/` usada por el router (obligatorio para claridad).

### Checklist: nuevo post

1. Crear `posts/{id}.html` con `<article class="content">`, `back-link` a `/`, enlaces externos con `rel="noopener noreferrer"` si `target="_blank"`.
2. Añadir entrada en `posts.json`.
3. Imágenes en `images/posts-images/` con rutas desde la raíz del sitio; preferir `width`/`height` en `<img>` para reducir CLS.

## SEO

`updateSEO(post, view, slug)` actualiza `document.title`, meta description, Open Graph, Twitter, **`link[rel=canonical]`**, `og:type` (website vs article) y JSON-LD (`WebSite` o `BlogPosting` en `#ld-json`). URL canónica base: `SITE_ORIGIN` en `constants.js`.

## CSS

`styles.css` importa: `variables.css` (incluye `prefers-color-scheme: dark`), `base.css`, `typography.css`, `layout.css`, `components.css`, `syntax.css`.

## Módulos JavaScript

```
main.js → constants, utils, router, api
api.js → constants, ui, router, utils
router.js → constants, utils (AbortController en artículos)
ui.js → constants, utils (prefetch al hover)
utils.js → constants
```

`state` mutable en `constants.js`: `currentPosts`, `currentView`, `currentSlug`.

## Seguridad (cliente)

- CSP en meta en `index.html`.
- Slugs validados antes de `fetch`.
- Mensajes de error escapados con `escapeHTML`.
- Contenido de posts es HTML de confianza del repo (insertado con `innerHTML`).

## Cómo probar en local

Servir la raíz del repo (`npx serve .`, `python -m http.server`). Evitar `file://` por módulos y `fetch`.

---

*Documento alineado con el árbol del repositorio (solo español, sin i18n).*
