# Animation Plan — GSAP + ScrollTrigger

## 1. What the source site does today [O]

| Animation | Evidence | Notes |
|---|---|---|
| Entrance animation on 3 hero elements per page (logo oval, wordmark, tagline/title) | `data-motion-enter="done"` on 3 components per page | Wix "entrance" presets. The type (fade, float, glide) can't be read back after playing [E: fade/float-in ~1 s] |
| Page background | `data-motion-part="BG_LAYER/BG_MEDIA/BG_IMG"`, `data-bg-effect-name=""` (empty) | **No** parallax or scroll effect configured on backgrounds [O] |
| Nav button hover | Background #A99E98 → #544943, text #FFF → #D4CAC5 | Wix default transition [E: ~0.2 s] |
| Gallery hover | Pro Gallery `item-hover` overlay | Overlay plus icons on hover |
| Lightbox | Full-screen fade, slide between images | Pro Gallery default |
| Back-to-top | Third-party iframe widget | Smooth scroll [E] |
| Scroll-triggered reveals | None observed | — |

The source is nearly static, so motion in the rebuild is an enhancement. It must stay light.

## 2. Principles

1. **Purposeful only:** motion clarifies hierarchy (what to read first), gives feedback, or adds calm atmosphere. No decorative motion on every element.
2. **Subtle:** reveals are 0.4–0.6 s, `power2.out` / `power3.out`, distances 16–32 px, opacity from 0. Parallax at most ±8–12 % of element height.
3. **No scroll hijacking**, no smooth-scroll libraries, no forced snapping. **Pinning is not used** in the base plan.
4. **Content first:** every element is fully visible in the server-rendered HTML. Animation only *enhances* after hydration (progressive enhancement). If JS fails, nothing is hidden.
5. **Reduced motion:** `prefers-reduced-motion: reduce` → no transforms or parallax. At most instant or opacity-only fades ≤ 0.2 s.
6. **No layout shift:** animate only `transform` and `opacity`. Images have reserved dimensions (`next/image` width/height). Never animate width, height or top.
7. **No horizontal overflow:** x-offset reveals are clipped by `overflow-x: clip` on section wrappers, or avoided on mobile (use y-offsets only below 768 px).
8. **Clean lifecycle:** all GSAP code runs in client components via `useGSAP()` from `@gsap/react` with a `scope` ref. Contexts revert on unmount and route change, so ScrollTriggers are never duplicated.

## 3. Avoiding a flash of hidden content

- No CSS sets `opacity: 0` by default.
- In `useGSAP`, use `gsap.from()` (or `gsap.set` immediately followed by the tween) inside a `gsap.matchMedia()` block. On the server and with JS off, elements render visible.
- To avoid a one-frame flash of the final state before the hero intro, set a `js` class on `<html>` from an inline script in `layout.js` (tiny, synchronous). Then hide only `.js [data-hero-intro]` with `visibility: hidden`, and `autoAlpha` reveals it. A CSS fallback animation unhides after 1.5 s in case JS errors.

## 4. Shared utilities (`src/lib/gsap/`)

```
src/lib/gsap/
  register.js        // 'use client'; gsap.registerPlugin(ScrollTrigger, useGSAP) once; sets defaults
  useReveal.js       // hook: batch reveal of [data-reveal] children in a scope
  useParallax.js     // hook: scrub parallax for [data-parallax] images
  motion.js          // tokens: durations, eases, distances
```

```js
// motion.js
export const MOTION = {
  dur: { fast: 0.2, base: 0.5, slow: 0.6, hero: 0.9 },
  ease: { out: 'power2.out', outStrong: 'power3.out', inOut: 'power1.inOut' },
  dist: { sm: 16, md: 24, lg: 32 },
  stagger: 0.08,
};
```

`useReveal` sketch:
```js
'use client';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from './register';
import { MOTION } from './motion';

export function useReveal(scope) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ ok: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { reduce } = ctx.conditions;
      const items = gsap.utils.toArray('[data-reveal]', scope.current);
      if (reduce) return; // content is already visible
      ScrollTrigger.batch(items, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => gsap.from(batch, {
          autoAlpha: 0, y: MOTION.dist.md, duration: MOTION.dur.base,
          ease: MOTION.ease.out, stagger: MOTION.stagger, overwrite: true,
          clearProps: 'transform,opacity,visibility',
        }),
      });
    });
    return () => mm.revert();
  }, { scope });
}
```

Notes:
- `once: true` avoids re-triggering and saves memory.
- `clearProps` returns elements to their natural CSS after animating, so hover transforms aren't fighting inline styles.
- `ScrollTrigger.refresh()` runs after fonts load (`document.fonts.ready`) and after hero images decode, so start positions are correct.
- Elements already in view on load animate immediately; `batch` handles this.

## 5. Per-page plan

### Global
| Element | Animation | Timing | Trigger |
|---|---|---|---|
| Header | Fades in with the hero timeline on first load only. On scroll down past 80 px it gains a solid background and shadow (CSS class toggle via a ScrollTrigger `onToggle`, CSS transition 0.3 s). **No hide-on-scroll** (keeps navigation predictable). | 0.3 s | ScrollTrigger `start: 80` |
| Mobile menu | Panel slides from the right (`xPercent: 100 → 0`), links stagger in (`y: 12`, 0.04 s). Reverse on close. Under reduced motion: opacity only. | 0.4 s | Click |
| Links/buttons | CSS transitions only (underline scale-x, colour) | 0.2 s | Hover/focus |
| Back-to-top | Fade + scale 0.9 → 1 when visible | 0.25 s | ScrollTrigger `start: 100vh` |
| Section headings + eyebrow pills | Reveal `y: 24`, pill first then heading (stagger 0.08) | 0.5 s | `top 85%` |
| Paragraph blocks | Reveal as a whole block (not per line or word) | 0.5 s | `top 85%` |

### Home `/`
| Element | Animation | Notes |
|---|---|---|
| Hero intro timeline (load) | 1) Background image scale 1.06 → 1 and fade (1.2 s, `power2.out`) · 2) Logo oval scale 0.9 → 1 + fade (0.6 s) · 3) Wordmark `y: 24` → 0 (0.6 s, overlap −0.3) · 4) "Ubud, Bali" and tagline pill fade/slide (0.5 s, stagger 0.1) · 5) Video card `y: 32` fade (0.6 s) | Total ≈ 1.6 s; content is interactive immediately (no blocking) |
| Hero background | Gentle parallax: `yPercent: 0 → 10` scrub on the bg image while the hero scrolls out | Disabled under reduced motion and on touch/coarse pointers < 768 px |
| About card | Reveal; lime accent bar draws `scaleX: 0 → 1` (0.6 s) | Transform origin left |
| Team photo | Clip-path reveal `inset(10% 0 10% 0)` → `inset(0)` + tiny scale 1.04 → 1 | 0.6 s; opacity-only under reduced motion |
| Staff names list | Stagger reveal (0.06) | — |
| CTA band | Reveal | — |

### Our Rooms `/our-rooms`
| Element | Animation |
|---|---|
| Page intro | Title `y: 24` + underline bar draw (0.5 s) |
| Room image | Reveal `y: 32` + fade (0.6 s); inner image parallax `yPercent: -6 → 6` scrub within the frame (frame `overflow: hidden`). Desktop only. |
| Room text | Reveal 0.1 s after the image |
| "View photos" button | CSS hover only |
| Room quick-nav (Agung · Batukaru · Catur · Batur · Abang · Kitchen) | Sticky on desktop (CSS `position: sticky`, not GSAP pin). The active link updates via ScrollTrigger `onToggle` per section (no animation, just `aria-current="true"` plus underline) |

### Yoga / Spa / Food
- Page intro as Rooms; hero image reveal + mild parallax; paragraph reveals.
- Spa treatment list: stagger `y: 12`, 0.05 s per item (6 items).
- Food: 3 images reveal with stagger 0.1. Hover zoom on desktop is CSS only (`scale(1.03)`, 0.4 s).
- Yoga extras gallery: same tiles as the main gallery.

### Photos `/photos`
- Category chips bar: sticky (CSS). The active chip is synced via ScrollTrigger.
- Tiles: `ScrollTrigger.batch` reveal (`y: 16`, 0.4 s, stagger 0.04, `once`). **No parallax** on the gallery (too many triggers, motion-heavy).
- Lightbox open: backdrop fade 0.25 s; image scale 0.96 → 1 + fade 0.3 s. Next/prev: crossfade + 24 px slide (0.35 s). Reduced motion: instant swap.
- Hover: CSS `scale(1.02)` and a darkened overlay with a magnifier icon (also shown on `:focus-visible`).

### Contact `/contact-us`
- Form card reveal; field focus styles via CSS.
- Submit: button state change (CSS). Success/error message fades in (0.3 s), `role="status"` announced.
- Map: no animation (iframe).

### 404
- Logo plant gentle sway (rotate ±2°, 3 s yoyo, `sine.inOut`), only under `no-preference`. Stops after 3 cycles.

## 6. Performance budget
- At most ~25 active ScrollTriggers on any page (the gallery uses `batch` = 1 trigger per batch group). Most pages use under 15.
- Parallax only on ≤ 1 element per viewport, `will-change: transform` applied only during the active range.
- GSAP core + ScrollTrigger ≈ 70 KB min (≈ 27 KB gzipped). Loaded only in client components that need it. Pages stay server components.
- No animation on `filter`, `box-shadow`, layout properties.
- Test at 4× CPU throttle in DevTools for jank (TEST_PLAN §5).

## 7. Cleanup & correctness checklist
- [ ] Every `useGSAP` has a `scope` and returns a `mm.revert()`/context cleanup.
- [ ] No `ScrollTrigger.create` outside `useGSAP` or a context.
- [ ] `ScrollTrigger.refresh()` after fonts and image load; `ScrollTrigger.clearScrollMemory()` not needed (Next handles scroll restoration).
- [ ] Navigating Home → Rooms → Home gives the same trigger count (checked via `ScrollTrigger.getAll().length` in dev).
- [ ] React Strict Mode double-mount doesn't duplicate triggers (`useGSAP` handles this).
- [ ] With JS disabled, all content is visible and readable.
- [ ] With `prefers-reduced-motion: reduce`, no transforms occur (verify with DevTools rendering emulation).
- [ ] No horizontal scrollbar during any animation at 320/390/768 px.
- [ ] CLS < 0.05 with animations on.
