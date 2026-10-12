'use client';
// Room-specific photo access: the framed hero photo, a strip of thumbnails and a
// "View photos" button, all opening that room's set in the Lightbox.
import { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import Lightbox from './Lightbox';
import styles from './RoomPhotos.module.css';

export default function RoomPhotos({ name, hero, photos, priority = false }) {
  const [index, setIndex] = useState(null);
  const heroIndex = Math.max(0, photos.findIndex((p) => p.src === hero.src));
  const thumbs = photos.map((p, i) => ({ p, i })).filter(({ i }) => i !== heroIndex).slice(0, 3);
  const remaining = photos.length - 1 - thumbs.length;

  return (
    <div className={styles.wrap}>
      <button type="button" className={`${styles.hero} hover-zoom`} onClick={() => setIndex(heroIndex)} data-reveal="clip">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          preload={priority}
          quality={90}
          sizes="(min-width: 1360px) 1280px, 94vw"
          placeholder="blur"
          blurDataURL={hero.blurDataURL}
          className={styles.heroImg}
        />
        <span className="visually-hidden"> (open {name} photos)</span>
        <span className={styles.zoom} aria-hidden="true">
          <Icon name="expand" size={20} />
        </span>
      </button>

      <ul role="list" className={styles.thumbs}>
        {thumbs.map(({ p, i }, n) => (
          <li key={p.src}>
            <button type="button" className={`${styles.thumb} hover-zoom card-lift`} onClick={() => setIndex(i)}>
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 200px, 31vw" placeholder="blur" blurDataURL={p.blurDataURL} className={styles.thumbImg} />
              {n === thumbs.length - 1 && remaining > 0 && (
                <span className={styles.more} aria-hidden="true">
                  +{remaining}
                </span>
              )}
              <span className="visually-hidden">
                {' '}
                (open photo {i + 1} of {photos.length})
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className={styles.viewAll} onClick={() => setIndex(0)}>
        <Icon name="images" size={20} />
        View photos <span className={styles.count}>({photos.length})</span>
        <span className="visually-hidden"> of {name}</span>
      </button>

      <Lightbox images={photos} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} title={name} />
    </div>
  );
}
