#!/usr/bin/env python3
"""Genera las fotos placeholder y data/photos.json.

Cada "slot" es un espacio de foto con nombre fijo. Ramiro reemplaza el
archivo .jpg por su foto real (mismo nombre) o edita data/photos.json,
sin tocar el HTML.

Uso:  python3 tools/generate_placeholders.py
"""
import json
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLOTS_DIR = os.path.join(ROOT, "assets", "images", "slots")
JSON_PATH = os.path.join(ROOT, "data", "photos.json")

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

# id, pagina, etiqueta visible, alt, ancho, alto
SLOTS = [
    ("home-hero",          "home",      "Home · Foto principal",        "Familia caminando en luz dorada en Utah", 1600, 1067),
    ("home-about",         "home",      "Home · Retrato de Ramiro",     "Retrato de Ramiro, fotógrafo en Utah", 1000, 1250),
    ("home-family",        "home",      "Home · Tarjeta Family",        "Sesión familiar al aire libre en Utah", 1200, 900),
    ("home-portraits",     "home",      "Home · Tarjeta Portraits",     "Retrato editorial en luz natural", 1200, 900),
    ("home-gallery-1",     "home",      "Home · Galería 1",             "Retrato familiar cálido en Utah", 1000, 1250),
    ("home-gallery-2",     "home",      "Home · Galería 2",             "Retrato de pareja en luz dorada", 1000, 1250),
    ("home-gallery-3",     "home",      "Home · Galería 3",             "Retrato de maternidad al aire libre", 1000, 1250),
    ("home-gallery-4",     "home",      "Home · Galería 4",             "Niños jugando en sesión familiar", 1000, 1250),
    ("family-hero",        "family",    "Family · Foto principal",     "Familia unida en un campo al atardecer en Utah", 1600, 1067),
    ("family-story-1",     "family",    "Family · Historia 1",          "Padres abrazando a su hijo en sesión familiar", 1200, 900),
    ("family-story-2",     "family",    "Family · Historia 2",          "Madre e hija riendo en sesión familiar", 1200, 900),
    ("family-gallery-1",   "family",    "Family · Galería 1",           "Retrato familiar en las montañas de Utah", 1000, 1250),
    ("family-gallery-2",   "family",    "Family · Galería 2",           "Hermanos jugando en el campo", 1000, 1250),
    ("family-gallery-3",   "family",    "Family · Galería 3",           "Familia caminando de la mano al atardecer", 1000, 1250),
    ("family-gallery-4",   "family",    "Family · Galería 4",           "Retrato familiar en casa, luz natural", 1000, 1250),
    ("family-gallery-5",   "family",    "Family · Galería 5",           "Padre levantando a su bebé en el campo", 1000, 1250),
    ("family-gallery-6",   "family",    "Family · Galería 6",           "Familia extendida reunida en Utah", 1000, 1250),
    ("portraits-hero",     "portraits", "Portraits · Foto principal",  "Retrato editorial en Salt Lake City", 1600, 1067),
    ("portraits-couples",  "portraits", "Portraits · Parejas",          "Pareja caminando de la mano al atardecer", 1200, 900),
    ("portraits-maternity","portraits", "Portraits · Maternidad",       "Sesión de maternidad en luz suave", 1200, 900),
    ("portraits-newborn",  "portraits", "Portraits · Newborn",          "Bebé recién nacido descansando en casa", 1200, 900),
    ("portraits-senior",   "portraits", "Portraits · Graduación",       "Retrato de graduación en el Capitolio de Utah", 1200, 900),
    ("portraits-gallery-1","portraits", "Portraits · Galería 1",        "Retrato individual en luz natural", 1000, 1250),
    ("portraits-gallery-2","portraits", "Portraits · Galería 2",        "Retrato de pareja en el centro de Salt Lake City", 1000, 1250),
    ("portraits-gallery-3","portraits", "Portraits · Galería 3",        "Retrato de maternidad en el campo", 1000, 1250),
    ("portraits-gallery-4","portraits", "Portraits · Galería 4",        "Retrato personal con luz dorada", 1000, 1250),
]

TOP = (247, 241, 233)     # crema
BOTTOM = (198, 174, 148)  # taupe cálido
INK = (74, 60, 47)
SUB = (112, 94, 73)


def gradient(w, h):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        color = tuple(int(TOP[i] + (BOTTOM[i] - TOP[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = color
    return img


def make_placeholder(slot_id, label, w, h):
    img = gradient(w, h)
    d = ImageDraw.Draw(img)
    margin = int(min(w, h) * 0.045)
    d.rectangle([margin, margin, w - margin, h - margin], outline=(255, 252, 247), width=3)
    scale = min(w, h) / 1000.0
    f_title = ImageFont.truetype(SERIF_BOLD, max(22, int(44 * scale)))
    f_sub = ImageFont.truetype(SERIF, max(16, int(30 * scale)))
    title = label.upper()
    sub = "Tu foto aquí · Your photo here"
    fname = f"{slot_id}.jpg"
    for text, font, fill, dy in ((title, f_title, INK, -30), (sub, f_sub, SUB, 28)):
        bbox = d.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        d.text(((w - tw) / 2, (h - th) / 2 + dy * scale), text, font=font, fill=fill)
    path = os.path.join(SLOTS_DIR, fname)
    img.save(path, "JPEG", quality=82)
    return path


def main():
    os.makedirs(SLOTS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    data = {"version": 1, "slots": {}}
    for slot_id, page, label, alt, w, h in SLOTS:
        make_placeholder(slot_id, label, w, h)
        data["slots"][slot_id] = {
            "page": page,
            "label": label,
            "src": f"assets/images/slots/{slot_id}.jpg",
            "alt": alt,
        }
        print(f"ok {slot_id}.jpg ({w}x{h})")
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"ok data/photos.json con {len(SLOTS)} slots")


if __name__ == "__main__":
    main()
