'use client';
// Sticky in-page navigation (room quick-nav, gallery categories). The link for the section
// currently in view is marked with aria-current="true".
import { useEffect, useRef, useState } from 'react';
import styles from './SectionNav.module.css';

export default function SectionNav({ items, label }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef(null);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  // keep the active chip visible in the horizontally scrolling list on small screens
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector('[aria-current="true"]');
    if (!list || !el) return;
    const left = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2;
    list.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  return (
    <nav className={styles.nav} aria-label={label}>
      <div className={`container ${styles.inner}`}>
        <ul ref={listRef} role="list" className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={styles.link} aria-current={active === item.id ? 'true' : undefined}>
                {item.label}
                {item.count !== undefined && <span className={styles.count}>{item.count}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
