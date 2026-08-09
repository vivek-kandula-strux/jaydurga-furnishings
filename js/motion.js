/* ═══════════════════════════════════════════════════════════
   Jay Durga Furnishings · motion layer
   GSAP + ScrollTrigger + Lenis · 21st.dev-inspired patterns
   ─────────────────────────────────────────────────────────
   Every effect respects prefers-reduced-motion. If GSAP or
   Lenis fail to load, the page still works (blur-fade markers
   are cleared, content is visible).

   Notes:
   - `js-ready` class + curtain-drop are already set by an inline
     <head> script (before this file loads) so the FOUC + slow-load
     curtain issues are handled without waiting for GSAP.
   - FAB and sticky-scroll are bound via ScrollTrigger.matchMedia
     so they rebind cleanly on breakpoint changes.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Signal to the inline <head> safety-net that motion.js is alive.
  // Prevents the 3s fallback from stripping js-ready.
  window.jdMotionAlive = true;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  // If GSAP failed to load, clear all blur-fade markers immediately so nothing is hidden.
  if (!hasGSAP) {
    document.querySelectorAll('.blur-fade').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    document.querySelectorAll('.fab').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
      el.style.pointerEvents = '';
    });
    if (window.console && console.warn) console.warn('[motion] GSAP not loaded — motion effects skipped.');
    return;
  }

  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ─── LENIS · smooth scroll ─────────────────────────
     Bound to GSAP's ticker so ScrollTrigger stays in sync.
     Skipped when prefers-reduced-motion is set. */
  let lenis = null;
  if (hasLenis && !REDUCED) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    if (hasScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links → route through Lenis for smooth scroll.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '#main') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -20, duration: 1.3 });
      } else {
        target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* ─── BLUR-FADE · universal scroll reveal ───────────
     Every .blur-fade element clears its filter/transform on enter. */
  (function blurFadeReveal() {
    const items = document.querySelectorAll('.blur-fade');
    if (!items.length) return;

    if (REDUCED || !hasScrollTrigger) {
      items.forEach(el => gsap.set(el, { opacity: 1, y: 0, filter: 'none' }));
      return;
    }

    items.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  })();

  /* ─── WORD ROTATE · rotating room type in hero ────── */
  (function wordRotate() {
    const container = document.querySelector('[data-word-rotate]');
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.word-rotate__item'));
    if (items.length < 2) return;
    if (REDUCED) return;

    let current = 0;
    const INTERVAL_MS = 2500;

    function advance() {
      if (document.hidden) return;
      const prev = current;
      current = (current + 1) % items.length;

      gsap.timeline()
        .to(items[prev], { y: '-100%', opacity: 0, duration: 0.5, ease: 'power2.in' }, 0)
        .fromTo(items[current],
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.55, ease: 'power2.out', onStart: () => {
            items[current].classList.add('is-active');
            items[prev].classList.remove('is-active');
          }}, 0.15);
    }

    setInterval(advance, INTERVAL_MS);
  })();

  /* Ghost-input placeholder animation removed — the unified enquiry form
     (js/enquiry-form.js) uses static placeholders across all pages. */

  /* ─── BENTO · focus-dim on hover ──────────────────── */
  (function bentoFocus() {
    const grid = document.querySelector('[data-bento-grid]');
    if (!grid) return;
    const cells = grid.querySelectorAll('.bento__cell');

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    cells.forEach((cell) => {
      cell.addEventListener('mouseenter', () => {
        grid.classList.add('is-focusing');
        cells.forEach(c => c.classList.toggle('is-focused', c === cell));
      });
    });
    grid.addEventListener('mouseleave', () => {
      grid.classList.remove('is-focusing');
      cells.forEach(c => c.classList.remove('is-focused'));
    });
  })();

  /* ─── STICKY-SCROLL PROCESS ─────────────────────────
     Wrapped in ScrollTrigger.matchMedia so triggers rebind
     cleanly at breakpoint change (desktop ↔ mobile). */
  (function stickyProcess() {
    if (!hasScrollTrigger) return;

    const stepsList = document.querySelector('[data-scroll-steps]');
    const steps = document.querySelectorAll('[data-scroll-steps] .process-scroll__step');
    const images = document.querySelectorAll('[data-scroll-images] .process-scroll__image');
    const numerals = document.querySelectorAll('[data-scroll-numeral] span');
    const pips = document.querySelectorAll('[data-scroll-pips] .process-scroll__pip');
    const captions = document.querySelectorAll('[data-scroll-caption] span[data-cap]');
    if (!stepsList || !steps.length || !images.length) return;

    function activate(stepNum) {
      const n = Number(stepNum);
      steps.forEach(s => {
        const sn = Number(s.dataset.step);
        s.classList.toggle('is-active', sn === n);
        s.classList.toggle('is-passed', sn < n);
      });
      images.forEach(im => im.classList.toggle('is-active', Number(im.dataset.step) === n));
      numerals.forEach(el => el.classList.toggle('is-active', Number(el.dataset.num) === n));
      pips.forEach(p => {
        const pn = Number(p.dataset.pip);
        p.classList.toggle('is-active', pn === n);
        p.classList.toggle('is-passed', pn < n);
      });
      captions.forEach(c => c.classList.toggle('is-active', Number(c.dataset.cap) === n));
    }

    ScrollTrigger.matchMedia({
      // Desktop: scroll-driven step activation + scrubbed rail fill
      '(min-width: 1025px)': function () {
        steps.forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top center',
            end: 'bottom center',
            onEnter:     () => activate(step.dataset.step),
            onEnterBack: () => activate(step.dataset.step),
          });
        });
        // Scrub the vertical rail fill from 0 to 1 across the whole steps list.
        ScrollTrigger.create({
          trigger: stepsList,
          start: 'top 65%',
          end: 'bottom 45%',
          scrub: 0.6,
          onUpdate: (self) => {
            stepsList.style.setProperty('--rail-progress', self.progress.toFixed(3));
          },
        });
      },
      // Mobile/tablet: fill the rail, unfade every body, show first image
      '(max-width: 1024px)': function () {
        stepsList.style.setProperty('--rail-progress', '1');
        steps.forEach(s => { s.classList.add('is-active'); s.classList.add('is-passed'); });
        images.forEach((im, idx) => im.classList.toggle('is-active', idx === 0));
        numerals.forEach((el, idx) => el.classList.toggle('is-active', idx === 0));
        pips.forEach((p, idx) => p.classList.toggle('is-active', idx === 0));
        captions.forEach((c, idx) => c.classList.toggle('is-active', idx === 0));
      }
    });
  })();

  /* ─── FAB · reveal on scroll past hero ──────────────
     matchMedia handles the desktop-slide-in-from-right vs
     mobile-slide-in-from-bottom split, so resize doesn't
     leave the FAB stranded off-screen. */
  (function fabReveal() {
    const fab = document.querySelector('[data-fab]');
    const hero = document.querySelector('.hero');
    if (!fab || !hero) return;
    if (!hasScrollTrigger) {
      fab.style.opacity = 1;
      fab.style.transform = 'none';
      fab.style.pointerEvents = '';
      return;
    }

    ScrollTrigger.matchMedia({
      '(min-width: 721px)': function () {
        gsap.set(fab, { x: 100, y: 0, autoAlpha: 0, pointerEvents: 'none' });
        ScrollTrigger.create({
          trigger: hero,
          start: 'bottom 80%',
          onEnter:     () => gsap.to(fab, { x: 0, y: 0, autoAlpha: 1, pointerEvents: 'auto', duration: 0.45, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(fab, { x: 100, y: 0, autoAlpha: 0, pointerEvents: 'none', duration: 0.25, ease: 'power2.in' }),
        });
      },
      '(max-width: 720px)': function () {
        gsap.set(fab, { x: 0, y: 100, autoAlpha: 0, pointerEvents: 'none' });
        ScrollTrigger.create({
          trigger: hero,
          start: 'bottom 80%',
          onEnter:     () => gsap.to(fab, { x: 0, y: 0, autoAlpha: 1, pointerEvents: 'auto', duration: 0.45, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(fab, { x: 0, y: 100, autoAlpha: 0, pointerEvents: 'none', duration: 0.25, ease: 'power2.in' }),
        });
      }
    });
  })();

  /* Enquiry form submission moved to js/enquiry-form.js
     (single source of truth for the unified form across all pages). */

  /* ═══════════════════════════════════════════════════════════
     TIER 2 · magnetic buttons · scroll-progress · custom cursor
     · fabric preview · card-stack testimonials · page transitions
     ═══════════════════════════════════════════════════════════ */

  const IS_FINE_POINTER = window.matchMedia('(pointer: fine)').matches;
  if (IS_FINE_POINTER) document.documentElement.classList.add('has-fine-pointer');

  /* ─── SCROLL PROGRESS BAR (#3) ────────────────────── */
  (function scrollProgress() {
    const bar = document.querySelector('[data-scroll-progress]');
    if (!bar) return;
    function paint() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
      bar.style.width = pct + '%';
    }
    if (lenis) {
      lenis.on('scroll', paint);
    } else {
      window.addEventListener('scroll', paint, { passive: true });
    }
    window.addEventListener('resize', paint);
    paint();
  })();

  /* ─── MAGNETIC BUTTONS (#1) ───────────────────────── */
  (function magneticButtons() {
    if (!IS_FINE_POINTER || REDUCED) return;
    const nodes = document.querySelectorAll('[data-magnetic]');
    if (!nodes.length) return;

    nodes.forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength || '0.3');
      let raf = null;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  })();

  /* ─── CUSTOM CURSOR (#7) ──────────────────────────── */
  (function customCursor() {
    if (!IS_FINE_POINTER || REDUCED) return;
    const dot = document.querySelector('[data-cursor-dot]');
    const ring = document.querySelector('[data-cursor-ring]');
    if (!dot || !ring) return;

    // Smooth-follow ring, snappy dot
    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let firstMove = true;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px, ' + my + 'px, 0)';

      if (firstMove) {
        firstMove = false;
        // Snap ring immediately so it doesn't glide from (0,0)
        rx = mx; ry = my;
        ring.style.transform = 'translate3d(' + rx + 'px, ' + ry + 'px, 0)';
        // NOW it's safe to hide native cursor and reveal ours
        document.documentElement.classList.add('cursor-ready');
      }
    });
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = ''; ring.style.opacity = '';
    });

    function tick() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx + 'px, ' + ry + 'px, 0)';
      requestAnimationFrame(tick);
    }
    tick();

    // Hover states over interactive elements
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, .bento__cell, .voice-stack__card, [data-magnetic]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(INTERACTIVE)) ring.classList.add('is-hovering');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(INTERACTIVE) && !e.relatedTarget?.closest(INTERACTIVE)) {
        ring.classList.remove('is-hovering');
      }
    });
  })();

  /* ─── FABRIC PREVIEW · Windows chip hover swap (#2) ── */
  (function fabricPreview() {
    const stage = document.querySelector('[data-fabric-stage]');
    if (!stage) return;
    const chips = document.querySelectorAll('[data-fabric-chip]');
    const swatches = stage.querySelectorAll('.fabric-swatch');
    if (!chips.length || !swatches.length) return;

    function activate(name) {
      swatches.forEach(sw => sw.classList.toggle('is-active', sw.dataset.fabric === name));
      chips.forEach(c => c.classList.toggle('is-hot', c.dataset.fabricChip === name));
    }
    function clear() {
      swatches.forEach(sw => sw.classList.remove('is-active'));
      chips.forEach(c => c.classList.remove('is-hot'));
    }

    chips.forEach((chip) => {
      chip.addEventListener('mouseenter', () => activate(chip.dataset.fabricChip));
      // Also support click/tap for touch devices
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        activate(chip.dataset.fabricChip);
      });
    });
    // Clear when leaving the chip strip container
    const chipStrip = document.querySelector('.bento__cell--feature .bento__chips');
    if (chipStrip) chipStrip.addEventListener('mouseleave', clear);
  })();

  /* ─── CARD-STACK TESTIMONIALS (#5) ────────────────── */
  (function voiceStack() {
    const stack = document.querySelector('[data-voice-stack]');
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll('[data-voice-card]'));
    const dots = document.querySelectorAll('[data-voice-dot]');
    const prev = document.querySelector('[data-voice-prev]');
    const next = document.querySelector('[data-voice-next]');
    if (cards.length < 2) return;

    let current = 0;
    const OFFSET_Y = 14;   // px each card behind is pushed down
    const OFFSET_SCALE = 0.05; // each card behind shrinks by this
    const OPACITY_STEP = 0.35; // each card behind fades by this

    function layout(animate = true) {
      cards.forEach((card, idx) => {
        const rel = (idx - current + cards.length) % cards.length;
        const z = cards.length - rel;
        const y = rel * OFFSET_Y;
        const scale = 1 - (rel * OFFSET_SCALE);
        const opacity = Math.max(0, 1 - (rel * OPACITY_STEP));
        const pointerEvents = rel === 0 ? 'auto' : 'none';
        gsap.to(card, {
          y, scale, opacity,
          zIndex: z,
          duration: animate ? 0.45 : 0,
          ease: 'power2.out',
          onComplete: () => { card.style.pointerEvents = pointerEvents; }
        });
        card.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
      });
      dots.forEach((d, i) => d.setAttribute('aria-current', i === current ? 'true' : 'false'));
    }

    function goTo(i) {
      current = ((i % cards.length) + cards.length) % cards.length;
      layout(true);
    }
    function nextCard() { goTo(current + 1); }
    function prevCard() { goTo(current - 1); }

    if (next) next.addEventListener('click', nextCard);
    if (prev) prev.addEventListener('click', prevCard);
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Keyboard nav when stack is focused
    stack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prevCard(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextCard(); }
    });
    stack.tabIndex = 0;

    // Drag/swipe on the front card
    let startX = 0, dragging = false, currentDx = 0;
    const SWIPE_THRESHOLD = 80;

    cards.forEach((card) => {
      card.addEventListener('pointerdown', (e) => {
        if (card !== cards[current]) return;
        dragging = true;
        startX = e.clientX;
        currentDx = 0;
        card.setPointerCapture(e.pointerId);
        card.classList.add('is-dragging');
      });
      card.addEventListener('pointermove', (e) => {
        if (!dragging || card !== cards[current]) return;
        currentDx = e.clientX - startX;
        card.style.transform = 'translate(' + currentDx + 'px, 0) rotate(' + (currentDx * 0.06) + 'deg)';
      });
      card.addEventListener('pointerup', (e) => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('is-dragging');
        try { card.releasePointerCapture(e.pointerId); } catch (err) {}
        if (Math.abs(currentDx) > SWIPE_THRESHOLD) {
          const dir = currentDx > 0 ? -1 : 1;
          // Fling animation
          gsap.to(card, {
            x: (currentDx > 0 ? 1 : -1) * 400,
            rotation: (currentDx > 0 ? 1 : -1) * 20,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
              gsap.set(card, { x: 0, rotation: 0 });
              goTo(current + dir);
            }
          });
        } else {
          // Snap back
          gsap.to(card, { x: 0, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.6)' });
        }
      });
      card.addEventListener('pointercancel', () => {
        dragging = false;
        card.classList.remove('is-dragging');
        gsap.to(card, { x: 0, rotation: 0, duration: 0.3, ease: 'power2.out' });
      });
    });

    layout(false);
  })();

  /* ─── PAGE TRANSITIONS (#6, minimal) ──────────────── */
  (function pageTransitions() {
    if (REDUCED) return;

    // Entrance handled by CSS animation on body (fires before motion.js runs).
    // This block only handles the exit → navigate.

    // Intercept internal .html links → fade out → navigate
    const internal = /^(index|index-modern|collections|gallery|about|contact)\.html(#|\?|$)/;
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (!internal.test(href)) return;

      a.addEventListener('click', (e) => {
        // Modifier keys → let browser handle
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        document.body.classList.add('is-leaving');
        setTimeout(() => { window.location.href = href; }, 300);
      });
    });

    // If user hits back button from bfcache, drop any leaving class
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) document.body.classList.remove('is-leaving');
    });
  })();

  if (window.console && console.info) {
    console.info('[motion] initialised · GSAP', gsap.version, '· ScrollTrigger', hasScrollTrigger ? 'ready' : 'missing', '· Lenis', hasLenis ? 'ready' : 'missing', REDUCED ? '· reduced-motion active' : '');
  }
})();
