/* ═══════════════════════════════════════════════════════════
   Jay Durga Furnishings · motion layer
   GSAP + ScrollTrigger + Lenis · 21st.dev-inspired patterns
   ─────────────────────────────────────────────────────────
   Every effect respects prefers-reduced-motion. If GSAP or
   Lenis fail to load, the page still works (blur-fade markers
   are cleared, content is visible).
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  // Mark <html> as JS-ready so blur-fade CSS kicks in (fallback if JS fails: everything visible).
  document.documentElement.classList.add('js-ready');

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
    console.warn('[motion] GSAP not loaded — motion effects skipped.');
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

  /* ─── CURTAIN-DROP · one-time hero reveal ───────────
     Two dark panels part like curtains. Fires once per session. */
  (function curtainDrop() {
    const cover = document.querySelector('[data-curtain-cover]');
    if (!cover) return;

    const alreadyDone = sessionStorage.getItem('jd_curtain_done');
    if (REDUCED || alreadyDone) {
      cover.remove();
      return;
    }

    const left = cover.querySelector('.curtain-cover__panel--left');
    const right = cover.querySelector('.curtain-cover__panel--right');

    gsap.timeline({
      onComplete: () => {
        cover.remove();
        sessionStorage.setItem('jd_curtain_done', '1');
      }
    })
      .to(left,  { xPercent: -102, duration: 1.1, ease: 'power3.inOut' }, 0.2)
      .to(right, { xPercent:  102, duration: 1.1, ease: 'power3.inOut' }, 0.2);
  })();

  /* ─── BLUR-FADE · universal scroll reveal ───────────
     Every .blur-fade element clears its filter/transform on enter. */
  (function blurFadeReveal() {
    const items = document.querySelectorAll('.blur-fade');
    if (!items.length) return;

    if (REDUCED || !hasScrollTrigger) {
      // Just clear everything so content is visible.
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

  /* ─── WORD ROTATE · rotating room type in hero ──────
     Cycles through room types every 2.5s. Stops when
     tab is hidden. */
  (function wordRotate() {
    const container = document.querySelector('[data-word-rotate]');
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.word-rotate__item'));
    if (items.length < 2) return;

    if (REDUCED) return; // Leave the first word static.

    let current = 0;
    const INTERVAL_MS = 2500;

    function advance() {
      if (document.hidden) return; // pause when tab isn't visible
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
     Cycles through example prompts every 3.2s. Hides when
     the field is focused or has value. */
  (function ghostPlaceholder() {
    const wrap = document.querySelector('[data-ghost-input]');
    if (!wrap) return;
    const hint = wrap.querySelector('[data-ghost-hint]');
    const textarea = wrap.querySelector('textarea');
    if (!hint || !textarea) return;

    const HINTS = [
      "Living room curtains for a 3BHK in Kondapur...",
      "Need to recover two sofas — grey linen if possible...",
      "Blackout curtains for the bedroom — motorised if possible...",
      "Full home measurement — I'm not sure where to start."
    ];
    let i = 0;
    let cycling = true;
    const CYCLE_MS = 3200;

    function show(text) {
      if (!cycling) return;
      hint.textContent = text;
      gsap.fromTo(hint,
        { opacity: 0, y: 8, filter: 'blur(4px)' },
        { opacity: 0.55, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power2.out' });
      gsap.to(hint, {
        opacity: 0, y: -8, filter: 'blur(4px)',
        duration: 0.45, ease: 'power2.in',
        delay: CYCLE_MS / 1000 - 0.6
      });
    }

    function tick() {
      if (!cycling) return;
      if (document.activeElement === textarea || textarea.value) return;
      show(HINTS[i]);
      i = (i + 1) % HINTS.length;
    }

    // Initial fire, then interval.
    if (!REDUCED) {
      tick();
      const iv = setInterval(tick, CYCLE_MS);
      textarea.addEventListener('focus', () => { cycling = false; gsap.set(hint, { opacity: 0 }); wrap.classList.add('is-focused'); });
      textarea.addEventListener('blur',  () => { wrap.classList.remove('is-focused'); if (!textarea.value) { cycling = true; tick(); } });
      textarea.addEventListener('input', () => { wrap.classList.toggle('has-value', !!textarea.value); if (textarea.value) cycling = false; });
    }
  })();

  /* ─── BENTO · focus-dim on hover ────────────────────
     Hovering any cell dims the others. Undoes on mouseleave. */
  (function bentoFocus() {
    const grid = document.querySelector('[data-bento-grid]');
    if (!grid) return;
    const cells = grid.querySelectorAll('.bento__cell');

    // Ignore on touch devices (no hover); pointer:coarse detects that.
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

  /* ─── STICKY-SCROLL PROCESS · image swaps per active step ──
     Each step becomes active as it crosses viewport centre.
     Corresponding image in the sticky panel switches. */
  (function stickyProcess() {
    const steps = document.querySelectorAll('[data-scroll-steps] .process-scroll__step');
    const images = document.querySelectorAll('[data-scroll-images] .process-scroll__image');
    if (!steps.length || !images.length || !hasScrollTrigger) return;

    // Below 1024px the layout collapses to stacked (CSS media query);
    // no need for scroll-driven behaviour there.
    const isNarrow = () => window.matchMedia('(max-width: 1024px)').matches;
    if (isNarrow()) return;

    function activate(stepNum) {
      steps.forEach(s => s.classList.toggle('is-active', s.dataset.step === String(stepNum)));
      images.forEach(im => im.classList.toggle('is-active', im.dataset.step === String(stepNum)));
    }

    steps.forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top center',
        end: 'bottom center',
        onEnter:     () => activate(step.dataset.step),
        onEnterBack: () => activate(step.dataset.step),
      });
    });
  })();

  /* ─── FAB · reveal on scroll past hero ──────────────
     Hidden while user is above the hero bottom.
     Slides in from right (desktop) or bottom (mobile). */
  (function fabReveal() {
    const fab = document.querySelector('[data-fab]');
    const hero = document.querySelector('.hero');
    if (!fab || !hero || !hasScrollTrigger) {
      // Fallback: just show the FAB.
      if (fab) { fab.style.opacity = 1; fab.style.transform = 'none'; fab.style.pointerEvents = ''; }
      return;
    }

    const isMobile = () => window.matchMedia('(max-width: 720px)').matches;
    const hiddenX  = isMobile() ? 0    : 100;
    const hiddenY  = isMobile() ? 100  : 0;

    gsap.set(fab, { x: hiddenX, y: hiddenY, autoAlpha: 0, pointerEvents: 'none' });

    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom 80%',
      onEnter:     () => gsap.to(fab, { x: 0, y: 0, autoAlpha: 1, pointerEvents: 'auto', duration: 0.45, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(fab, { x: hiddenX, y: hiddenY, autoAlpha: 0, pointerEvents: 'none', duration: 0.25, ease: 'power2.in' }),
    });
  })();

  /* ─── ENQUIRY FORM · Apps Script POST + success checkmark ──
     Same guard as the original: if endpoint is placeholder,
     show banner + disable submit. */
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
      banner.innerHTML = "This form isn't connected yet — please WhatsApp or call us and we'll pick up the same day.";
      form.insertBefore(banner, form.firstChild);
      submit.disabled = true;
      if (label) label.textContent = 'Please WhatsApp us instead';
      return;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form._gotcha && form._gotcha.value) {
        showSuccess();
        return;
      }
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
      // Revert after 6s so user can send another
      setTimeout(() => {
        submit.classList.remove('is-success');
        if (label) label.textContent = 'Send enquiry';
      }, 6000);
    }
  })();

  // Log once so it's easy to see motion is live from devtools.
  if (window.console && console.info) {
    console.info('[motion] initialised · GSAP', gsap.version, '· ScrollTrigger', hasScrollTrigger ? 'ready' : 'missing', '· Lenis', hasLenis ? 'ready' : 'missing', REDUCED ? '· reduced-motion active' : '');
  }
})();
