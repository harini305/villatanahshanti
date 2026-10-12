import Image from 'next/image';
import Link from 'next/link';
import HeroVideo from '@/components/media/HeroVideo';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import Icon from '@/components/ui/Icon';
import RichText from '@/components/ui/RichText';
import CtaBand from '@/components/sections/CtaBand';
import { LogoMark } from '@/components/brand/Wordmark';
import { home } from '@/data/pages';
import { img } from '@/data/images';
import { rooms } from '@/data/rooms';
import { site } from '@/data/site';
import { galleryCount } from '@/data/gallery';
import { buildMetadata } from '@/lib/metadata';
import styles from './home.module.css';

export const metadata = {
  ...buildMetadata({
    description:
      "A luxurious, architecturally designed villa with a modern Bali feel, a 10 minute walk from Ubud's town centre: fully staffed, with a yoga studio and spa.",
    path: '/',
  }),
  title: { absolute: 'Villa Tanah Shanti · Luxury yoga & retreat villa in Ubud, Bali' },
};

const hero = img('living-infinity-pool');
const poster = img('video-poster');
const aboutImage = img('living-lounge-mural');

// Room cards use photographs without baked-in titles so the portrait crop stays clean.
const roomCards = {
  agung: img('agung-canopy-bed'),
  batukaru: img('batukaru-bedroom-wide'),
  catur: img('catur-bedroom-portrait-art'),
  batur: img('batur-three-beds'),
  abang: img('abang-garden-terrace'),
};

// Excerpts quoted from each page's original copy.
const experiences = [
  {
    href: '/yoga-space',
    eyebrow: 'Yoga Shala',
    title: 'A breath-taking and yet practical, fully equipped space',
    text: "Open to nature's surroundings with an inspiring view of our infinity pool and the jungle ravine.",
    cta: 'Discover the shala',
    image: img('yoga-shala'),
  },
  {
    href: '/exhale-spa',
    eyebrow: 'Exhale Spa',
    title: 'Quiet, private and for the exclusive use of our guests',
    text: 'Our guests can indulge in numerous body treatments for which Bali is famous.',
    cta: 'View the treatments',
    image: img('spa-treatment-room'),
    position: '100% 50%', // keep the baked-in “Exhale Spa” title in frame
  },
  {
    href: '/our-food',
    eyebrow: 'Our Cuisine',
    title: 'Dishes that are beyond guests’ expectations',
    text: 'We run a completely gluten free kitchen at the villa and we even make our own bread, baked on the premises of course.',
    cta: 'Explore our food',
    image: img('mexican-bean-wraps'),
  },
];

const mosaic = [img('snaps-aerial-view'), img('snaps-offerings-on-steps'), img('living-poolside-yoga'), img('abang-garden-staircase'), img('snaps-staff-jumping')];

export default function HomePage() {
  const { about, team } = home;
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className={`${styles.hero} on-dark`} aria-labelledby="home-title">
        <div className={styles.heroMedia} data-hero-bg>
          <Image
            src={hero.src}
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="(orientation: portrait) 175vh, 100vw"
            quality={90}
            placeholder="blur"
            blurDataURL={hero.blurDataURL}
            style={{ objectFit: 'cover', objectPosition: '50% 60%' }}
          />
        </div>
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <div data-hero-intro>
            <LogoMark size={72} className={styles.heroMark} />
          </div>
          <p className={styles.heroPlace} data-hero-intro>
            Ubud · Bali
          </p>
          <h1 id="home-title" className={styles.heroTitle} data-hero-intro>
            Villa Tanah Shanti
          </h1>
          <p className={styles.heroTagline} data-hero-intro>
            {site.tagline}
          </p>
          <div className={styles.heroActions} data-hero-intro>
            <Button href={site.airbnbUrl} external variant="light">
              Check availability
            </Button>
            <Button href="/our-rooms" variant="outlineLight">
              Explore the rooms
            </Button>
          </div>
        </div>
        <a href="#welcome" className={styles.scrollCue}>
          <span aria-hidden="true">Scroll</span>
          <Icon name="arrowDown" size={16} />
          <span className="visually-hidden">Scroll to the introduction</span>
        </a>
      </section>

      {/* ---------- Welcome statement ---------- */}
      <section id="welcome" className={`section ${styles.welcome}`} aria-labelledby="welcome-title">
        <div className="container">
          <div className={styles.centerHead}>
            <Eyebrow center data-reveal>
              Welcome
            </Eyebrow>
            <h2 id="welcome-title" className={styles.statement} data-reveal>
              A luxurious, architecturally designed villa with a <em>modern Bali feel</em>
            </h2>
          </div>
          <dl className={styles.facts}>
            {about.facts.map((f) => (
              <div key={f.label} className={styles.fact} data-reveal>
                <dt className="visually-hidden">{f.label}</dt>
                <dd>
                  <span className={styles.factValue}>{f.value}</span>
                  <span className={styles.factLabel}>{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section id="about" className={`section section--white ${styles.about}`} aria-labelledby="about-title">
        <span id="aboutus" className={styles.anchorAlias} aria-hidden="true" />
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutMedia}>
            <div className={`${styles.aboutImage} hover-zoom`} data-reveal="clip">
              <Image
                src={aboutImage.src}
                alt={aboutImage.alt}
                fill
                sizes="(min-width: 1024px) 75vw, 170vw"
                placeholder="blur"
                blurDataURL={aboutImage.blurDataURL}
                style={{ objectFit: 'cover' }}
                data-parallax
              />
            </div>
          </div>
          <div className={styles.aboutText}>
            <Eyebrow data-reveal>{about.label}</Eyebrow>
            <h2 id="about-title" data-reveal>
              Quietly set amongst nature, with a stunning view onto a <em>deep jungle ravine</em>
            </h2>
            <div data-reveal>
              <RichText paragraphs={about.paragraphs} />
            </div>
            <p className={styles.signOff} data-reveal>
              {about.signOff}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Film ---------- */}
      <section className={`section section--cream ${styles.film}`} aria-labelledby="film-title">
        <div className="container">
          <div className={styles.centerHead}>
            <Eyebrow center data-reveal>
              The villa on film
            </Eyebrow>
            <h2 id="film-title" data-reveal>
              A glimpse of <em>Villa Tanah Shanti</em>
            </h2>
          </div>
          <div className={styles.filmFrame} data-reveal>
            <HeroVideo poster={poster} />
          </div>
        </div>
      </section>

      {/* ---------- Rooms ---------- */}
      <section className={`section ${styles.rooms}`} aria-labelledby="rooms-title">
        <div className="container">
          <div className={styles.splitHead}>
            <div className={styles.splitHeadText}>
              <Eyebrow data-reveal>Accommodation</Eyebrow>
              <h2 id="rooms-title" data-reveal>
                Five stunning bedrooms, <em>all beautifully appointed</em>
              </h2>
            </div>
            <Button href="/our-rooms" variant="link">
              View all rooms <Icon name="arrowRight" size={16} />
            </Button>
          </div>
        </div>
        <ul role="list" className={`container ${styles.roomList}`}>
          {rooms.map((room, i) => {
            const photo = roomCards[room.slug];
            return (
              <li key={room.slug} className={styles.roomItem} data-reveal>
                <Link href={`/our-rooms#${room.slug}`} className={`${styles.roomCard} card-lift`}>
                  <span className={`${styles.roomImage} hover-zoom`}>
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 40vw, (min-width: 768px) 68vw, 156vw"
                      placeholder="blur"
                      blurDataURL={photo.blurDataURL}
                      style={{ objectFit: 'cover' }}
                    />
                  </span>
                  <span className={styles.roomMeta}>
                    <span className={styles.roomNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.roomName}>{room.name}</span>
                    <span className={styles.roomOcc}>{room.occupancy}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Experiences ---------- */}
      <section className={`section section--white ${styles.experiences}`} aria-labelledby="experiences-title">
        <div className="container">
          <div className={styles.centerHead}>
            <Eyebrow center data-reveal>
              Stay, practise, restore
            </Eyebrow>
            <h2 id="experiences-title" data-reveal>
              Yoga, spa and food, <em>all under one roof</em>
            </h2>
          </div>
          <div className={styles.expList}>
            {experiences.map((x, i) => (
              <article key={x.href} className={`${styles.exp} ${i % 2 ? styles.expFlip : ''}`}>
                <div className={`${styles.expImage} hover-zoom`} data-reveal="clip">
                  <Image
                    src={x.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 70vw, 125vw"
                    placeholder="blur"
                    blurDataURL={x.image.blurDataURL}
                    style={{ objectFit: 'cover', objectPosition: x.position || '50% 50%' }}
                    data-parallax
                  />
                </div>
                <div className={styles.expText}>
                  <span className={styles.expNum} aria-hidden="true" data-reveal>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Eyebrow data-reveal>{x.eyebrow}</Eyebrow>
                  <h3 className={styles.expTitle} data-reveal>
                    {x.title}
                  </h3>
                  <p className={styles.expBody} data-reveal>
                    {x.text}
                  </p>
                  <div data-reveal>
                    <Button href={x.href} variant="link">
                      {x.cta} <Icon name="arrowRight" size={16} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Team ---------- */}
      <section id="team" className={`section ${styles.team}`} aria-labelledby="team-title">
        <span id="ourstaff" className={styles.anchorAlias} aria-hidden="true" />
        <div className="container">
          <div className={styles.centerHead}>
            <Eyebrow center data-reveal>
              {team.label}
            </Eyebrow>
            <h2 id="team-title" className={styles.teamTitle} data-reveal>
              {team.intro}
            </h2>
            <p className={styles.teamOrder} data-reveal>
              {team.order}
            </p>
          </div>
          <div className={styles.teamGrid}>
            <ol role="list" className={styles.members}>
              {team.members.map((m) => (
                <li key={m.name} className={styles.member} data-reveal>
                  <h3 className={styles.memberName}>{m.name}</h3>
                  <p>{m.text}</p>
                </li>
              ))}
            </ol>
            <div className={`${styles.teamPhoto} hover-zoom`} data-reveal="clip">
              <Image
                src={team.photo.src}
                alt={team.photo.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 92vw"
                placeholder="blur"
                blurDataURL={team.photo.blurDataURL}
                style={{ objectFit: 'cover', objectPosition: '50% 40%' }}
              />
            </div>
            <div className={styles.teamAside}>
              <div className={`${styles.doorway} card-lift`} data-reveal>
                <Image
                  src={team.secondaryPhoto.src}
                  alt={team.secondaryPhoto.alt}
                  width={team.secondaryPhoto.width}
                  height={team.secondaryPhoto.height}
                  sizes="(min-width: 1024px) 18vw, 50vw"
                />
              </div>
              <p className={styles.dadong} data-reveal>
                {team.closing}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Gallery preview ---------- */}
      <section className={`section section--cream ${styles.gallery}`} aria-labelledby="gallery-title">
        <div className="container">
          <div className={styles.splitHead}>
            <div className={styles.splitHeadText}>
              <Eyebrow data-reveal>Gallery</Eyebrow>
              <h2 id="gallery-title" data-reveal>
                Moments at <em>the villa</em>
              </h2>
            </div>
            <Button href="/photos" variant="link">
              See all {galleryCount} photos <Icon name="arrowRight" size={16} />
            </Button>
          </div>
          <ul role="list" className={styles.mosaic}>
            {mosaic.map((m, i) => (
              <li key={m.src} className={`${styles.mosaicItem} hover-zoom`} data-reveal>
                <Image src={m.src} alt={m.alt} fill sizes={i === 0 ? '(min-width: 1024px) 80vw, 160vw' : '(min-width: 1024px) 40vw, 80vw'} placeholder="blur" blurDataURL={m.blurDataURL} style={{ objectFit: 'cover' }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand image={img('agung-veranda')} />
    </>
  );
}
