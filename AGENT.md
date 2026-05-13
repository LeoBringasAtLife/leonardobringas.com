# AGENT.md — leonardobringas.com

Guía para asistentes de código y personas que mantienen este repositorio. **Fuente de verdad:** el código y los archivos en el árbol; si algo diverge de este documento, prevalece el repo.

## Qué es el proyecto

Sitio web **estático** del blog personal **Leonardo Bringas** (dominio público: `leonardobringas.com`). Contenido principalmente en **español** e **inglés**. Una sola página shell (`index.html`) y navegación tipo SPA con **hash + History API**: no hay servidor de aplicaciones ni paso de build obligatorio en el cliente.

## Stack

- **HTML5** (vistas en `index.html`, fragmentos en `posts/` y `pages/`).
- **CSS** modular importado desde `css/styles.css` (sin preprocesador en el repo).
- **JavaScript** en **módulos ES** (`import` / `export`), entrada `javascript/main.js`.
- **Despliegue:** GitHub Actions → GitHub Pages (`.github/workflows/static.yml`): sube el **repositorio completo** como artefacto estático.

No hay `package.json` ni bundler: las rutas `fetch()` deben resolver contra la **raíz del sitio** tal como se sirve en producción (GitHub Pages puede usar subpath según configuración del proyecto Pages; hoy las rutas son relativas a la raíz del sitio).

## Estructura de directorios (resumen)

| Ruta | Rol |
|------|-----|
| `index.html` | Shell: meta SEO base, header, nav, tres `<section class="view">`, footer, script `type="module"` → `javascript/main.js`. |
| `javascript/` | Lógica: estado, router, carga de posts, UI lista, utilidades SEO y slug. |
| `posts/` | Artículos: `*.html` (fragmento con `<article>`) y `posts.json` (metadatos). |
| `pages/` | Páginas cargadas bajo demanda: `about.html`, `about_en.html`. |
| `css/` | Hojas parciales + `styles.css` que solo hace `@import`. |
| `images/` | `favicon.ico`, `leo.webp`, y `posts-images/` para ilustraciones de posts. |
| `.github/workflows/` | CI/CD estático hacia Pages. |

## Flujo de ejecución

1. El navegador carga `index.html` y ejecuta `javascript/main.js`.
2. `init()` lee `location.hash` (`#vista` o `#vista/slug`), normaliza la vista y guarda `slug` si aplica.
3. `updateLanguageUI()` aplica textos de `translations` (según `state.language`), llama `loadPosts()`, y luego `showView()` (con lógica especial si la vista es `article` y hay slug).
4. `loadPosts()` hace `fetch('posts/posts.json')`, aplana artículos al idioma actual y renderiza la lista en `#post-list-container`.

## Vistas y rutas

Vistas válidas (`constants.js` → `VALID_VIEWS`): `home`, `article`, `about`.

- **Inicio:** hash vacío o sin hash relevante → `home`.
- **Artículo:** `#article/{slug}` (ej. `#article/tokens`, `#article/tokens-en`). El HTML se pide con `fetch(\`posts/${slug}.html\`)` → debe existir el archivo `posts/{slug}.html`.
- **Acerca de:** `#about`. Se carga `pages/about.html` o `pages/about_en.html` según idioma (`router.js`).

**Historial:** `showView` usa `history.pushState` con `{ view, slug }`. `popstate` re-sincroniza vista y slug desde `event.state` o, si falta, desde el hash.

## Internacionalización (i18n)

- **Idioma:** `state.language` es `'es'` o `'en'`, persistido en `localStorage` bajo la clave `language`.
- **UI fija** (marca, nav, título de sección, pie, mensajes de error de carga en algunos sitios): objeto `translations` en `javascript/constants.js`.
- **Posts:** cada entrada lógica en `posts.json` tiene `locales.es` y `locales.en`; el runtime genera objetos “planos” con `lang` para lista, SEO y enlaces.

### Convención de slugs entre idiomas

- Español: slug **sin** sufijo `-en` (ej. `tokens`, `opencode`, `filtrado-claude`).
- Inglés: mismo **stem** + sufijo **`-en`** al final del slug (ej. `tokens-en`, `opencode-en`, `filtrado-claude-en`).

La función `localizedArticleSlug(currentSlug, lang)` en `javascript/utils.js` obtiene la base con `replace(/-en$/, '')` y, si el idioma es inglés, concatena `-en`. **No uses** slugs en español que terminen en `-en` salvo que sea el artículo inglés, o la lógica se confundirá.

Al cambiar idioma estando en un artículo, `main.js` vuelve a abrir el par correcto vía `localizedArticleSlug`.

## `posts/posts.json` — esquema

El JSON es un **array de artículos**. Cada elemento:

```json
{
  "date": "YYYY-MM-DD",
  "locales": {
    "es": { "id", "title", "titlePlain", "dateDisplay", "dateArticle", "readTime", "summary", "file" },
    "en": { ... }
  }
}
```

- **`date`:** ISO compartida por ambos idiomas (orden sugerido del listado = orden del array).
- **`locales.es` / `locales.en`:** metadatos por idioma.
- **`id`:** slug del post; debe coincidir con el nombre del HTML sin extensión (`id` `tokens` → `posts/tokens.html`).
- **`file`:** nombre del archivo bajo `posts/` (debe ser coherente con `id`: normalmente `{id}.html`).
- **`titlePlain`:** se usa en `document.title` como `{titlePlain} | {SITE_TITLE}` en `updateSEO` cuando hay post; conviene que sea corto y legible.

`javascript/api.js` convierte cada artículo en un objeto plano `{ id, lang, title, titlePlain, date, dateDisplay, dateArticle, readTime, summary, file }` para el resto del código.

### Checklist: nuevo post

1. Crear `posts/{id-es}.html` y `posts/{id-en}.html` (o los slugs que definan `locales`), cada uno con `<article class="content">` como en los existentes.
2. Añadir un bloque nuevo en el array de `posts.json` con `date` y ambos `locales`.
3. Asegurar convención `id` inglés = `{base}-en` y `localizedArticleSlug` coherente.
4. Imágenes: rutas **relativas a la raíz del sitio** desde el HTML del post, p. ej. `images/posts-images/...`. Convención actual: sufijos **`-es`** / **`-en`** en nombres de archivo cuando hay versión por idioma (`tokenizacion-es.webp`, `tokenizacion-en.webp`, `opencode-es.webp`, `opencode-en.webp`). Un recurso compartido puede ser único (ej. `maps-claude-code.webp`).

## Fragmentos HTML de posts

- Se insertan dentro de `#view-article`; el router toma el primer `<article>` del documento parseado (o `body` si no hay `<article>`).
- Enlaces “volver al blog”: clase `back-link` + `preventDefault` re-enlazado en `router.js` tras cada carga.
- **Rutas:** `fetch('posts/...')` y `fetch('pages/...')` son relativas al origen del sitio.

## SEO y metadatos

`javascript/utils.js` → `updateSEO(post)`:

- Sin `post`: título del sitio (`SITE_TITLE`), descripción por defecto según idioma, imagen por defecto `https://leonardobringas.com/images/leo.webp`.
- Con `post`: título compuesto con `titlePlain`, `summary` como descripción; si en el futuro un post define `image` en el objeto plano, se usaría (el esquema actual en JSON no incluye `image` por defecto).

También actualiza `document.documentElement.lang`, Open Graph y Twitter usando nodos con ids referenciados en `dom` (`constants.js`).

## CSS

`css/styles.css` importa en orden: `variables.css`, `base.css`, `typography.css`, `layout.css`, `components.css`, `syntax.css`. Convención: variables en `:root` en `variables.css`; estilos de contenido largo y listas en `components.css` / `layout.css` según corresponda.

## Módulos JavaScript (dependencias)

```
main.js → constants, utils, router, api
api.js → constants, ui, router
router.js → constants, utils
ui.js → constants
utils.js → constants
```

`state` es un objeto mutable exportado desde `constants.js` (lista actual de posts, vista, slug, idioma).

## Errores y mensajes

- Lista de posts: fallo de red o JSON → mensaje en el contenedor de lista (`api.js`).
- Artículo o página: error en `fetch` → HTML de error dentro de la vista, usando `translations[state.language].loading_error` donde aplica (`router.js`).

## Límites conocidos (no romper sin diseño explícito)

- **Sin SSR:** crawlers que no ejecuten JS pueden ver solo el shell inicial; el contenido del artículo llega por `fetch`.
- **Convención `-en`:** acoplada a `localizedArticleSlug` y a los `id` en `posts.json`.
- **DEFAULT_TITLE** está definido en `constants.js` e importado en `router.js` pero **no se usa** en el código actual; no confiar en él para comportamiento hasta que se integre.

## Cómo probar en local

Servir la **raíz del repo** con un servidor estático (por las rutas relativas y `fetch` a archivos locales). Ejemplos: `npx serve .`, `python -m http.server`, o la vista previa estática del IDE. Abrir `index.html` vía `file://` puede fallar en módulos o en `fetch` según el navegador.

---

*Última revisión alineada con el árbol del repositorio (HTML, JS, JSON, workflow Pages y assets bajo `images/posts-images/`).*
