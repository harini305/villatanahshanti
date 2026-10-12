import Image from 'next/image';
import PageHeader from '@/components/sections/PageHeader';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import Icon from '@/components/ui/Icon';
import ExternalLink from '@/components/ui/ExternalLink';
import { img } from '@/data/images';
import { site, mapEmbedUrl, mapLinkUrl } from '@/data/site';
import { buildMetadata } from '@/lib/metadata';
import styles from './contact.module.css';

export const metadata = buildMetadata({
  title: 'Contact us',
  description:
    'Get in touch with Villa Tanah Shanti in Ubud, Bali: send an enquiry, message us on Facebook, check room availability on Airbnb or find us on the map.',
  path: '/contact-us',
  og: 'contact',
});

const entrance = img('snaps-entrance-courtyard');

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow={site.tagline} title="Contact" accent="us">
        <p>Send us an enquiry, message us on Facebook or check room availability on Airbnb.</p>
      </PageHeader>

      <section className={`section ${styles.main}`} aria-label="Enquiries">
        <div className={`container ${styles.grid}`}>
          <aside className={styles.aside} aria-labelledby="other-ways-title">
            <Eyebrow data-reveal>Other ways to reach us</Eyebrow>
            <h2 id="other-ways-title" className={styles.asideTitle} data-reveal>
              Prefer to message us <em>directly?</em>
            </h2>
            <ul role="list" className={styles.channels} data-reveal>
              <li>
                <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.channel}>
                  <span className={styles.channelName}>Facebook</span>
                  <span className={styles.channelText}>Villa Tanah Shanti on Facebook</span>
                  <Icon name="external" size={16} className={styles.channelArrow} />
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a href={site.airbnbUrl} target="_blank" rel="noopener noreferrer" className={styles.channel}>
                  <span className={styles.channelName}>Airbnb</span>
                  <span className={styles.channelText}>Check availability for individual rooms</span>
                  <Icon name="external" size={16} className={styles.channelArrow} />
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
            <p className={styles.small} data-reveal>
              We do take bookings for individual rooms when we are not hosting a retreat.
            </p>
            <figure className={styles.entrance} data-reveal="clip">
              <div className={`${styles.entranceImg} hover-zoom`}>
                <Image
                  src={entrance.src}
                  alt={entrance.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  placeholder="blur"
                  blurDataURL={entrance.blurDataURL}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <figcaption>Our entrance courtyard</figcaption>
            </figure>
          </aside>

          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className={`section section--cream ${styles.mapSection}`} aria-labelledby="map-title">
        <div className="container">
          <div className={styles.mapHead}>
            <div className={styles.mapHeadText}>
              <Eyebrow data-reveal>Find us</Eyebrow>
              <h2 id="map-title" data-reveal>
                Villa Tanah Shanti, <em>{site.location}</em>
              </h2>
            </div>
            <Button href={mapLinkUrl} external variant="ghost">
              Open in Google Maps
            </Button>
          </div>
          <div className={styles.mapFrame} data-reveal>
            <iframe
              src={mapEmbedUrl}
              title="Google Map showing the road entry to Villa Tanah Shanti, Ubud, Bali"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className={styles.mapNote} data-reveal>
            <Icon name="pin" size={18} />
            <span>{site.mapNote}</span>
          </p>
          <noscript>
            <p>
              <ExternalLink href={mapLinkUrl}>Open the location in Google Maps</ExternalLink>
            </p>
          </noscript>
        </div>
      </section>
    </>
  );
}
