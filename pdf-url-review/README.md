# Revisión de URLs de syllabi ISTQB

Este directorio concentra el registro que permite revisar periódicamente los enlaces usados por el sitio.
La fuente de investigación fue exclusivamente el dominio oficial `https://istqb.org/`.

## Archivo principal

`urls-pdfs.csv` contiene una fila por cada uno de los 28 hitos de la rueda:

- categoría y certificación;
- código y versión;
- nombre de archivo sugerido;
- URL oficial del PDF;
- URL de la ficha oficial;
- fecha y resultado de la última verificación;
- decisión conservadora de redistribución;
- ruta local histórica no utilizada.

## Cómo revisar los enlaces

1. Abre `urls-pdfs.csv` con Excel, LibreOffice Calc o un editor de texto.
2. Visita cada valor de `url_ficha_oficial` y confirma que la certificación siga vigente.
3. Abre `url_pdf_oficial` y comprueba que corresponda a la versión indicada.
4. Actualiza `fecha_verificacion` y `estado_url`.
5. Si cambió una URL, actualízala también en `../js/certifications.js` para que la rueda y el checklist usen el enlace nuevo.
6. Mantén los enlaces directos a ISTQB; este proyecto no almacena copias locales de los PDFs.

Valores usados en `clasificacion_licencia`:

- `INCLUIDO_PERMITIDO_CON_ATRIBUCION`: el aviso visible autoriza copiar el documento completo con reconocimiento de la fuente. Es una clasificación de licencia histórica; el proyecto actual no incluye ningún PDF local.
- `NO_INCLUIDO_REQUIERE_PERMISO`: el aviso permite extractos, pero exige aprobación escrita para otros usos; el sitio enlaza a ISTQB.
- `NO_INCLUIDO_AMBIGUO`: no fue posible confirmar una autorización suficientemente clara; el sitio enlaza a ISTQB.

## Cambios relevantes verificados en 2026

- CTAL-AT v2.0 sustituyó la ruta Agile anterior como certificación Advanced.
- CTFL-AT y CTAL-ATT entraron en retiro. CTAL-ATT sigue visible en la rueda durante la transición: exámenes en inglés hasta el 6 de mayo de 2027 y en otros idiomas hasta el 6 de noviembre de 2027.
- CT-AI pasó a v2.0.
- CT-GenAI pasó a v1.1.
- Se incorporaron CT-QDO v1.0 (Quality in DevOps) y CT-FT v1.0 (Finance Testing).

## Fuentes oficiales de control

- Portafolio: <https://istqb.org/what-we-do/>
- Catálogo de certificaciones: <https://istqb.org/certifications/>
- Rueda oficial publicada en mayo de 2026: <https://istqb.org/wp-content/uploads/2026/05/050526_Portfolio-Export-1.png>
- Tabla oficial de estructura de exámenes v1.17: <https://istqb.org/wp-content/uploads/2026/05/ISTQB_Exam-Structure-Tables_v1.17.pdf>
- Transición Agile Tester: <https://istqb.org/help/agile-tester/>

Última revisión completa: **20 de agosto de 2026**.

> La clasificación de redistribución es una lectura práctica y conservadora de los avisos visibles, no asesoría legal.
