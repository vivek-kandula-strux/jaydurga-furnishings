# Jaydurga Furnishings Extn. — Website

Static website for **Jaydurga Furnishings Extn.**, a family-run home furnishings retail showroom in Ameerpet, Hyderabad since 1984.

> This is a **retail showroom** website — not an e-commerce store. The site's job is to drive foot traffic, phone calls and WhatsApp enquiries. There is no cart, no checkout.

**Live URL:** _(to be added after first deployment)_

---

## Stack

- Plain HTML5 + CSS + minimal vanilla JavaScript
- Bootstrap 5.3 — grid + utilities only (via CDN)
- Swiper 11 — carousels (via CDN)
- Font Awesome 6 — icons (via CDN)
- Google Fonts — Urbanist (display) + DM Sans (body)
- No build step. Every file in `public/` is served as-is.

## Structure

```
.
├── .github/workflows/
│   └── deploy.yml              # Deploys public/ to GitHub Pages on push to main
├── public/                     # Everything in here is what gets deployed
│   ├── index.html              # Home
│   ├── products.html           # Product index (jump-nav landing)
│   ├── carpets.html            # Category page
│   ├── curtains.html           # Category page
│   ├── mattresses.html         # Category page
│   ├── blinds.html             # Category page
│   ├── wallpapers.html         # Category page
│   ├── upholstery.html         # Category page
│   ├── bedding.html            # Category page
│   ├── table-linen.html        # Category page
│   ├── about.html              # About page
│   ├── gallery.html            # Gallery page
│   ├── contact.html            # Contact page
│   ├── 404.html                # Custom not-found page
│   ├── robots.txt              # Search-engine directives
│   ├── sitemap.xml             # Sitemap for crawlers
│   ├── site.webmanifest        # PWA / mobile home-screen manifest
│   ├── favicon.svg             # Favicon (root-level, auto-detected by browsers)
│   └── assets/
│       ├── logo.svg            # Master brand mark, referenced by all pages
│       ├── css/                # (reserved for future extracted CSS)
│       ├── js/                 # (reserved for future extracted JS)
│       ├── fonts/              # (reserved for self-hosted fonts)
│       └── images/
│           ├── brands/         # Brand-partner logos (drop files here)
│           ├── category/       # Category tile images
│           ├── product/        # Product images
│           └── slider/         # Homepage hero slides
├── docs/
│   ├── DESIGN.md               # Full design system (colour, type, spacing, motion)
│   └── reference/
│       ├── amerce-package/     # Source HTML template borrowed for scaffolding
│       └── screenshots/        # Reference and iteration screenshots
├── .editorconfig               # Cross-editor formatting
├── .gitattributes              # Line endings + binary declarations
├── .gitignore                  # Excludes legacy home-decor-clone/ and dev artefacts
├── CLAUDE.md                   # Claude Code project instructions
├── LICENSE                     # MIT (code only; content is proprietary)
└── README.md
```

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `index.html` | Homepage — hero carousel, categories, testimonials, trust badges |
| `/products` | `products.html` | Product index / jump nav |
| `/carpets` | `carpets.html` | Category — carpets |
| `/curtains` | `curtains.html` | Category — curtains |
| `/mattresses` | `mattresses.html` | Category — mattresses |
| `/blinds` | `blinds.html` | Category — blinds |
| `/wallpapers` | `wallpapers.html` | Category — wallpapers |
| `/upholstery` | `upholstery.html` | Category — upholstery |
| `/bedding` | `bedding.html` | Category — bedding |
| `/table-linen` | `table-linen.html` | Category — table linen |
| `/about` | `about.html` | About the family & store |
| `/gallery` | `gallery.html` | Photo gallery |
| `/contact` | `contact.html` | Contact + map + enquiry form |

> Note: GitHub Pages serves `.html` extensions. Clean-URL rewrites (`/carpets` → `carpets.html`) are supported on GH Pages for links that omit the extension.

## Local development

No build tools required. Any static file server works:

```bash
# Python
cd public && python -m http.server 8080

# Node
npx serve public

# PHP
php -S localhost:8080 -t public
```

Open `http://localhost:8080`.

## Deployment — GitHub Pages

The workflow at `.github/workflows/deploy.yml` deploys `public/` to GitHub Pages on every push to `main`. First-time setup:

1. Create a new repo on GitHub and push this project:
   ```bash
   git init
   git add -A
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. In the repo on GitHub, go to **Settings → Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Trigger the workflow — either push a commit, or use **Actions → Deploy site to GitHub Pages → Run workflow**.
5. The site URL appears in the workflow summary and in **Settings → Pages** once live.

### Custom domain (e.g. `jaydurga.in`)

1. In your DNS provider, create either:
   - A `CNAME` record pointing your subdomain (e.g. `www`) to `<user>.github.io`, **or**
   - `A` records for the apex domain pointing to GitHub Pages' IPs (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
2. Create a file called `CNAME` (no extension) at the repo root, containing your domain name and nothing else:
   ```
   jaydurga.in
   ```
3. In **Settings → Pages**, set the custom domain and **enforce HTTPS**.
4. Update `public/sitemap.xml` and `public/robots.txt` to reference your final domain.

### Deployment alternatives (no changes needed)

- **Netlify** — connect the repo; set build command to `(none)` and publish directory to `public`.
- **Vercel** — connect the repo; framework preset "Other", output directory `public`.
- **Cloudflare Pages** — build command `(none)`, output directory `public`.

## Content owner tasks

Before public launch, the following need to be swapped from placeholders to real content:

- **Brand logos** — the "Brands we distribute" strip on each of the 8 category pages currently shows text placeholders (`OBEETEE`, `JAIPUR RUGS`, `HUNTER DOUGLAS`, etc.). Drop actual brand logo files into `public/assets/images/brands/` and replace the placeholder `<span class="plc">` cells with `<img>` tags.
- **Phone number** — currently `+91 90000 00000` throughout the site. Global find-and-replace.
- **Email address** — currently `hello@jaydurga.in`. Global find-and-replace.
- **Photography** — pages currently reference CDN images from a template preview site (`tfamerce.vercel.app`). Move real product and lifestyle photography into `public/assets/images/{category,product,slider}/` and update the `src` attributes.
- **Favicon** — `public/favicon.svg` is a lightweight monogram placeholder. Replace with a finalised brand favicon (SVG preferred; 32×32 base).
- **Sitemap domain** — replace `https://www.jaydurga.in` in `public/sitemap.xml` and `public/robots.txt` with the final production URL.
- **Google Analytics / plausible / etc.** — no analytics wired up yet. Add snippet before `</head>` in each page (or extract shared header to a build step).

## Editorial / brand notes

Copy on the site follows a **heritage retail** voice — calm, plainspoken, family-owned. Every page is anchored around three facts that must survive any content edit:

1. **42 years** — since 1984.
2. **Ameerpet, Hyderabad** — one showroom, one address.
3. **Family-run** — three generations, hand-picked stock.

The design system (colour, type, spacing, motion) lives in [`docs/DESIGN.md`](docs/DESIGN.md). If you re-skin the site, work from that document. Reference screenshots and the source Amerce template that seeded the build live in [`docs/reference/`](docs/reference/).

## License

Code under MIT (see `LICENSE`). Brand marks, editorial copy, and photography are the property of Jaydurga Furnishings Extn. Third-party brand names referenced on category pages remain the property of their respective owners.
