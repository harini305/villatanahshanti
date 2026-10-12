import Image from 'next/image';
import PageHeader from '@/components/sections/PageHeader';
import CtaBand from '@/components/sections/CtaBand';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import { spa } from '@/data/pages';
import { buildMetadata } from '@/lib/metadata';
import styles from './spa.module.css';

export const metadata = buildMetadata({
  title: 'Exhale Spa',
  description:
    "Exhale, Villa Tanah Shanti's quiet and private in-house spa for guests: Balinese traditional massage, hot rock massage, facials, body scrubs, pedicures and manicures.",
  path: '/exhale-spa',
  og: 'spa',
});

export default function SpaPage() {
  const [p1, p2] = spa.paragraphs;
  const cut = p1.indexOf('. ') + 1;
  const [first, rest] = [p1.slice(0, cut), p1.slice(cut + 1)];
  return (
    <>
      <PageHeader eyebrow={spa.label} title="Our In-house" accent="Spa">
        <p>{first}</p>
      </PageHeader>

      <section className="section" aria-labelledby="spa-title">
        <div className={`container ${styles.split}`}>
          <div className={`${styles.media} hover-zoom`} data-reveal="clip">
            <Image
              src={spa.feature.src}
              alt={spa.feature.alt}
              fill
              preload

              quality={90}
              sizes="(min-width: 1024px) 104vw, 113vw"
              placeholder="blur"
              blurDataURL={spa.feature.blurDataURL}
              style={{ objectFit: 'cover', objectPosition: '100% 50%' }}
            />
          </div>
          <div className={styles.text}>
            <Eyebrow data-reveal>For guests only</Eyebrow>
            <h2 id="spa-title" data-reveal>
              Natural, organic and <em>locally made</em>
            </h2>
            <div className="prose" data-reveal>
              <p>{rest}</p>
              <p>{p2}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section section--cream ${styles.menuSection}`} aria-labelledby="treatments-title">
        <div className="container">
          <div className={styles.menu} data-reveal>
            <div className={styles.menuInner}>
              <Eyebrow center>Treatments</Eyebrow>
              <h2 id="treatments-title" className={styles.menuTitle}>
                {spa.listIntro}
              </h2>
              <ol role="list" className={styles.list}>
                {spa.treatments.map((t, i) => (
                  <li key={t} className={styles.item}>
                    <span className={styles.num} aria-hidden="true">
                      {['I', 'II', 'III', 'IV', 'V', 'VI'][i]}
                    </span>
                    <span className={styles.name}>{t}</span>
                  </li>
                ))}
              </ol>
              <p className={styles.note}>Planning a treatment during your stay? Let us know in advance so a therapist can attend.</p>
              <Button href="/contact-us">Ask about treatments</Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Indulge" title="Body treatments for which Bali is famous" image={spa.hero} position="86% 30%" parallax={false} reverse />
    </>
  );
}
