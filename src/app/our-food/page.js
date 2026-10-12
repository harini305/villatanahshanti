import Image from 'next/image';
import PageHeader from '@/components/sections/PageHeader';
import CtaBand from '@/components/sections/CtaBand';
import Eyebrow from '@/components/ui/Eyebrow';
import { food } from '@/data/pages';
import { img } from '@/data/images';
import { buildMetadata } from '@/lib/metadata';
import styles from './food.module.css';

export const metadata = buildMetadata({
  title: 'Our Cuisine',
  description:
    'A completely gluten free kitchen with bread baked on the premises: Balinese-based meals with a twist, fresh drinks, herbal teas and young coconuts at Villa Tanah Shanti.',
  path: '/our-food',
  og: 'food',
});

// Restated from the food copy.
const highlights = [
  'A completely gluten free kitchen',
  'Bread baked on the premises',
  'Fresh seasonal produce, organic when available',
  'Fresh drinks menu and herbal teas all day',
  'Young coconuts from our coconut stand',
];

const coconuts = img('young-coconuts');

export default function FoodPage() {
  const [p1, p2, p3, p4] = food.paragraphs;
  const cut = p1.indexOf('. ') + 1;
  const [first, rest] = [p1.slice(0, cut), p1.slice(cut + 1)];
  const [curry, wraps, salad] = food.dishes;
  return (
    <>
      <PageHeader eyebrow={food.label} title="Our" accent="Cuisine">
        <p>{first}</p>
      </PageHeader>

      {/* Dishes collage */}
      <section className="section" aria-label="Dishes from our kitchen">
        <div className={`container ${styles.collage}`}>
          <figure className={`${styles.dish} ${styles.dishLead}`} data-reveal="clip">
            <div className={`${styles.dishImg} hover-zoom`}>
              <Image src={curry.src} alt={curry.alt} fill preload quality={90} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 100vw, 100vw" style={{ objectFit: 'contain' }} />
            </div>
            <figcaption>We think, the best cashew curry in Bali!</figcaption>
          </figure>
          <figure className={`${styles.dish} ${styles.dishB}`} data-reveal="clip">
            <div className={`${styles.dishImg} hover-zoom`}>
              <Image src={wraps.src} alt={wraps.alt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw" placeholder="blur" blurDataURL={wraps.blurDataURL} style={{ objectFit: 'cover' }} />
            </div>
            <figcaption>Our tasty Mexican bean wrap</figcaption>
          </figure>
          <figure className={`${styles.dish} ${styles.dishC}`} data-reveal="clip">
            <div className={`${styles.dishImg} hover-zoom`}>
              <Image src={salad.src} alt={salad.alt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw" placeholder="blur" blurDataURL={salad.blurDataURL} style={{ objectFit: 'cover' }} />
            </div>
            <figcaption>Fresh from our kitchen</figcaption>
          </figure>
        </div>
      </section>

      {/* Kitchen */}
      <section className="section section--white" aria-labelledby="kitchen-title">
        <div className={`container ${styles.kitchen}`}>
          <div className={styles.kitchenText}>
            <Eyebrow data-reveal>Made on the premises</Eyebrow>
            <h2 id="kitchen-title" data-reveal>
              Our amazing staff take <em>great pride</em>
            </h2>
            <div className="prose" data-reveal>
              <p>{rest}</p>
            </div>
          </div>
          <ul role="list" className={styles.highlights}>
            {highlights.map((h, i) => (
              <li key={h} data-reveal>
                <span className={styles.hNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Twist */}
      <section className={`section ${styles.twist}`} aria-labelledby="twist-title">
        <div className="container-text">
          <Eyebrow center data-reveal className={styles.twistEyebrow}>
            Balinese, with a twist
          </Eyebrow>
          <h2 id="twist-title" className="visually-hidden">
            Balinese cuisine with a twist
          </h2>
          <p className={styles.twistText} data-reveal>
            {p2}
          </p>
        </div>
      </section>

      {/* Coconut */}
      <section className="section section--cream" aria-labelledby="coconut-title">
        <div className={`container ${styles.coconut}`}>
          <div className={`${styles.coconutImg} hover-zoom`} data-reveal="clip">
            <Image src={coconuts.src} alt={coconuts.alt} fill sizes="(min-width: 1024px) 80vw, 190vw" placeholder="blur" blurDataURL={coconuts.blurDataURL} style={{ objectFit: 'cover' }} data-parallax />
          </div>
          <div className={styles.coconutText}>
            <Eyebrow data-reveal>Breakfasts &amp; drinks</Eyebrow>
            <h2 id="coconut-title" data-reveal>
              Do as the <em>Balinese do</em>
            </h2>
            <div className="prose" data-reveal>
              <p>{p3}</p>
            </div>
          </div>
        </div>
        <div className={`container ${styles.quoteWrap}`}>
          <p className={styles.quote} data-reveal>
            {p4}
          </p>
        </div>
      </section>

      <CtaBand eyebrow="Stay & dine" title="Amazing banquets or, if you wish, just a simple meal" image={img('living-dining-wide')} />
    </>
  );
}
