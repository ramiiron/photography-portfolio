# Ramiro B. Photography — Website

Sitio web de fotografía de **Ramiro B. Photography** (Utah Portrait Photographer).
Estilo editorial cálido, inspirado en los sitios luxury de fotografía de Utah,
con contenido propio. Solo dos servicios: **Family** y **Portraits** (sin eventos).

- 🌐 Sitio en vivo: https://ramiiron.github.io/photography-portfolio/
- 📸 Instagram: [@ramirob.ph](https://www.instagram.com/ramirob.ph)

## Páginas

| Página         | Archivo          | Contenido |
| -------------- | ---------------- | --------- |
| Home           | `index.html`     | Hero, presentación de Ramiro, servicios (Family / Portraits), galería, experiencia y contacto |
| Family         | `family.html`    | Página completa de sesiones familiares: historia, experiencia, qué incluye, galería y FAQ |
| Portraits      | `portraits.html` | Retratos en general: parejas, maternidad, newborn, graduación e individuales, galería y FAQ |

## Estructura del repo

```
photography-portfolio/
├── index.html                  # Home
├── family.html                 # Página Family
├── portraits.html              # Página Portraits
├── gallery.html                # Galería completa con filtros por categoría
├── data/
│   ├── photos.json             # ÚNICA lista de fotos de las páginas (slot → archivo)
│   └── gallery.json            # Lista de la galería (archivo → categoría + alt)
├── assets/
│   ├── css/
│   │   ├── base.css            # Variables de color, tipografía y reset
│   │   ├── gallery.css         # Filtros, grilla masonry y lightbox de la galería
│   │   └── layout.css          # Header, hero, secciones, galerías, FAQ, footer
│   ├── js/
│   │   ├── photos.js           # Carga photos.json y pone cada foto en su slot
│   │   ├── gallery.js          # Carga gallery.json, filtros y lightbox
│   │   └── main.js             # Menú móvil, FAQ acordeón, animaciones, año
│   └── images/
│       ├── slots/              # Una foto por slot, con nombre fijo (home-hero.jpg, etc.)
│       └── gallery/            # Fotos de la galería, por categoría (family-01.jpg, etc.)
├── tools/
│   └── generate_placeholders.py  # Regenera las fotos placeholder y photos.json
├── LICENSE
└── README.md
```

Regla del proyecto: **nada de meter todo en un solo archivo**. Cada archivo
tiene una sola responsabilidad, como se ve arriba.

---

## 📷 Cómo cambiar las fotos (sin tocar código)

Cada foto del sitio ocupa un **slot** con nombre fijo. La lista completa de
slots está en `data/photos.json`. El sitio público no tiene ningún botón de
edición: los cambios se hacen solo desde el repo (acceso privado de Ramiro).

### Forma 1 — Reemplazar el archivo del slot (recomendada)

Para que el cambio lo vean todos, reemplaza el archivo del slot en GitHub
**con el mismo nombre** (no hay que editar ningún código):

1. En este repo entra a `assets/images/slots/`.
2. Anota el nombre exacto del slot (ej. `family-gallery-3.jpg` — la lista
   completa está en `data/photos.json`).
3. En GitHub: `Add file → Upload files`, sube tu foto **renombrada con ese
   mismo nombre exacto** y confirma el commit. Si GitHub pide confirmación por
   reemplazo, acéptala.
4. En 1–2 minutos el sitio público muestra la foto nueva.

> Consejo: exporta tus fotos a máx. 1600 px por el lado mayor, JPG calidad ~85%,
> para que la página cargue rápido.

### Forma 2 — Usar un link externo (photos.json)

Si la foto está subida en otro servicio con link directo a la imagen:

Edita `data/photos.json` desde GitHub (botón del lápiz, sin saber código:
es solo cambiar el valor de `"src"` del slot por tu link) y confirma el commit.


### La galería (gallery.html)

La página **Gallery** muestra el portafolio completo con filtros por categoría
(Family, Kids, Couples, Maternity, Newborn, Portraits, Graduation) y lightbox.
Su data vive en `data/gallery.json` y sus fotos en `assets/images/gallery/`
(máx. 1400 px, JPG ~84%). Para agregar una foto: súbela a esa carpeta con el
nombre `<categoria>-NN.jpg` y agrega su entrada en `gallery.json`.

### Slots disponibles (26)

- **Home:** `home-hero`, `home-about`, `home-family`, `home-portraits`,
  `home-gallery-1` a `home-gallery-4`
- **Family:** `family-hero`, `family-story-1`, `family-story-2`,
  `family-gallery-1` a `family-gallery-6`
- **Portraits:** `portraits-hero`, `portraits-couples`, `portraits-maternity`,
  `portraits-newborn`, `portraits-senior`, `portraits-gallery-1` a
  `portraits-gallery-4`

Desde el 2026-11-09 los 26 slots tienen las **fotos reales** elegidas por
Ramiro (su álbum «Muse» de Google Photos + editadas de Lightroom), optimizadas
para web. El historial de placeholders quedó en el commit inicial del rediseño.

---

## Cómo probar el sitio en tu computador

GitHub Pages lo publica solo, pero para verlo local antes de subir cambios:

```bash
cd photography-portfolio
python3 -m http.server 8000
# abrir http://localhost:8000
```

(No abras el `index.html` con doble clic: `data/photos.json` necesita el
servidor local para cargar; sin servidor el sitio usa las rutas por defecto
de cada foto y se ve casi igual.)

## Cómo se publica

Todo commit a la rama `main` se publica automáticamente en GitHub Pages:
https://ramiiron.github.io/photography-portfolio/

## Pendientes / ideas futuras

- Reemplazar los 26 placeholders por fotos reales de Ramiro.
- Agregar testimonios reales de clientes (sección lista para crear).
- Si se quiere cambiar fotos **desde la página y que queden publicadas para
  todos sin pasar por GitHub**, el paso siguiente es conectar un panel con
  login (ej. Firebase, como las otras apps de Ramiro) que guarde las fotos en
  la nube. Hoy el sitio es 100% estático, por eso la publicación permanente se
  hace con la Forma 2 o 3.
- Dominio propio (pendiente, igual que el portafolio personal).

## Licencia

© 2026 Ramiro Bugueño. Todos los derechos reservados — ver `LICENSE`.
Las fotografías son propiedad de Ramiro B. Photography.
