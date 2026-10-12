import Link from 'next/link';
import { navItems, site, mapLinkUrl } from '@/data/site';
import { LogoMark } from '@/components/brand/Wordmark';
import ExternalLink from '@/components/ui/ExternalLink';
import Icon from '@/components/ui/Icon';
import Year from './Year';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <Link href="/" className={styles.brand} aria-label="Villa Tanah Shanti, home">
          <LogoMark size={64} />
          <span className={styles.name} aria-hidden="true">
            Villa Tanah Shanti
          </span>
        </Link>
        <p className={styles.tagline}>{site.tagline}</p>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <h2 className={styles.heading}>The villa</h2>
          <p className={styles.text}>A luxurious, architecturally designed villa with a modern Bali feel.</p>
        </div>

        <nav aria-label="Footer" className={styles.col}>
          <h2 className={styles.heading}>Explore</h2>
          <ul role="list" className={styles.links}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Stay with us</h2>
          <ul role="list" className={styles.links}>
            <li>
              <ExternalLink href={site.airbnbUrl}>Check availability on Airbnb</ExternalLink>
            </li>
            <li>
              <Link href="/contact-us">Send an enquiry</Link>
            </li>
            <li>
              <ExternalLink href={site.facebookUrl} icon={false}>
                <Icon name="facebook" size={16} />
                Facebook
              </ExternalLink>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Find us</h2>
          <p className={styles.text}>{site.location}</p>
          <p className={styles.note}>{site.mapNote}</p>
          <ExternalLink href={mapLinkUrl} className={styles.mapLink}>
            Open in Google Maps
          </ExternalLink>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © <Year /> Jade &amp; Andy
        </p>
        <p className={styles.om}>Om shanti, shanti shanti</p>
      </div>
    </footer>
  );
}
