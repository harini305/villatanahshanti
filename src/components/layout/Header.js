'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems, site } from '@/data/site';
import { LogoMark } from '@/components/brand/Wordmark';
import Icon from '@/components/ui/Icon';
import { toTopIfCurrent } from '@/lib/scroll';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

export function isCurrent(item, pathname) {
  const path = item.match ?? item.href;
  return pathname === path;
}

const left = navItems.slice(0, 4);
const right = navItems.slice(4);

export default function Header() {
  const pathname = usePathname();
  const overlay = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = (items) =>
    items.map((item) => (
      <li key={item.href}>
        <Link
          href={item.href}
          className={styles.navLink}
          aria-current={isCurrent(item, pathname) ? 'page' : undefined}
          onClick={(e) => toTopIfCurrent(e, item.href, pathname)}
        >
          {item.label}
        </Link>
      </li>
    ));

  const cls = [styles.header, overlay && styles.overlay, (scrolled || !overlay) && styles.solid, scrolled && styles.scrolled, overlay && !scrolled && 'on-dark']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={cls}>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Main">
          <ul role="list" className={styles.navList}>
            {links(left)}
            <li className={styles.brandSlot} aria-hidden="true" />
            {links(right)}
          </ul>
        </nav>

        <Link href="/" className={styles.brand} aria-label="Villa Tanah Shanti, home" onClick={(e) => toTopIfCurrent(e, '/', pathname)}>
          <LogoMark size={40} className={styles.mark} />
          <span className={styles.brandText} aria-hidden="true">
            <span className={styles.brandName}>Villa Tanah Shanti</span>
            <span className={styles.brandPlace}>Ubud · Bali</span>
          </span>
        </Link>

        <div className={styles.actions}>
          <a href={site.airbnbUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            <span>Check availability</span>
            <span className="visually-hidden"> on Airbnb (opens in new tab)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className={styles.toggleLabel}>Menu</span>
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={toggleRef} pathname={pathname} />
    </header>
  );
}
