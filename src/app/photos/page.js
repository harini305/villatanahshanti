import PageHeader from '@/components/sections/PageHeader';
import SectionNav from '@/components/sections/SectionNav';
import PhotoGrid from '@/components/media/PhotoGrid';
import Button from '@/components/ui/Button';
import { galleryCategories, galleryCount } from '@/data/gallery';
import { site } from '@/data/site';
import { buildMetadata } from '@/lib/metadata';
import styles from './photos.module.css';

export const metadata = buildMetadata({
  title: 'Photos',
  description: `A gallery of ${galleryCount} photos of Villa Tanah Shanti, Ubud: the Agung, Batukaru, Catur, Batur and Abang bedrooms, the living area, infinity pool and happy snaps.`,
  path: '/photos',
  og: 'photos',
});

export default function PhotosPage() {
  const nav = galleryCategories.map((c) => ({ id: c.id, label: c.label, count: c.images.length }));
  return (
    <>
      <PageHeader eyebrow="Photos of the villa" title="Gallery" meta={[`${galleryCount} photographs`, `${galleryCategories.length} collections`]}>
        <p>For easier viewing please click on each photo.</p>
      </PageHeader>

      <SectionNav items={nav} label="Photo collections" />

      {galleryCategories.map((cat, i) => (
        <section key={cat.id} id={cat.id} className={styles.collection} aria-labelledby={`${cat.id}-title`}>
          <div className="container">
            <header className={styles.head}>
              <p className={styles.num} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 id={`${cat.id}-title`} className={styles.title} data-reveal>
                {cat.label}
              </h2>
              <p className={styles.count}>{cat.images.length} photos</p>
            </header>
            <PhotoGrid images={cat.images} title={cat.label} />
          </div>
        </section>
      ))}

      <section className={styles.end} aria-labelledby="end-title">
        <div className="container-text">
          <h2 id="end-title" className={styles.endTitle}>
            Like what <em>you see?</em>
          </h2>
          <div className={styles.endActions}>
            <Button href={site.airbnbUrl} external>
              Check availability
            </Button>
            <Button href="/contact-us" variant="ghost">
              Send an enquiry
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
