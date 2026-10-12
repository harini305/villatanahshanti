// The original wordmark: the rice-plant logo in a white oval forms the "V" of "Villa",
// followed by "illa Tanah Shanti" as live text. The composition is aria-hidden; the full
// name is provided as text for assistive technology and search engines.
import Image from 'next/image';
import { img } from '@/data/images';
import styles from './Wordmark.module.css';

const logo = img('logo-rice-plant');

export default function Wordmark({ size = 'hero', priority = false, className }) {
  return (
    <span className={[styles.wordmark, styles[size], className].filter(Boolean).join(' ')}>
      <span className="visually-hidden">Villa Tanah Shanti</span>
      <span className={styles.composition} aria-hidden="true">
        <span className={styles.oval}>
          <Image src={logo.src} width={logo.width} height={logo.height} alt="" preload={priority} sizes="(min-width: 1024px) 220px, 30vw" />
        </span>
        <span className={styles.text}>illa Tanah Shanti</span>
      </span>
    </span>
  );
}

export function LogoMark({ size = 48, className }) {
  return (
    <span className={[styles.mark, className].filter(Boolean).join(' ')} style={{ '--mark': `${size}px` }} aria-hidden="true">
      <Image src={logo.src} width={logo.width} height={logo.height} alt="" sizes={`${size * 2}px`} />
    </span>
  );
}
