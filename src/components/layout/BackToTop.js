'use client';
// Floating "Back to top" control (replaces the original's per-page buttons and iframe widget).
// Appears after one viewport of scrolling; returns focus to the top of the page.
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import styles from './BackToTop.module.css';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('top')?.focus({ preventScroll: true });
  };

  return (
    <button type="button" className={`${styles.btn} ${visible ? styles.visible : ''}`} onClick={toTop} tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
      <Icon name="arrowUp" size={22} />
      <span className="visually-hidden">Back to top</span>
    </button>
  );
}
