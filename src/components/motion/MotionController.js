'use client';
// One route-aware controller for the site's scroll motion. It runs after each route commit,
// builds the triggers for that page only, and reverts them all (inline styles included)
// before the next route, so ScrollTriggers never duplicate across navigation.
//
// Markup hooks (rendered by server components, fully visible without JS):
//   [data-hero-intro]   staggered intro on load (hidden only under html.js, see globals.css)
//   [data-hero-bg]      slow settle (scale 1.06 → 1) on load, gentle parallax while scrolling out
//   [data-reveal]       text/blocks rise and fade in when scrolled into view
//   [data-reveal=clip]  photographs wipe upward while the image settles from a slight zoom
//   [data-parallax]     image drifts inside its overflow-hidden frame (fine pointers ≥ 768px only)
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap/register';
import { MEDIA } from '@/lib/gsap/motion';

// Back/forward navigations keep the browser's scroll restoration; menu clicks start at the top.
let poppedState = false;
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    poppedState = true;
  });
}

export default function MotionController() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useGSAP(
    () => {
      const main = document.getElementById('main');
      if (!main) return;
      const q = (sel) => gsap.utils.toArray(sel, main);
      const set = (els, vars) => els.length && gsap.set(els, vars);
      const mm = gsap.matchMedia();

      const fades = q('[data-reveal]:not([data-reveal="clip"])');
      const clips = q('[data-reveal="clip"]');

      // Reduced motion: no movement, only short opacity fades.
      mm.add(MEDIA.reduce, () => {
        set(q('[data-hero-intro]'), { autoAlpha: 1 });
        const all = [...fades, ...clips];
        set(all, { opacity: 0 });
        if (all.length)
          ScrollTrigger.batch(all, {
            start: 'top 92%',
            once: true,
            onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 0.6, ease: 'none', stagger: 0.05, overwrite: true, clearProps: 'opacity' }),
          });
      });

      mm.add(MEDIA.motion, () => {
        // Hero intro
        const intro = q('[data-hero-intro]');
        const bg = q('[data-hero-bg]');
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (bg.length) tl.fromTo(bg, { scale: 1.08 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, 0);
        if (intro.length) {
          tl.fromTo(intro, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, clearProps: 'transform' }, 0.15);
        }

        // Text and blocks: rise and fade. Opacity only (never visibility), so content that hasn't
        // been revealed yet stays focusable and readable by assistive technology.
        set(fades, { opacity: 0, y: 44 });
        if (fades.length)
          ScrollTrigger.batch(fades, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.95,
                ease: 'power3.out',
                stagger: 0.11,
                overwrite: true,
                clearProps: 'transform,opacity',
              }),
          });

        // Photographs: a curtain wipe from the bottom while the picture settles from a zoom.
        clips.forEach((el) => {
          const pic = el.querySelector('img');
          const parallax = pic?.hasAttribute('data-parallax');
          gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' });
          if (pic) gsap.set(pic, { scale: 1.28 });
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' });
              if (pic) gsap.to(pic, { scale: parallax ? 1.12 : 1, duration: 1.8, ease: 'power3.out', clearProps: parallax ? '' : 'transform' });
            },
          });
        });

        // Keyboard users can tab ahead of the scroll triggers: show anything that gains focus at once.
        // Keyboard focus only: snapping a block into place under a mouse press would move the
        // target between mousedown and mouseup and swallow the click.
        const onFocus = (e) => {
          if (!e.target.matches?.(':focus-visible')) return;
          const el = e.target.closest?.('[data-reveal]');
          if (!el) return;
          gsap.set(el, { opacity: 1, y: 0, clipPath: 'none' });
          const pic = el.querySelector('img');
          if (pic && !pic.hasAttribute('data-parallax')) gsap.set(pic, { scale: 1 });
        };
        main.addEventListener('focusin', onFocus);
        return () => main.removeEventListener('focusin', onFocus);
      });

      mm.add(MEDIA.parallax, () => {
        q('[data-hero-bg]').forEach((el) => {
          gsap.to(el, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true },
          });
        });
        q('[data-parallax]').forEach((el) => {
          if (!el.closest('[data-reveal="clip"]')) gsap.set(el, { scale: 1.12 });
          gsap.fromTo(
            el,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
            }
          );
        });
      });

      // Where the page should be once ScrollTrigger has measured it. A refresh restores the scroll
      // position it saw when it began, which would otherwise undo Next's jump to the top of a new
      // page (or to a #hash target such as /#about).
      const isNavigation = !firstRender.current && !poppedState;
      firstRender.current = false;
      poppedState = false;
      const place = () => {
        ScrollTrigger.removeEventListener('refresh', place);
        const id = decodeURIComponent(window.location.hash.slice(1));
        const target = id && document.getElementById(id);
        if (target) {
          if (Math.abs(target.getBoundingClientRect().top) > 120) target.scrollIntoView({ behavior: 'instant' });
        } else if (isNavigation && window.scrollY !== 0) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      };
      if (window.location.hash || isNavigation) {
        place();
        ScrollTrigger.addEventListener('refresh', place);
        ScrollTrigger.refresh();
      }

      // Recalculate positions once web fonts have settled.
      let alive = true;
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

      // Diagnostic used by the Playwright suite to prove triggers don't accumulate across routes.
      window.__vtsTriggerCount = () => ScrollTrigger.getAll().length;

      return () => {
        alive = false;
        ScrollTrigger.removeEventListener('refresh', place);
        mm.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return null;
}
