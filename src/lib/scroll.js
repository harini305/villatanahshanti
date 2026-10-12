// Clicking the link for the page you're already on returns to the top of it.
export function toTopIfCurrent(e, href, pathname) {
  if (href === pathname) {
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
}
