# Review profesional del workspace (leonardobringas.com)

## Diagnóstico rápido

El proyecto tiene una base muy buena para un sitio personal simple: HTML semántico, metadatos SEO/OpenGraph, contenido auténtico y un CSS consistente.

Sin embargo, para llevarlo a un nivel “profesional de producto” (estilo ingeniería de calidad), recomiendo priorizar:

1. **Arquitectura de contenido**
   - Hoy el `index.html` concentra navegación, home, artículo completo y página “about”.
   - En escala, conviene separar el contenido de los posts en archivos propios y usar plantillas o un generador estático.

2. **Navegación robusta y accesible**
   - Había fricción en el manejo del historial (`pushState`) para casos como `popstate`/init.
   - También faltaba marcar explícitamente el enlace activo para lectores de pantalla.

3. **Mantenibilidad editorial**
   - Existe una carpeta `posts/` que sugiere intención de modularizar artículos, pero aún no está integrada al flujo principal.

4. **Calidad operacional**
   - Falta una capa de checks automáticos (linting/formato/validación HTML/CSS).
   - Falta documentación de “cómo publicar” y “definición de listo” para nuevos posts.

## Qué cambié en esta iteración

- Refactoricé `javascript/main.js` para que el enrutado por hash sea más predecible:
  - normalización de vistas válidas,
  - opción para no empujar historial en `popstate` e inicialización,
  - soporte de `prefers-reduced-motion`,
  - y `aria-current` en navegación activa.

## Plan recomendado (bien hecho, nivel profesional)

### Fase 1 — Foundation (rápida)
- Definir estructura:
  - `/posts/<slug>.html` para contenido,
  - home indexando metadatos (título, fecha, resumen, slug).
- Añadir toolchain mínimo:
  - Prettier + HTMLHint + Stylelint + ESLint.
- Pipeline CI:
  - check de formato,
  - lint,
  - build/preview.

### Fase 2 — Performance & SEO
- Implementar sitemap.xml y robots.txt.
- Añadir feed RSS.
- Lazy loading de imágenes no críticas y dimensiones explícitas.
- Revisar Core Web Vitals con Lighthouse.

### Fase 3 — DX editorial
- Frontmatter por post (title/date/description/tags).
- Script `new-post` para crear plantillas.
- Checklist de publicación (links, ortografía, metadata social).

### Fase 4 — Producto
- Sistema de tags/categorías.
- Búsqueda local (client-side) para artículos.
- Página de archivo por año/tema.

## Criterios de calidad sugeridos

- **Accesibilidad:** navegación por teclado, `aria-current`, contraste AA.
- **Rendimiento:** LCP < 2.5s en móvil para home.
- **Confiabilidad:** deploy reproducible + checks automáticos verdes.
- **Escalabilidad:** agregar un post sin tocar lógica de navegación.

