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

  /* ─── VANISHING PLACEHOLDER · ghost input in enquiry form ──
     Uses a single reschedulable timer instead of setInterval so
     focus/blur can cleanly cancel + restart without overlaps. */
  (function ghostPlaceholder() {
    const wrap = document.querySelector('[data-ghost-input]');
    if (!wrap) return;
    const hint = wrap.querySelector('[data-ghost-hint]');
    const textarea = wrap.querySelector('textarea');
    if (!hint || !textarea) return;

    if (REDUCED) return;

    const HINTS = [
      "Living room curtains for a 3BHK in Kondapur...",
      "Need to recover two sofas — grey linen if possible...",
      "Blackout curtains for the bedroom — motorised if possible...",
      "Full home measurement — I'm not sure where to start."
    ];
    const CYCLE_MS = 3200;

    let i = 0;
    let timer = null;      // pending setTimeout id
    let entering = null;   // active entry tween
    let exiting = null;    // active exit tween

    function killTweens() {
      if (entering) { entering.kill(); entering = null; }
      if (exiting)  { exiting.kill();  exiting  = null; }
    }

    function isBusy() {
      return document.activeElement === textarea || !!textarea.value;
    }

    function show(text) {
      killTweens();
      hint.textContent = text;
      entering = gsap.fromTo(hint,
        { opacity: 0, y: 8, filter: 'blur(4px)' },
        { opacity: 0.55, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power2.out' });
      exiting = gsap.to(hint, {
        opacity: 0, y: -8, filter: 'blur(4px)',
        duration: 0.45, ease: 'power2.in',
        delay: CYCLE_MS / 1000 - 0.6
      });
    }

    function tick() {
      if (isBusy()) return;
      show(HINTS[i]);
      i = (i + 1) % HINTS.length;
    }

    function schedule() {
      cancel();
      timer = setTimeout(function loop() {
        tick();
        timer = setTimeout(loop, CYCLE_MS);
      }, 0);
    }

    function cancel() {
      if (timer) { clearTimeout(timer); timer = null; }
      killTweens();
      gsap.set(hint, { opacity: 0 });
    }

    // Initial fire.
    schedule();

    textarea.addEventListener('focus', () => {
      cancel();
      wrap.classList.add('is-focused');
    });
    textarea.addEventListener('blur', () => {
      wrap.classList.remove('is-focused');
      if (!textarea.value) schedule();
    });
    textarea.addEventListener('input', () => {
      wrap.classList.toggle('has-value', !!textarea.value);
      if (textarea.value) cancel();
    });
  })();

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

    const steps = document.querySelectorAll('[data-scroll-steps] .process-scroll__step');
    const images = document.querySelectorAll('[data-scroll-images] .process-scroll__image');
    if (!steps.length || !images.length) return;

    function activate(stepNum) {
      steps.forEach(s => s.classList.toggle('is-active', s.dataset.step === String(stepNum)));
      images.forEach(im => im.classList.toggle('is-active', im.dataset.step === String(stepNum)));
    }

    ScrollTrigger.matchMedia({
      // Desktop only: scroll-driven step activation
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
        // Cleanup runs automatically when the media query no longer matches.
      },
      // Mobile/tablet: force all steps + first image visible (no scroll magic)
      '(max-width: 1024px)': function () {
        steps.forEach(s => s.classList.add('is-active'));
        images.forEach((im, idx) => im.classList.toggle('is-active', idx === 0));
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

  /* ─── ENQUIRY FORM · Apps Script POST + success checkmark ── */
  (function enquiryForm() {
    const GAS_ENDPOINT_URL = 'GAS_ENDPOINT_URL';

    const form = document.getElementById('enquire-form');
    if (!form) return;
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('.enquire__submit');
    const label  = submit && submit.querySelector('.enquire__submit-label');

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove('is-error', 'is-success');
      if (kind) status.classList.add('is-' + kind);
    }

    if (GAS_ENDPOINT_URL === 'GAS_ENDPOINT_URL') {
      const banner = document.createElement('p');
      banner.className = 'enquire__banner';
      banner.textContent = "This form isn't connected yet — please WhatsApp or call us and we'll pick up the same day.";
      form.insertBefore(banner, form.firstChild);
      submit.disabled = true;
      if (label) label.textContent = 'Please WhatsApp us instead';
      // Belt-and-braces: block the browser-default POST if disabled state is bypassed.
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      return;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form._gotcha && form._gotcha.value) { showSuccess(); return; }
      if (!form.checkValidity()) {
        setStatus("Please fill in your name, phone and what you're looking for.", 'error');
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      data.append('submittedAt', new Date().toISOString());
      data.append('pageUrl', location.href);
      submit.disabled = true;
      setStatus('Sending...');
      fetch(GAS_ENDPOINT_URL, { method: 'POST', body: data })
        .then((res) => { if (!res.ok) throw new Error('bad'); return res.text(); })
        .then(() => { showSuccess(); form.reset(); })
        .catch(() => { setStatus('Something went wrong. Please WhatsApp or call us instead.', 'error'); })
        .finally(() => { submit.disabled = false; });
    });

    function showSuccess() {
      submit.classList.add('is-success');
      if (label) label.textContent = "Sent — we'll reply today";
      setStatus('', 'success');
      setTimeout(() => {
        submit.classList.remove('is-success');
        if (label) label.textContent = 'Send enquiry';
      }, 6000);
    }
  })();

  if (window.console && console.info) {
    console.info('[motion] initialised · GSAP', gsap.version, '· ScrollTrigger', hasScrollTrigger ? 'ready' : 'missing', '· Lenis', hasLenis ? 'ready' : 'missing', REDUCED ? '· reduced-motion active' : '');
  }
})();
