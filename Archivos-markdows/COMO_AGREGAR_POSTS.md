# Guía: Cómo agregar un nuevo artículo a tu blog

Para agregar una nueva publicación a **leonardobringas.com**, debes seguir estos dos pasos principales:

## 1. Crear el archivo de la publicación
Debes crear un nuevo archivo `.html` dentro de la carpeta `posts/`.

- **Recomendación:** Puedes copiar el archivo `filtrado-claude.html` y usarlo como plantilla.
- **Contenido:** Dentro de ese archivo, asegúrate de colocar el contenido de tu artículo dentro de las etiquetas `<article>`. El sistema de tu web cargará automáticamente el cuerpo de este HTML cuando alguien haga clic en el enlace.

## 2. Registrar el artículo en `posts.json`
Para que el artículo aparezca en la lista de la página principal (Home), debes agregarlo al archivo `posts/posts.json`.

Debes añadir un nuevo objeto al array (preferiblemente arriba del todo para que aparezca primero). Aquí tienes un ejemplo de cómo debería verse una nueva entrada:

```json
{
  "id": "mi-nuevo-post",
  "title": "Título con <strong>estilo</strong>",
  "titlePlain": "Título sin etiquetas HTML",
  "date": "2026-05-01",
  "dateDisplay": "Mayo 01, 2026",
  "dateArticle": "1 de Mayo 2026",
  "readTime": "5 minutos de lectura",
  "summary": "Un breve resumen de lo que trata el artículo.",
  "file": "mi-nuevo-post.html"
}
```

### Detalles de los campos:
- **id:** Un identificador único (usado para la URL interna).
- **title:** El título que se verá en la lista (podes usar `<strong>` para resaltar palabras).
- **titlePlain:** El mismo título pero sin etiquetas HTML.
- **date:** Fecha en formato `AAAA-MM-DD` (ayuda al orden interno).
- **dateDisplay:** Cómo querés que se vea la fecha en la lista principal.
- **dateArticle:** Cómo se verá la fecha arriba de todo una vez abierto el artículo.
- **readTime:** Tiempo estimado de lectura.
- **summary:** Una descripción corta que aparece debajo del título en el Home.
- **file:** El nombre exacto del archivo `.html` que creaste en el paso 1.

---
**¡Listo!** Una vez guardes ambos archivos, el nuevo artículo aparecerá automáticamente en tu blog.
