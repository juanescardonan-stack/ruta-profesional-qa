# Ruta Profesional QA · ISTQB

Ruta profesional interactiva basada en el portafolio oficial de certificaciones ISTQB,
con rueda SVG navegable, checklist persistente y acceso directo a los syllabi oficiales.

## Sitio publicado

https://USUARIO.github.io/ruta-profesional-qa/

## Cómo funciona

- Sitio estático: HTML, CSS y JavaScript sin dependencias, sin build y sin servidor.
- El catálogo completo de certificaciones vive en `js/certifications.js`.
- El progreso del checklist se guarda con `localStorage`, por navegador y dispositivo.
- Modo claro y oscuro con interruptor en el encabezado. La preferencia se guarda en `localStorage` (clave `ruta-profesional-qa-theme-v1`) y, si no hay elección, sigue la configuración del sistema.
- Ningún PDF se almacena en el repositorio: todos los enlaces apuntan a `istqb.org`.

## Documentación

- `GUIA.md` — guía de uso, estructura y mantenimiento.
- `pdf-url-review/urls-pdfs.csv` — URL oficial, versión y fecha de revisión de cada certificación.

Fecha de verificación del portafolio: **20 de agosto de 2026**.

## Aviso

Sitio personal e independiente. ISTQB® es una marca registrada de
International Software Testing Qualifications Board. Este proyecto no
representa una afiliación oficial.
