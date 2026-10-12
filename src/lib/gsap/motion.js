// Motion tokens shared by every GSAP animation (ANIMATION_PLAN.md §4).
export const MOTION = {
  dur: { fast: 0.2, base: 0.5, slow: 0.6, hero: 0.9 },
  ease: { out: 'power2.out', outStrong: 'power3.out', inOut: 'power1.inOut' },
  dist: { sm: 16, md: 24, lg: 32 },
  stagger: 0.08,
};

// gsap.matchMedia conditions used across the app.
export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  // parallax only for fine pointers on wider screens (saves low-powered touch devices)
  parallax: '(prefers-reduced-motion: no-preference) and (min-width: 768px) and (pointer: fine)',
};
