// Closing invitation used across the site: a full-bleed photograph beside a quiet text panel.
// Body copy is the original About invitation; buttons lead to real destinations only.
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import { img } from '@/data/images';
import { site } from '@/data/site';
import styles from './CtaBand.module.css';

const pool = img('living-infinity-pool');

export default function CtaBand({
  eyebrow = 'Plan your stay',
  title = 'A retreat, a training event or simply a holiday base',
  image = pool,
  reverse = false,
  position = '50% 50%',
  parallax = true,
}) {
  return (
    <section className={`${styles.band} ${reverse ? styles.reverse : ''}`} aria-labelledby="cta-title">
      <div className={`${styles.media} hover-zoom`}>
        <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 84vw, 125vw" placeholder="blur" blurDataURL={image.blurDataURL} style={{ objectFit: 'cover', objectPosition: position }} data-parallax={parallax ? '' : undefined} />
      </div>
      <div className={styles.panel}>
        <div className={styles.content}>
          <Eyebrow data-reveal>{eyebrow}</Eyebrow>
          <h2 id="cta-title" className={styles.title} data-reveal>
            {title}
          </h2>
          <p className={styles.text} data-reveal>
            We invite you to come and experience our hospitality and impeccable service, beautiful food, exquisite surroundings and let us share
            with you everything else that the Island of the Gods has to offer you.
          </p>
          <div className={styles.actions} data-reveal>
            <Button href={site.airbnbUrl} external>
              Check availability
            </Button>
            <Button href="/contact-us" variant="ghost">
              Send an enquiry
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
