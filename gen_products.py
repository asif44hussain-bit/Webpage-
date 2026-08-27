"""
Generates original, procedural product data + SVG "photography" for CLOVEKICK.
No external assets, no brand references — every image is drawn from scratch
as an abstract garment silhouette + generative pattern, seeded per-product so
results are stable and reproducible.
"""
import json, os, hashlib, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "public", "products")
os.makedirs(IMG_DIR, exist_ok=True)

INK = "#121212"
PAPER = "#F4F2ED"
CONCRETE = "#C9C4B8"
CONCRETE_DARK = "#8B8676"
SIGNAL = "#FF4B1F"
VOLT = "#DFFF3D"

PALETTES = [
    [INK, CONCRETE, PAPER],
    [INK, SIGNAL, PAPER],
    [CONCRETE_DARK, PAPER, INK],
    [INK, VOLT, CONCRETE],
    [SIGNAL, INK, PAPER],
    [CONCRETE, INK, VOLT],
]

def seeded(name, salt=""):
    h = hashlib.sha256((name + salt).encode()).hexdigest()
    return int(h, 16)

def rand(seedint, i, mod):
    return (seedint >> (i * 5)) % mod

SHAPES = ["tee", "hoodie", "jacket", "pant", "cap", "tote"]

def shape_path(kind):
    if kind == "hoodie":
        return "M 90 60 L 150 40 L 170 30 Q 200 20 230 30 L 250 40 L 310 60 L 330 110 L 290 130 L 280 100 L 280 340 L 120 340 L 120 100 L 110 130 L 70 110 Z"
    if kind == "tee":
        return "M 100 60 L 150 40 L 170 55 Q 200 68 230 55 L 250 40 L 300 60 L 320 105 L 275 122 L 268 95 L 268 340 L 132 340 L 132 95 L 125 122 L 80 105 Z"
    if kind == "jacket":
        return "M 95 55 L 150 35 L 165 55 L 200 70 L 235 55 L 250 35 L 305 55 L 325 105 L 280 125 L 272 95 L 272 340 L 200 340 L 200 200 L 128 340 L 128 95 L 120 125 L 75 105 Z"
    if kind == "pant":
        return "M 130 40 L 270 40 L 280 340 L 215 340 L 202 140 L 190 340 L 120 340 Z"
    if kind == "cap":
        return "M 80 190 Q 200 90 320 190 L 320 210 Q 200 130 80 210 Z M 130 195 Q 200 150 270 195 Q 270 240 200 245 Q 130 240 130 195 Z"
    return "M 110 90 L 290 90 L 300 320 L 100 320 Z M 150 90 Q 150 40 200 40 Q 250 40 250 90"

def pattern(seedint, palette, kind, uid):
    """Return SVG defs+pattern rects for a generative fill."""
    pieces = []
    mode = rand(seedint, 1, 4)
    pid = f"pat{uid}"
    if mode == 0:  # diagonal stripes
        pieces.append(f'<pattern id="{pid}" width="26" height="26" patternTransform="rotate(35)" patternUnits="userSpaceOnUse">'
                       f'<rect width="26" height="26" fill="{palette[0]}"/>'
                       f'<rect width="13" height="26" fill="{palette[1]}"/></pattern>')
    elif mode == 1:  # dot grid
        pieces.append(f'<pattern id="{pid}" width="22" height="22" patternUnits="userSpaceOnUse">'
                       f'<rect width="22" height="22" fill="{palette[0]}"/>'
                       f'<circle cx="11" cy="11" r="3.4" fill="{palette[1]}"/></pattern>')
    elif mode == 2:  # grid lines
        pieces.append(f'<pattern id="{pid}" width="30" height="30" patternUnits="userSpaceOnUse">'
                       f'<rect width="30" height="30" fill="{palette[0]}"/>'
                       f'<path d="M0 0 H30 M0 0 V30" stroke="{palette[1]}" stroke-width="1.5"/></pattern>')
    else:  # solid with a diagonal split
        pieces.append(f'<linearGradient id="{pid}" x1="0" y1="0" x2="1" y2="1">'
                       f'<stop offset="0%" stop-color="{palette[0]}"/>'
                       f'<stop offset="100%" stop-color="{palette[1]}"/></linearGradient>')
    return "".join(pieces), pid

def make_svg(name, sku, kind, seedint, w=400, h=400):
    palette = PALETTES[rand(seedint, 2, len(PALETTES))]
    pat_defs, fill_id = pattern(seedint, palette, kind, seedint % 100000)
    path = shape_path(kind)
    rot = rand(seedint, 3, 7) - 3
    accent = palette[2] if len(palette) > 2 else PAPER
    stamp_txt = sku
    label_y = 372
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="{w}" height="{h}">
  <defs>
    {pat_defs}
    <filter id="grain{seedint % 999}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.03 0"/></filter>
  </defs>
  <rect width="400" height="400" fill="{PAPER}"/>
  <rect width="400" height="400" fill="url(#grain{seedint % 999})"/>
  <g transform="rotate({rot} 200 190)">
    <path d="{path}" fill="url(#{fill_id})" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>
  </g>
  <g opacity="0.9">
    <rect x="16" y="16" width="122" height="26" fill="{INK}"/>
    <text x="24" y="34" font-family="monospace" font-size="13" fill="{PAPER}" letter-spacing="1">{stamp_txt}</text>
  </g>
  <text x="200" y="{label_y}" text-anchor="middle" font-family="monospace" font-size="11" fill="{CONCRETE_DARK}" letter-spacing="2">CLOVEKICK — ORIGINAL ARCHIVE ART</text>
</svg>'''
    return svg

CATEGORY_KIND = {
    "Hoodies": "hoodie",
    "T-Shirts": "tee",
    "Jackets": "jacket",
    "Bottoms": "pant",
    "Headwear": "cap",
    "Accessories": "tote",
}

ADJ = ["Static", "Blackout", "Ember", "Concrete", "Voltage", "Feral", "Quiet", "Rebar", "Ashline", "Nightshift",
       "Riot", "Overcast", "Groundwork", "Afterburn", "Lowlight", "Hazeline", "Ironclad", "Backlot", "Fringe",
       "Molten", "Driftline", "Undertow", "Cinderline", "Bruteline", "Halflight"]
NOUN = ["Hoodie", "Tee", "Jacket", "Cargo Pant", "Shorts", "Cap", "Beanie", "Tote", "Bomber", "Track Jacket",
        "Overshirt", "Vest", "Windbreaker", "Sweatpant", "Crewneck"]

def build_catalog():
    products = []
    used_slugs = set()
    drop = 1
    # 1 LIVE flagship product first
    live_name = "Halflight Bomber"
    live_kind = "jacket"
    live_seed = seeded(live_name, "live")
    products.append({
        "name": live_name,
        "category": "Jackets",
        "kind": live_kind,
        "status": "LIVE",
        "price": 4499,
        "seed": live_seed,
        "desc": "A boxy bomber cut from brushed twill with a bonded inner shell. Built for the transition seasons — "
                "structured shoulders, a ribbed hem that actually holds its shape, and an interior stash pocket "
                "sized for a phone and cards. Cut generous through the chest, tapered at the waist.",
        "story": "First silhouette of the new season. Ten sample runs before we signed off on the shoulder line.",
    })
    idx = 0
    cats = list(CATEGORY_KIND.items())
    while len(products) < 51:
        adj = ADJ[idx % len(ADJ)]
        noun = NOUN[(idx * 3 + 1) % len(NOUN)]
        cat_name, kind = cats[idx % len(cats)]
        name = f"{adj} {noun}"
        slug_base = name.lower().replace(" ", "-")
        slug = slug_base
        n = 2
        while slug in used_slugs:
            slug = f"{slug_base}-{n}"
            n += 1
        used_slugs.add(slug)
        s = seeded(name, str(idx))
        price = 1499 + (rand(s, 4, 26) * 100)
        products.append({
            "name": name,
            "category": cat_name,
            "kind": kind,
            "status": "SOLD_OUT",
            "price": price,
            "seed": s,
            "desc": f"Archive piece from a past drop. {adj} colourway, cut for movement, finished in small batch. "
                    f"Original CLOVEKICK construction — no reissues planned.",
            "story": "",
        })
        idx += 1

    # finalize with slugs/sku/images
    out = []
    for i, p in enumerate(products):
        slug = p["name"].lower().replace(" ", "-")
        base = f"{slug}-{i}" if i > 0 else slug
        sku = f"CK-{p['category'][:2].upper()}-{1000+i}"
        svg1 = make_svg(p["name"], sku, p["kind"], p["seed"])
        svg2 = make_svg(p["name"] + " alt", sku, p["kind"], p["seed"] + 7)
        fname1 = f"{base}-1.svg"
        fname2 = f"{base}-2.svg"
        with open(os.path.join(IMG_DIR, fname1), "w") as f:
            f.write(svg1)
        with open(os.path.join(IMG_DIR, fname2), "w") as f:
            f.write(svg2)
        out.append({
            "name": p["name"],
            "slug": base,
            "sku": sku,
            "category": p["category"],
            "priceInPaise": p["price"] * 100,
            "status": p["status"],
            "description": p["desc"],
            "story": p["story"],
            "dropNumber": i,
            "sizes": ["S", "M", "L", "XL"] if p["kind"] not in ("cap", "tote") else ["ONE SIZE"],
            "stockCount": 12 if p["status"] == "LIVE" else 0,
            "images": [f"/products/{fname1}", f"/products/{fname2}"],
        })
    return out

if __name__ == "__main__":
    catalog = build_catalog()
    with open(os.path.join(ROOT, "prisma", "products.json"), "w") as f:
        json.dump(catalog, f, indent=2)
    print(f"Generated {len(catalog)} products + {len(catalog)*2} images")
