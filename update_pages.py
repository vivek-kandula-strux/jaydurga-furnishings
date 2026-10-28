# Rewrites <img> tags to <picture> with WebP + original fallback (branch image-optimization).
# Originals stay as fallback src. Adds width/height, lazy below fold, fetchpriority on heroes.
import re, os
from PIL import Image

LOGO = "assets/jaydurga-logo.png"

def webp_dims(path):
    with Image.open(path) as im:
        return im.width, im.height

def photo_picture(src, alt, cls, loading, fetchpriority, sizes):
    base = os.path.splitext(src)[0]
    w, h = webp_dims(base + ".webp")
    srcset = f"{base}-480.webp 480w, {base}-800.webp 800w, {base}.webp {w}w"
    attrs = f'src="{src}" width="{w}" height="{h}" alt="{alt}"'
    if cls:
        attrs += f' class="{cls}"'
    if loading:
        attrs += f' loading="{loading}"'
    if fetchpriority:
        attrs += ' fetchpriority="high"'
    return (
        "<picture>\n"
        f'          <source type="image/webp" srcset="{srcset}" sizes="{sizes}"/>\n'
        f"          <img {attrs}/>\n"
        "        </picture>"
    )

def logo_picture(src, alt, cls, loading):
    w, h = webp_dims("assets/jaydurga-logo.webp")
    attrs = f'src="{src}" width="{w}" height="{h}" alt="{alt}"'
    if cls:
        attrs += f' class="{cls}"'
    if loading:
        attrs += f' loading="{loading}"'
    return (
        "<picture>\n"
        f'          <source type="image/webp" srcset="assets/jaydurga-logo.webp"/>\n'
        f"          <img {attrs}/>\n"
        "        </picture>"
    )

# Per-page rules. Order = document order of non-logo photos.
# (sizes, loading, fetchpriority)
DEFAULT = ('(max-width: 720px) 100vw, 50vw', "lazy", False)
RULES = {
    "index.html": {
        "assets/images/lifestyle/curtains-hero-brocade.jpg": ('(max-width: 720px) 100vw, 55vw', "eager", True),
        "assets/images/lifestyle/gallery-curtain-sheer-plant.jpg": ('(max-width: 720px) 100vw, 55vw', "lazy", False),
        "assets/images/lifestyle/gallery-fabric-bolts.jpg": ('(max-width: 720px) 100vw, 55vw', "lazy", False),
    },
    "collections.html": {
        # first collection image sits right under the page hero = de-facto hero
        "assets/images/lifestyle/curtains-hero-brocade.jpg": ('(max-width: 1024px) 100vw, 50vw', "eager", True),
    },
    "gallery.html": {},
    "about.html": {
        "assets/images/lifestyle/gallery-fabric-bolts.jpg": ('(max-width: 1024px) 100vw, 50vw', "lazy", False),
    },
}

IMG_RE = re.compile(r'<img\b[^>]*src="(assets/[^"]+)"[^>]*>', re.S)

def get_attr(tag, name):
    m = re.search(name + r'="([^"]*)"', tag)
    return m.group(1) if m else ""

changed = {}
for page in ["index.html", "index-modern.html", "collections.html", "gallery.html", "about.html", "contact.html", "404.html"]:
    html = open(page, encoding="utf-8").read()
    rules = RULES.get(page, {})
    logo_seen = [0]

    def repl(m):
        tag, src = m.group(0), m.group(1)
        alt = get_attr(tag, "alt")
        cls = get_attr(tag, "class")
        if src == LOGO:
            logo_seen[0] += 1
            # first logo on page = header (above fold), rest = footer (lazy)
            loading = None if logo_seen[0] == 1 else "lazy"
            return logo_picture(src, alt, cls, loading)
        sizes, loading, fp = rules.get(src, DEFAULT)
        return photo_picture(src, alt, cls, loading, fp, sizes)

    html = IMG_RE.sub(repl, html)
    # favicon: point at the new 4 KB icon instead of the 224 KB logo
    html = html.replace('<link rel="icon" type="image/png" href="assets/jaydurga-logo.png" />',
                        '<link rel="icon" type="image/png" href="assets/favicon-64.png" />')
    html = html.replace('<link rel="icon" type="image/png" href="assets/jaydurga-logo.png"/>',
                        '<link rel="icon" type="image/png" href="assets/favicon-64.png"/>')
    open(page, "w", encoding="utf-8", newline="").write(html)
    changed[page] = True

print("pages rewritten:", ", ".join(changed))
