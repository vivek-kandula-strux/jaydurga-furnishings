# CLAUDE.md

caveman mode. short word. save token. no fluff.

---

## site

name = Jaydurga Furnishings Extn.
type = home furnishing shop. real store. not ecom.
age = 42 year. since 1984. family run.
where = Ameerpet, Hyderabad.
goal = look old + trusted. bring foot traffic + phone call. no cart.

vibe = editorial heritage. calm. slow. quiet luxury.
not = startup clean. not discount. not mall.
see = docs/DESIGN.md for color/type/grid rule.

---

## build

engine = flow-nexus swarm. spawn agent. parallel work.
stack = static HTML + CSS. no framework unless need.
folder = public/ = live build (deployable).
asset = public/assets/.
ref img = docs/reference/screenshots/ref-*.jpg, clone-*.jpg. compare pixel.
templates = docs/reference/amerce-package/ = source template to borrow from.

rule:
- edit exist file. no new file unless must.
- no emoji in code.
- no comment unless why is weird.
- test in browse tool before say done.

---

## page map

5 page total. flat nav.

### 1. home (index.html)
- big hero. store name. tagline = 42 year legacy.
- Ameerpet loud + clear.
- product teaser row (8 category).
- trust strip = year + family + local.
- CTA = call + visit.

### 2. products
- 8 category grid:
  1. Curtains
  2. Carpets
  3. Mattresses
  4. Blinds
  5. Wallpapers
  6. Upholstery
  7. Bedding
  8. Table Linen
- each card = photo + name + short line.
- no price. no add-to-cart. enquiry only.

### 3. about
- brand story. 1984 start. family.
- credibility = year count, loyal client, hand pick fabric.
- photo of shop + people.

### 4. gallery
- grid of shop photo + product photo.
- lightbox on click.
- caption = category tag.

### 5. contact
- Google Map embed. Ameerpet pin.
- direction text.
- click-to-call button (tel: link).
- WhatsApp button.
- enquiry form = name + phone + msg + category dropdown.
- shop hour.

---

## nav + footer

nav = Home / Products / About / Gallery / Contact. thin. serif.
footer = address + phone + hour + social + copyright.

---

## content pillar

every page must show:
- 42 year old
- Ameerpet
- family
- fabric pick by hand
- easy to call/visit

---

## tech rule

- mobile first. phone user = main.
- fast load. compress img.
- semantic HTML. h1 once per page.
- alt text on all img.
- lazy load below fold.
- WhatsApp + tel link = must.
- form = simple POST or mailto for now.

---

## done check

before ship each page:
- [ ] match design-system.md
- [ ] Ameerpet visible
- [ ] phone number 1-tap
- [ ] mobile good
- [ ] image not slow
- [ ] no lorem left
- [ ] pixel close to ref img

---

## flow-nexus use

- spawn swarm for parallel page build.
- 1 agent = 1 page. sync via memory.
- coordinator agent = check consistency.
- reviewer agent = compare to ref-*.jpg.

---

end.
