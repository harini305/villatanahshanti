'use client';
// Grid of photo tiles; each tile is a button that opens the shared Lightbox at that photo.
import { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import Lightbox from './Lightbox';
import styles from './PhotoGrid.module.css';

// In the collage the lead photo fills 2×2 cells. For each column count (2, 3, 4) widen just enough
// of the last tiles to span two columns so every row ends flush, with no orphan tile.
function wideClasses(n, i) {
  return [2, 3, 4]
    .filter((cols) => {
      const extra = (cols - ((n + 3) % cols)) % cols;
      return i >= n - extra && i > 0;
    })
    .map((cols) => styles[`w${cols}`]);
}

export default function PhotoGrid({ images, title, layout = 'gallery', className }) {
  const [index, setIndex] = useState(null);

  return (
    <>
      <ul role="list" className={[styles.grid, styles[layout], className].filter(Boolean).join(' ')}>
        {images.map((image, i) => {
          const wide = layout === 'gallery' ? wideClasses(images.length, i) : [];
          const big = layout === 'gallery' && (i === 0 || wide.length > 0);
          return (
          <li key={image.src} className={[styles.item, ...wide].join(' ')} data-reveal>
            <button type="button" className={`${styles.tile} hover-zoom`} onClick={() => setIndex(i)}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  big
                    ? '(min-width: 1360px) 640px, (min-width: 768px) 66vw, 100vw'
                    : layout === 'gallery'
                      ? '(min-width: 1360px) 320px, (min-width: 768px) 33vw, 50vw'
                      : '(min-width: 1024px) 40vw, 100vw'
                }
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                className={styles.img}
              />
              <span className={styles.hover} aria-hidden="true">
                <Icon name="expand" size={20} />
              </span>
              <span className="visually-hidden">
                {' '}
                (open photo {i + 1} of {images.length}
                {title ? `, ${title}` : ''})
              </span>
            </button>
          </li>
          );
        })}
      </ul>
      <Lightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} title={title} />
    </>
  );
}
