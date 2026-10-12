import Image from 'next/image';
import PageHeader from '@/components/sections/PageHeader';
import SectionNav from '@/components/sections/SectionNav';
import CtaBand from '@/components/sections/CtaBand';
import RoomPhotos from '@/components/media/RoomPhotos';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import RichText from '@/components/ui/RichText';
import { rooms, kitchenDining, roomPhotos } from '@/data/rooms';
import { galleryById } from '@/data/gallery';
import { img } from '@/data/images';
import { site } from '@/data/site';
import { buildMetadata } from '@/lib/metadata';
import styles from './rooms.module.css';

export const metadata = buildMetadata({
  title: 'Our Rooms',
  description:
    'Five beautifully appointed bedrooms at Villa Tanah Shanti, Ubud: Agung, Batukaru, Catur, Batur and Abang, plus a huge open kitchen, dining and living area.',
  path: '/our-rooms',
  og: 'rooms',
});

const navItems = [...rooms.map((r) => ({ id: r.slug, label: r.name })), { id: kitchenDining.slug, label: kitchenDining.name }];

// Shared by every room, as stated in the room descriptions.
const everyRoom = ['Luxurious pillow-top bedding', 'Ensuite bathroom', 'Bar fridge', 'Safe box', 'Walk-in wardrobe'];

export default function RoomsPage() {
  const living = galleryById[kitchenDining.galleryId].images;
  return (
    <>
      <PageHeader eyebrow="Accommodation" title="Our" accent="Rooms" meta={rooms.map((r) => r.name)}>
        <p>
          Our guests have the choice of 5 stunning bedrooms, all beautifully appointed and decorated, 2 of which can be configured for double, twin
          or triple occupancy, 2 for double or twin occupancy and 1 single occupant room.
        </p>
      </PageHeader>

      <SectionNav items={navItems} label="Rooms" />

      <section className={styles.shared} aria-labelledby="every-room-title">
        <div className={`container ${styles.sharedInner}`}>
          <h2 id="every-room-title" className={styles.sharedLabel}>
            In every room
          </h2>
          <ul role="list" className={styles.sharedList}>
            {everyRoom.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {rooms.map((room, i) => {
        const photos = roomPhotos(room);
        return (
          <section key={room.slug} id={room.slug} className={styles.room} aria-labelledby={`${room.slug}-title`}>
            <div className="container">
              <header className={styles.roomHead}>
                <p className={styles.index} aria-hidden="true" data-reveal>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className={styles.titleBlock}>
                  <Eyebrow data-reveal>Bedroom {i + 1} of 5</Eyebrow>
                  <h2 id={`${room.slug}-title`} className={styles.name} data-reveal>
                    {room.name}
                  </h2>
                </div>
                <dl className={styles.facts} data-reveal>
                  <div>
                    <dt>Beds</dt>
                    <dd>{room.occupancy}</dd>
                  </div>
                  <div>
                    <dt>Setting</dt>
                    <dd>{room.view}</dd>
                  </div>
                </dl>
              </header>

              <RoomPhotos name={room.name} hero={room.hero} photos={photos} priority={i === 0} />

              <div className={styles.body}>
                <div className={styles.copy} data-reveal>
                  <RichText paragraphs={room.paragraphs} />
                </div>
                <div className={styles.actions} data-reveal>
                  <Button href={site.airbnbUrl} external>
                    Check availability
                  </Button>
                  <Button href="/contact-us" variant="ghost">
                    Enquire about {room.name}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Kitchen & dining */}
      <section id={kitchenDining.slug} className={styles.living} aria-labelledby="living-title">
        <div className={`${styles.livingBanner} hover-zoom`}>
          <Image
            src={kitchenDining.hero.src}
            alt={kitchenDining.hero.alt}
            fill
            sizes="(max-width: 767px) 130vw, 100vw"
            placeholder="blur"
            blurDataURL={kitchenDining.hero.blurDataURL}
            style={{ objectFit: 'cover' }}
            data-parallax
          />
        </div>
        <div className={`container ${styles.livingGrid}`}>
          <div className={styles.livingHead}>
            <Eyebrow data-reveal>Living area</Eyebrow>
            <h2 id="living-title" data-reveal>
              Kitchen <em>&amp;</em> dining
            </h2>
          </div>
          <div className={styles.livingCols} data-reveal>
            <RichText paragraphs={kitchenDining.paragraphs} />
          </div>
        </div>
        <div className={`container ${styles.livingPhotos}`}>
          <RoomPhotos name="Living area" hero={living[4]} photos={living} />
        </div>
      </section>

      <CtaBand eyebrow="Book a room or the whole villa" title="Have the whole villa for just you and whoever you wish" image={img('living-pool-pavilion')} reverse />
    </>
  );
}
