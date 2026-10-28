# One-off image conversion for jdfurnishingsextension.com (branch image-optimization).
# Originals untouched; writes .webp copies next to them.
import os
from PIL import Image

HERO = {"assets/images/lifestyle/curtains-hero-brocade.jpg"}
LOGO = "assets/jaydurga-logo.png"

# target: (max_width, max_bytes)
def target_for(path):
    if path.replace("\\", "/") in HERO:
        return 1600, 200 * 1024
    return 1200, 120 * 1024

def save_webp(im, out, max_w, max_bytes):
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    for q in (78, 70, 65):
        im.save(out, "WEBP", quality=q, method=6)
        if os.path.getsize(out) <= max_bytes:
            return q, os.path.getsize(out)
    return 65, os.path.getsize(out)  # floor reached, keep best effort

results = []
for root, dirs, files in os.walk("assets/images"):
    for f in sorted(files):
        if not f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            continue
        src = os.path.join(root, f).replace("\\", "/")
        base = os.path.splitext(src)[0]
        max_w, max_bytes = target_for(src)
        with Image.open(src) as im:
            im = im.convert("RGB")
            q, size = save_webp(im, base + ".webp", max_w, max_bytes)
            results.append((src, base + ".webp", im.width, q, size, max_bytes // 1024))
            # responsive variants for images shown at more than one size
            for w in (480, 800):
                if w < im.width:
                    h = round(im.height * w / im.width)
                    v = im.resize((w, h), Image.LANCZOS)
                    vout = f"{base}-{w}.webp"
                    v.save(vout, "WEBP", quality=q, method=6)
                    results.append((src, vout, w, q, os.path.getsize(vout), "-"))

# Logo: 224 KB PNG shown at ~48 px tall. WebP at 480 w (retina headroom), keep alpha.
with Image.open(LOGO) as im:
    im.load()
    small = im.resize((480, round(im.height * 480 / im.width)), Image.LANCZOS)
    small.save("assets/jaydurga-logo.webp", "WEBP", quality=85, method=6)
    results.append((LOGO, "assets/jaydurga-logo.webp", 480, 85, os.path.getsize("assets/jaydurga-logo.webp"), 30))
    # tiny favicon copy (original png stays untouched)
    im.resize((64, 64), Image.LANCZOS).save("assets/favicon-64.png", "PNG", optimize=True)
    results.append((LOGO, "assets/favicon-64.png", 64, "-", os.path.getsize("assets/favicon-64.png"), "-"))

missed = 0
for src, out, w, q, size, tgt in results:
    flag = ""
    if tgt != "-" and size > tgt * 1024:
        flag = " **OVER TARGET**"
        missed += 1
    print(f"{out}  {w}w  q{q}  {size/1024:.0f} KB{flag}")
print(f"\nfiles written: {len(results)}, over target: {missed}")
