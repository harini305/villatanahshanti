'use client';
// Off-canvas menu built on a native modal <dialog>: the browser provides the focus trap and
// makes the rest of the page inert. Esc, the close button, the backdrop and navigation all close it.
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap/register';
import { navItems, site } from '@/data/site';
import Icon from '@/components/ui/Icon';
import { LogoMark } from '@/components/brand/Wordmark';
import { toTopIfCurrent } from '@/lib/scroll';
import styles from './MobileMenu.module.css';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function MobileMenu({ open, onClose, returnFocusRef, pathname }) {
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const closing = useRef(false);

  // open / close with animation
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const panel = panelRef.current;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('scroll-locked');
      if (!reduced()) {
        gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
        gsap.fromTo(
          panel.querySelectorAll('[data-menu-item]'),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, delay: 0.1, ease: 'power3.out' }
        );
      }
    } else if (!open && dialog.open && !closing.current) {
      const finish = () => {
        closing.current = false;
        dialog.close();
        document.documentElement.classList.remove('scroll-locked');
        returnFocusRef.current?.focus();
      };
      if (reduced()) return finish();
      closing.current = true;
      gsap.to(panel, { autoAlpha: 0, duration: 0.25, ease: 'power1.in', onComplete: finish });
    }
  }, [open, returnFocusRef]);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // close on route change
  useEffect(() => {
    onCloseRef.current?.();
  }, [pathname]);

  // close when crossing to the desktop layout
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = (e) => e.matches && onCloseRef.current?.();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => () => document.documentElement.classList.remove('scroll-locked'), []);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      className={styles.dialog}
      aria-label="Site menu"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.top}>
          <span className={styles.brand} aria-hidden="true">
            <LogoMark size={40} />
            <span>Villa Tanah Shanti</span>
          </span>
          <button type="button" className={styles.close} onClick={onClose} autoFocus>
            <Icon name="close" size={22} />
            <span className="visually-hidden">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main">
          <ul role="list" className={styles.list}>
            {navItems.map((item) => {
              const current = pathname === (item.match ?? item.href);
              return (
                <li key={item.href} data-menu-item>
                  <Link href={item.href} className={styles.link} aria-current={current ? 'page' : undefined} onClick={(e) => { onClose(); toTopIfCurrent(e, item.href, pathname); }}>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.footer} data-menu-item>
          <a href={site.airbnbUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            Check availability on Airbnb
            <span className="visually-hidden"> (opens in new tab)</span>
          </a>
          <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
            <Icon name="facebook" size={18} />
            Villa Tanah Shanti on Facebook
            <span className="visually-hidden"> (opens in new tab)</span>
          </a>
          <p className={styles.tagline}>{site.tagline}</p>
        </div>
      </div>
    </dialog>
  );
}
