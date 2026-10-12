'use client';
// Full-screen photo viewer on a native modal <dialog> (focus trap + inert background for free).
// Keys: ←/→ previous/next, Home/End first/last, Esc closes. Touch: swipe left/right.
// Locks page scroll while open and returns focus to the control that opened it.
import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap/register';
import Icon from '@/components/ui/Icon';
import styles from './Lightbox.module.css';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Lightbox({ images, index, onClose, onIndexChange, title }) {
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const returnFocus = useRef(null);
  const swipe = useRef(null);
  const swipedAt = useRef(0);
  const dir = useRef(0);
  const open = index !== null && index !== undefined;
  const count = images.length;
  const current = open ? images[index] : null;

  const go = useCallback(
    (next) => {
      if (!open) return;
      const i = (next + count) % count;
      dir.current = next > index ? 1 : -1;
      onIndexChange(i);
    },
    [open, count, index, onIndexChange]
  );

  // open / close the native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement;
      dialog.showModal();
      document.documentElement.classList.add('scroll-locked');
      if (!reduced()) gsap.fromTo(dialog, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => () => document.documentElement.classList.remove('scroll-locked'), []);

  // animate between photos
  useEffect(() => {
    if (!open || !stageRef.current || reduced()) return;
    gsap.fromTo(
      stageRef.current,
      { autoAlpha: 0, x: dir.current * 24, scale: dir.current ? 1 : 0.97 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform' }
    );
    dir.current = 0;
  }, [index, open]);

  const handleClosed = () => {
    document.documentElement.classList.remove('scroll-locked');
    const el = returnFocus.current;
    if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      dir.current = -1;
      onIndexChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      dir.current = 1;
      onIndexChange(count - 1);
    }
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swipedAt.current = Date.now();
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  const neighbours = open && count > 1 ? [images[(index + 1) % count], images[(index - 1 + count) % count]] : [];

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={title ? `${title} photos` : 'Photo viewer'}
      onClose={handleClosed}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (Date.now() - swipedAt.current < 400) return;
        if (e.target === e.currentTarget || e.target.dataset?.backdrop !== undefined) dialogRef.current?.close();
      }}
    >
      {open && (
        <div className={styles.shell}>
          <div className={styles.topbar}>
            <p className={styles.counter} aria-live="polite" aria-atomic="true">
              {title && <span className={styles.title}>{title}</span>}
              <span>
                Photo {index + 1} of {count}
              </span>
            </p>
            <button type="button" className={styles.iconBtn} onClick={() => dialogRef.current?.close()} autoFocus>
              <Icon name="close" size={24} />
              <span className="visually-hidden">Close photo viewer</span>
            </button>
          </div>

          <div className={styles.stageWrap} data-backdrop onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <figure ref={stageRef} className={styles.stage} data-backdrop>
              <div className={styles.frame}>
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="100vw"
                  quality={90}
                  placeholder="blur"
                  blurDataURL={current.blurDataURL}
                  className={styles.image}
                  draggable={false}
                />
              </div>
              <figcaption className={styles.caption}>{current.alt}</figcaption>
            </figure>

            {count > 1 && (
              <>
                <button type="button" className={`${styles.iconBtn} ${styles.nav} ${styles.prev}`} onClick={() => go(index - 1)}>
                  <Icon name="arrowLeft" size={24} />
                  <span className="visually-hidden">Previous photo</span>
                </button>
                <button type="button" className={`${styles.iconBtn} ${styles.nav} ${styles.next}`} onClick={() => go(index + 1)}>
                  <Icon name="arrowRight" size={24} />
                  <span className="visually-hidden">Next photo</span>
                </button>
              </>
            )}
          </div>

          {/* warm the neighbouring photos so next/previous feels instant */}
          <div className={styles.preload} aria-hidden="true">
            {neighbours.map((n) => (
              <Image key={n.src} src={n.src} alt="" width={n.width} height={n.height} sizes="100vw" quality={90} loading="eager" />
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
