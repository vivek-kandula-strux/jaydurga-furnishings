# DESIGN-SYSTEM.MD

## Jaydurga Furnishings Extn. — Editorial Heritage System

Version: 2.0
Locked anchor: Burgundy `#841011`
Brief: Premium home furnishings retail brand, family-run since 1984. Visual language must read as **heritage editorial** — calm, restrained, designed to age well for the next decade.

---

# 1 · DESIGN DNA

## Reference language

The brand sits inside the **editorial heritage** category alongside Loro Piana, Hermès Maison, Smythson, and the Aesop body of work. Not modern-minimal, not corporate, not catalogue.

The visual vocabulary should communicate:

- Calm authority
- Forty-two years of habit
- Fabric as protagonist
- Restrained craftsmanship
- A family that has stopped trying to impress anyone

## What it is not

- Mass-market retail aesthetic
- Discount-store visuals
- Modern minimal "startup" cleanliness
- Dashboard-style symmetry
- Heavy textures, drop shadows, glassmorphism
- Anything that will look dated by 2030

## The 3-second test

Within three seconds, a visitor should feel:

> "This is a furnishings house that takes its work seriously and has been here a long time."

Not:

> "This is a modern e-commerce furniture site."

---

# 2 · STRUCTURAL PHILOSOPHY

## Editorial symmetry

The site uses a **strictly symmetric 12-column grid as its backbone** with asymmetry introduced *only* in three named moments. Everywhere else — product index, services, contact, footer — uses calm, predictable, symmetric grids.

This is the most important rule in the system. Symmetry signals trust; asymmetry signals editorial intent. They are tools, not preferences.

## The three asymmetric moments

### 1. Homepage hero

Text occupies columns 1–5 (left). A single fabric photograph occupies columns 6–12 (right) and bleeds to the viewport edge. The image is taller than the text column; text is vertically centered within its own column. This is the *only* full-asymmetric moment on the homepage.

### 2. About page editorial spreads

Chapter numbers sit in the left margin in tiny tracked type. Photos break the column. Pull quotes indent inward by two columns. The page should read like the inside of a printed book — uneven, intentional, narrative.

### 3. Gallery composition rhythm

Three-row pattern that repeats:
- Row 1: tile widths 6 + 3 + 3
- Row 2: tile widths 3 + 3 + 6
- Row 3: tile widths 4 + 4 + 4 (symmetric reset)

No single tile dominates the page; asymmetry within a row, balance across the page. Categories of the 8 collections never receive permanently uneven weight.

---

# 3 · COLOR SYSTEM

The palette is five colors. Five. No theming, no dark mode, no color modifiers.

## Locked primary

**Burgundy Heritage** — `#841011`
**Burgundy Deep** — `#5E0B0C`

Usage:
- Primary CTAs (filled)
- Active navigation states
- Selection highlight
- Hover state on links
- Focus rings (with 12% alpha shadow)

Maximum interface usage: **8% surface area**. Burgundy is loudest when used least.

Never:
- As section backgrounds
- For body text
- For category labels
- In gradients of any kind

## Neutrals (warmed)

| Token | Hex | Usage |
|---|---|---|
| Paper | `#FBF8F2` | Page background, primary surface (replaces pure white) |
| Stone | `#F2EFE8` | Section alternates, card surface, form backgrounds |
| Cream Line | `#E8E2D6` | Dividers on warm surfaces |
| Line | `#E5E1D6` | Dividers, input borders, card outlines |

The Paper-over-pure-white shift is the single most important neutral decision. Burgundy reads richer against warm cream than against clinical `#FFFFFF`. This is the heritage signal.

## Architectural secondary

**Charcoal** — `#2D3238`

Usage:
- Footer background
- Promo bar background
- Dark CTA bands ("Visit" sections)
- Secondary button border + hover fill
- Premium contrast against Paper

## Accent

**Brushed Brass** — `#C5A46D`
**Brass Dim** — `#A88955` (for hover/active on brass elements)

Usage:
- Ornament rules
- Decorative numerals (chapter numbers in italic)
- Footer eyebrow labels
- Dividers on dark backgrounds
- Active state indicator on dark backgrounds

Never:
- For body text
- For CTAs (CTAs are burgundy or charcoal only)
- As large surface backgrounds

## Text

| Token | Hex | Usage |
|---|---|---|
| Ink | `#1A1815` | Headlines, primary body (warm near-black, never `#000`) |
| Ink Soft | `#5A554D` | Secondary text, lead paragraphs, captions |
| Mute | `#8A8378` | Eyebrow labels, metadata, photo credits |

## Mandatory usage ratio

- **62%** Paper + Stone (background air)
- **22%** Photography
- **9%** Charcoal (dark bands + footer)
- **5%** Brass (ornaments)
- **2%** Burgundy (CTAs + active states)

This ratio is *enforced*. If a section breaks it, redesign the section.

---

# 4 · TYPOGRAPHY

## Families

**Display** — Cormorant Garamond
Weights: 400, 500, 500 italic, 600 italic
Use: H1–H4, pull quotes, chapter titles, photo captions (italic), large numerals.

**Body / UI** — Manrope
Weights: 400, 500, 600
Use: Body copy, navigation, eyebrows, buttons, form labels, metadata.

## Scale (modular ratio 1.333 — perfect fourth)

| Role | Desktop | Mobile | Family | Weight | Line-height |
|---|---|---|---|---|---|
| Display XL (hero) | **96px** | 52px | Cormorant | 500 | 1.02 |
| Display L (section opener) | 72px | 44px | Cormorant | 500 | 1.05 |
| H1 | 56px | 38px | Cormorant | 500 | 1.08 |
| H2 | 40px | 30px | Cormorant | 500 | 1.1 |
| H3 | 28px | 22px | Cormorant | 600 | 1.15 |
| H4 | 22px | 19px | Cormorant | 600 | 1.2 |
| Eyebrow / label | 13px | 13px | Manrope | 600 | 1, tracked +0.22em uppercase |
| Body Large (lead) | 20px | 18px | Manrope | 400 | 1.55 |
| Body | 17px | 16px | Manrope | 400 | 1.65 |
| Caption | 14px | 13px | Manrope | 500 | 1.4 |

## Rules

- Cormorant is **never bold** at display sizes. Weight 500 only. Bold serif at 96px looks heavy and dated.
- Italic Cormorant is reserved for: pull quotes, decorative numerals (chapter "01" markers), photo caption suffixes. Never for general emphasis.
- Body line-length capped at **65 characters**.
- Display line-height tight (1.02–1.1). Body line-height generous (1.55–1.7).
- Eyebrows are always uppercase, tracked +0.22em, 600 weight. They are the brand's secondary voice.
- Never use letter-spacing on display headings (already balanced).
- Never use underline for links in body copy — use color shift to burgundy plus a hover underline that animates in.

---

# 5 · SPACING SYSTEM

Base unit **4px** — but the *useful* scale is what matters.

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`

## Tokens

| Token | Value | Use |
|---|---|---|
| sp-1 | 8px | Inline (icon ↔ label) |
| sp-2 | 16px | Tight stack inside a component |
| sp-3 | 24px | Default element-to-element |
| sp-4 | 32px | Card padding, comfortable separation |
| sp-5 | 48px | Within-component groupings |
| sp-6 | 64px | Subsection breaks |
| sp-7 | 96px | Section break (mobile), within-section breathing |
| sp-8 | 128px | Section break (desktop) |
| sp-9 | 192px | Hero top padding (desktop) |

## Section padding rules (non-negotiable)

| Surface | Desktop | Mobile |
|---|---|---|
| Hero | 192 top / 128 bottom | 96 top / 72 bottom |
| Major section | 128 | 72 |
| Standard section | 96 | 56 |
| Card internal | 32 | 24 |
| Form internal | 32 | 24 |

The 128-desktop / 72-mobile section break is the single highest-leverage decision in this system. It does the majority of the "premium" work.

---

# 6 · GRID & LAYOUT

## Container widths

| Token | Value | Use |
|---|---|---|
| --container | 1440px | Wide bands (heroes, dark CTA strips, gallery) |
| --content | 1280px | Standard content sections |
| --max-text | 65ch (~640px) | Long-form prose. Never exceed. |

## Side margins

`clamp(20px, 5vw, 96px)`

Generous margins are the luxury signal. Do not reduce.

## Grid

12 columns desktop, 24px gutters.
8 columns tablet (768–1023px), 20px gutters.
4 columns mobile, 16px gutters.

## Asymmetric layouts collapse to single-column stacks on mobile. No exceptions.

---

# 7 · COMPONENTS

## Buttons

### Primary
- Background: Burgundy `#841011`
- Text: Paper `#FBF8F2`
- Border: none
- Radius: 2px (heritage uses *minimal* rounding — corners almost square)
- Padding: 18px 36px
- Font: Manrope 600, 14px, tracked +0.08em, uppercase
- Hover: background → Burgundy Deep `#5E0B0C`, 220ms ease-out
- Focus: 3px outline at Burgundy 18% alpha, offset 2px

### Secondary
- Background: transparent
- Border: 1px Charcoal
- Text: Charcoal
- Hover: fill → Charcoal, text → Paper

### Light (on dark bands)
- Background: Paper
- Text: Charcoal
- Hover: background → Brass, text → Charcoal

### Inline link (link-arrow)
- No underline by default
- Color: Burgundy
- 1px animated underline that draws in from left on hover
- Arrow glyph translates 6px right on hover
- For dark bands: Brass color, white on hover

## Cards

- Background: Paper or Stone (depending on surface contrast needed)
- Border: 1px `--color-line`
- Radius: **4px** (reduced from 12px — heritage = less rounded)
- Padding: 32px
- Shadow: none on rest. On hover, very subtle `0 8px 24px -16px rgba(26,24,21,0.10)` + 4px lift, 700ms ease-out.

No dramatic effects. No tilt. No 3D.

## Forms

- Label: eyebrow style (13px uppercase tracked 0.22em, weight 600, Manrope), Charcoal, always visible above field
- Input height: 56px
- Input border: 1px Line, radius 4px
- Input focus: border → Burgundy, ring 3px at Burgundy 12% alpha
- Background: Paper inside Stone form card, or Stone inside Paper section
- Floating labels: forbidden
- Help text: 13px, Mute, italic Cormorant for the warmth

## Navigation

- Two-layer header: centered logo row, then sticky centered nav row below
- Logo height: clamp(72px, 9vw, 112px)
- Nav row height: 56px sticky
- Nav text: Manrope 500, 14px, tracked +0.08em, uppercase
- Active/hover: color → Burgundy, 1px animated underline from left
- Background: Paper, no shadow until scroll, then `--shadow-sm`

## Promo bar

- Background: Charcoal
- Text: Paper, 13px tracked +0.1em
- Center pin element in Brass, tracked +0.22em uppercase, weight 600
- Phone icon in Brass, text in Paper, hover → Brass

## Footer

- Background: Charcoal
- Eyebrow column headers in Brass
- Body links in Paper at 78% opacity, hover → Brass
- Divider rule: Brass at 18% alpha, 1px
- Brand tagline (italic Cormorant) in Brass at full opacity
- Padding: 96px top, 24px bottom

---

# 8 · MOTION

Motion in this system is slow and intentional. Premium = unhurried.

## Tokens

| Token | Value | Use |
|---|---|---|
| --dur-fast | 220ms | Button color shifts, link color shifts, nav hover |
| --dur | 400ms | Card lifts, underline draws |
| --dur-slow | 700ms | Image reveals, section transitions |
| --dur-image | 900ms | Hero image clip-path mask reveal |
| --ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for everything |
| --ease-image | `cubic-bezier(0.16, 1, 0.3, 1)` | Image masks (more drawn-out) |

## Allowed

- Fade + 12px upward translate on scroll-in
- Stagger children by 80ms
- Underline draw-in for links
- Subtle 4px card lift
- 1.03 image zoom on hover (700ms)
- Vertical clip-path image reveal for heroes

## Forbidden

- Bounce, elastic, overshoot easings
- Parallax (any kind)
- Scroll-jacking
- Custom cursors
- Cursor-following effects
- Marquees
- Auto-rotating sliders that don't pause on hover
- Anything that triggers motion sickness

## Reduced motion

All transitions reduce to 0.001ms when `prefers-reduced-motion: reduce` is set. Already implemented; do not regress.

---

# 9 · PHOTOGRAPHY

## Direction

Photography carries 22% of the visual interface — more than any color except neutrals. Without strong photography, no amount of typography can save this site.

## What to show

- Fabric as protagonist (the rooms feature, the people don't)
- Wide compositions with breathing room
- Texture-led close-ups of weave, stitch, edge
- Real customer homes (not staged photo-studios)
- Showroom interior — counter, swatch wall, tailoring room

## What to avoid

- Product cutouts on white
- Stock images of generic "luxury interiors"
- People as protagonists (rooms are the protagonist)
- Dramatic backlighting
- Cold/blue color casts
- Heavy retouching

## Color treatment

All photography goes through a consistent LUT before going on the site:

- Warm white balance (5800–6200K)
- Lifted shadows (heritage rooms have softness, not contrast)
- Desaturated by 10–15% from camera default
- Highlights rolled off (no clipped whites)
- Slight cream tint in highlights

## Aspect ratios

| Surface | Ratio | Reason |
|---|---|---|
| Hero | 4:5 portrait or 16:9 (visual decision) | Editorial vertical preferred |
| Editorial portrait (About) | 4:5 | Magazine portrait standard |
| Gallery plates | 4:5 default, 3:4 for wide tiles | Composition rhythm |
| Lifestyle wide | 3:2 | Where horizontal context matters |
| Product detail | 1:1 | Symmetric catalogue discipline |

---

# 10 · PAGE ARCHETYPES

## Homepage

1. **Hero** — asymmetric, image bleeds right edge
2. **Statement** — centered editorial quote on Paper, ornament dividers in Brass
3. **Eight chapters** — numbered editorial list (chapter-row component), symmetric
4. **Showroom story** — two-column with media, symmetric
5. **Legacy timeline** — 4-column horizontal timeline, symmetric
6. **Voices** — 3-up testimonial blockquotes, symmetric
7. **Visit CTA** — dark Charcoal band, asymmetric end-aligned text on right

## Products

- Page hero with category eyebrow + display title + meta row
- Sticky chapter index (jump nav, 8 categories)
- Alternating editorial collection blocks (image + copy)
- Each block strictly symmetric internally; alternation creates visual rhythm
- Closing Visit CTA

## About

- Page hero
- Founder portrait + quote (editorial spread)
- Long-form story with sticky index on left (the "book" feel)
- Long timeline (4-column or 6-column)
- Values grid (3-up)
- Visit CTA

## Gallery

- Page hero
- Sticky filter chip row (categories)
- Composition rhythm grid (6+3+3 / 3+3+6 / 4+4+4 repeating)
- Visit CTA

## Contact

- Page hero
- Locate split (address on left, map on right)
- Hours dl
- Directions 3-up
- Enquiry form (split: intro + service list on left, form on right)

---

# 11 · ICONOGRAPHY

- Style: architectural minimal outline
- Stroke width: 1.5px (not 2px — heritage prefers finer lines)
- Size: 22px / 24px standard
- Color: Charcoal default, Burgundy on hover, Brass for ornament-only icons

Avoid:
- Filled icons
- 3D icons
- Cartoon / illustrative icons
- Mismatched icon sets

---

# 12 · NON-NEGOTIABLE RULES

1. The grid is symmetric. Asymmetry exists in three named moments. Nowhere else.
2. Burgundy never exceeds 8% of any screen.
3. Paper (`#FBF8F2`) is the page background. Pure white (`#FFFFFF`) does not exist in this system.
4. No more than three colors visible in any one section.
5. Section breaks are 128px desktop / 72px mobile. Always.
6. No gradients, no glassmorphism, no oversized shadows, no neon, no dark mode toggle.
7. Cormorant is never bold at display sizes. Weight 500 maximum for headlines.
8. Photography is real or not present. No stock filler in the final site.
9. Whitespace is used aggressively. If a section feels "cramped", it is wrong.
10. Before adding any element, ask: **"Would a senior interior designer approve of this in a private showroom?"** If not, remove it.

---

# 13 · WHAT THIS SYSTEM IS DESIGNED TO LAST

This system is designed to look correct in **2036**, not impressive in 2026. That is the only test that matters.

- We avoid the 2024 trendcycle entirely (no glassmorphism, no AI gradients, no oversized brutalist type).
- We borrow from publishing tradition (italics, ornaments, captions, chapter numbers) because publishing tradition has not changed in 100 years.
- We anchor on a palette that pre-dates the internet (burgundy + brass on cream).
- We use whitespace as a structural element, not a stylistic one.

Restraint is the durability strategy.
