import Image from 'next/image';
import PageHeader from '@/components/sections/PageHeader';
import CtaBand from '@/components/sections/CtaBand';
import PhotoGrid from '@/components/media/PhotoGrid';
import Eyebrow from '@/components/ui/Eyebrow';
import { yoga } from '@/data/pages';
import { img } from '@/data/images';
import { buildMetadata } from '@/lib/metadata';
import styles from './yoga.module.css';

export const metadata = buildMetadata({
  title: 'Our Yoga Shala',
  description:
    "Villa Tanah Shanti's fully equipped yoga shala in Ubud: a sprung timber floor open to nature, with views of the infinity pool and jungle ravine. Ideal for retreats.",
  path: '/yoga-space',
  og: 'yoga',
});

// First sentence of the original copy leads the page; the rest follows verbatim below.
const splitFirst = (p) => {
  const i = p.indexOf('. ') + 1;
  return [p.slice(0, i), p.slice(i + 1)];
};

const pool = img('living-infinity-pool-edge');
const ganesha = img('ganesha-statue');

export default function YogaPage() {
  const [p1, p2, p3, p4] = yoga.paragraphs;
  const [first, rest] = splitFirst(p1);
  return (
    <>
      <PageHeader eyebrow={yoga.label} title="Our Yoga" accent="Shala">
        <p>{first}</p>
      </PageHeader>

      <div className={`container ${styles.banner} hover-zoom`} data-reveal="clip">
        <Image
          src={yoga.hero.src}
          alt={yoga.hero.alt}
          fill
          preload

          quality={90}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={yoga.hero.blurDataURL}
          style={{ objectFit: 'cover', objectPosition: '50% 62%' }}
          data-parallax
        />
      </div>

      {/* The space */}
      <section className="section" aria-labelledby="space-title">
        <div className={`container ${styles.space}`}>
          <aside className={styles.spec} aria-label="The space at a glance">
            {yoga.features.map((f) => (
              <p key={f.label} className={styles.specItem} data-reveal>
                <span className={styles.specValue}>{f.value}</span>
                <span className={styles.specLabel}>{f.label}</span>
              </p>
            ))}
          </aside>
          <div className={styles.spaceText}>
            <Eyebrow data-reveal>Retreats &amp; trainings</Eyebrow>
            <h2 id="space-title" data-reveal>
              A breath-taking and yet practical, <em>fully equipped space</em>
            </h2>
            <div className="prose" data-reveal>
              <p>{rest}</p>
              <p>{p2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sound */}
      <section className={`section section--white ${styles.sound}`} aria-labelledby="sound-title">
        <div className="container">
          <Eyebrow center data-reveal className={styles.soundEyebrow}>
            Nature&rsquo;s soundtrack
          </Eyebrow>
          <h2 id="sound-title" className={styles.soundTitle} data-reveal>
            Your very own <em>symphony of sound</em>
          </h2>
          <div className={`prose ${styles.soundText}`} data-reveal>
            <p>{p3}</p>
          </div>
          <div className={styles.pair}>
            <div className={`${styles.pairImg} ${styles.pairTall} hover-zoom`} data-reveal="clip">
              <Image
                src={ganesha.src}
                alt={ganesha.alt}
                fill
                sizes="(min-width: 900px) 80vw, 220vw"
                placeholder="blur"
                blurDataURL={ganesha.blurDataURL}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={`${styles.pairImg} ${styles.pairWide} hover-zoom`} data-reveal="clip">
              <Image src={pool.src} alt={pool.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" blurDataURL={pool.blurDataURL} style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="section section--cream" aria-labelledby="equipment-title">
        <div className={`container ${styles.equipment}`}>
          <div className={styles.equipHead}>
            <Eyebrow data-reveal>Equipment</Eyebrow>
            <h2 id="equipment-title" data-reveal>
              Fully <em>equipped</em>
            </h2>
            <div className="prose" data-reveal>
              <p>{p4}</p>
            </div>
          </div>
          <ol role="list" className={styles.equipList}>
            {yoga.equipment.map((e, i) => (
              <li key={e} data-reveal>
                <span className={styles.equipNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {e}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Photos (incl. the images recovered from the legacy yoga page) */}
      <section className="section" aria-labelledby="yoga-photos-title">
        <div className="container">
          <div className={styles.photosHead}>
            <Eyebrow data-reveal>Photos</Eyebrow>
            <h2 id="yoga-photos-title" data-reveal>
              Around <em>the shala</em>
            </h2>
          </div>
          <PhotoGrid images={yoga.photos} title="Yoga Shala" layout="strip" />
        </div>
      </section>

      <CtaBand eyebrow="Host a retreat" title="A beautiful place to hold yoga retreats and trainings" image={img('living-poolside-yoga')} />
    </>
  );
}
