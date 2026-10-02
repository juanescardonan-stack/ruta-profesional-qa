# Guía de uso — Ruta Profesional QA

## 1. Abrir el sitio

1. Entra en la carpeta `Ruta Profesional QA`.
2. Haz doble clic en `index.html`.
3. El sitio funciona directamente en Chrome o Edge. No necesita servidor, npm, instalación ni conexión para la interfaz.

La conexión a internet es necesaria al abrir cualquier PDF, ya que todos se cargan directamente desde `istqb.org`.

## 2. Cómo funciona

- Pasa el cursor por cada certificación de la rueda para resaltarla y ver su código, versión y estado.
- Haz clic en un segmento de la rueda para abrir su syllabus.
- Debajo de la rueda encontrarás el mismo contenido organizado por `Foundation`, `Core Advanced`, `Core Expert` y `Testing Specialist`.
- Al marcar una casilla, únicamente su segmento cambia a verde.
- Al desmarcarla, el segmento recupera su color original.
- No existe estado “en progreso”. Solo hay pendiente (color original) y completada (verde).
- El botón `Borrar progreso` desmarca todo después de pedir confirmación. No cambia el tema claro/oscuro.
- El interruptor `Modo oscuro` del encabezado alterna el tema. Tu elección se recuerda en este navegador; si nunca lo tocas, el sitio sigue la preferencia de tu sistema operativo.

El progreso se guarda con `localStorage` en el navegador y equipo donde abriste el archivo. Si abres el sitio en otro navegador, otro equipo, una ventana privada o desde una ruta distinta, ese contexto tendrá su propio progreso.

## 3. Estructura de la carpeta

```text
Ruta Profesional QA/
├── index.html
├── GUIA.md
├── css/
│   └── styles.css
├── js/
│   ├── certifications.js
│   └── app.js
├── assets/
│   └── README.md
├── pdf-url-review/
│   ├── README.md
│   └── urls-pdfs.csv
└── pdfs/
    ├── README.md
    ├── foundation/
    ├── core-advanced/
    ├── core-expert/
    └── testing-specialist/
```

La rueda está reconstruida como SVG generado por HTML/JavaScript. La imagen original no se usa como fondo plano.

## 4. Fuentes y vigencia

Toda la investigación se hizo únicamente con el sitio oficial `https://istqb.org/`.

Fecha de verificación: **20 de agosto de 2026**.

Cambios importantes incorporados:

- CTAL-AT v2.0, CT-AI v2.0, CT-GenAI v1.1, CT-QDO v1.0 y CT-FT v1.0.
- CTAL-ATT aparece con una etiqueta de retiro: los exámenes en inglés se mantienen hasta el 6 de mayo de 2027 y los demás idiomas hasta el 6 de noviembre de 2027.
- Los cinco hitos Expert comparten dos syllabi físicos: uno para Test Management y otro para Improving the Test Process.

Revisa `pdf-url-review/urls-pdfs.csv` para ver la URL, fecha, estado y decisión de redistribución de cada certificación.

## 5. Acceso a los PDFs

No se almacena ningún PDF en la carpeta del proyecto ni dentro del ZIP. Cada segmento de la rueda y cada botón de la lista abre directamente el syllabus oficial alojado en `istqb.org`.

Por tanto, para ver un PDF necesitas conexión a internet. La carpeta `pdfs/` se conserva únicamente como referencia documental, sin archivos PDF.

## 6. Criterio de licencias

Aunque algunos syllabi pueden autorizar su copia con atribución, este proyecto se configuró para no redistribuir ninguno. Esto reduce el tamaño del ZIP y garantiza que siempre se abra la versión hospedada por ISTQB.

`pdf-url-review/urls-pdfs.csv` conserva la URL oficial, versión, fecha de revisión y el criterio identificado para cada certificación. La clasificación es una lectura práctica y conservadora de los avisos de copyright, no asesoría legal.

## 7. Actualizar URLs o versiones

1. Entra en <https://istqb.org/certifications/> y abre la ficha oficial.
2. Confirma el código, versión y syllabus vigente.
3. Actualiza la fila correspondiente en `pdf-url-review/urls-pdfs.csv`.
4. Repite los cambios de `version`, `pdfUrl`, `pageUrl` y `pdfFileName` en `js/certifications.js`.
5. Confirma que el nuevo enlace siga siendo un PDF oficial de ISTQB.
6. Abre `index.html` y prueba el segmento y el botón del PDF.

No copies una URL desde una web distinta: este proyecto usa ISTQB como única fuente oficial.

## 8. Agregar una certificación nueva

La rueda y el checklist se generan desde `js/certifications.js`:

1. Copia una ficha existente dentro del grupo correcto.
2. Cambia todos sus campos y usa un `id` único sin espacios.
3. Añade una fila equivalente a `pdf-url-review/urls-pdfs.csv`.
4. Define `localPdf: null` para que el sitio use siempre la URL oficial.
5. Recarga `index.html` y comprueba que el segmento, la casilla y el enlace correspondan a la misma certificación.

Si ISTQB cambia la cantidad de sectores, puede ser necesario ajustar los ángulos y radios en `js/app.js`.

## 9. Crear el ZIP

### Desde el Explorador de Windows

1. Cierra el sitio si lo tienes abierto.
2. Ve al Escritorio.
3. Haz clic derecho sobre la carpeta `Ruta Profesional QA`.
4. Elige `Comprimir en archivo ZIP` o `Enviar a > Carpeta comprimida (zip)`, según tu versión de Windows.
5. Nombra el resultado `Ruta Profesional QA.zip`.

No comprimas solamente los archivos sueltos: conserva la carpeta raíz y toda la estructura interna para que CSS, JavaScript y PDFs sigan funcionando.

## 10. Solución de problemas

- **La rueda aparece sin estilo:** confirma que `css/styles.css` siga en su carpeta y que no cambiaste su nombre.
- **No aparece el checklist:** confirma que `js/certifications.js` y `js/app.js` sigan en `js/`.
- **Un PDF oficial no abre:** revisa su fila en `pdf-url-review/urls-pdfs.csv`; ISTQB puede haber cambiado la URL.
- **Un PDF no abre:** revisa su fila en `pdf-url-review/urls-pdfs.csv`; ISTQB puede haber actualizado la URL o el archivo.
- **El progreso no se conserva:** evita modo privado y abre siempre el mismo `index.html` con el mismo navegador.
- **Quieres mover la carpeta:** puedes hacerlo; después abre el nuevo `index.html`. El navegador puede tratar la nueva ruta como un sitio distinto y comenzar con progreso vacío.

## 11. Reconocimientos

La estructura, nombres de certificación, syllabi y paleta de la rueda se basan en materiales oficiales de ISTQB. ISTQB® es una marca registrada de International Software Testing Qualifications Board. Este sitio es un recurso personal e independiente y no representa una afiliación oficial.
