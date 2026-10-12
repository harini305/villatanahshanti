import Button from '@/components/ui/Button';
import { LogoMark } from '@/components/brand/Wordmark';
import styles from './status.module.css';

export const metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className={styles.wrap} aria-labelledby="nf-title">
      <div className={styles.inner}>
        <LogoMark size={84} className={styles.mark} />
        <p className={styles.code}>Error 404</p>
        <h1 id="nf-title" className={styles.title}>
          This path seems to have wandered into <em>the rice fields.</em>
        </h1>
        <p className={styles.text}>The page you were looking for isn&rsquo;t here. These will lead you back to the villa:</p>
        <div className={styles.actions}>
          <Button href="/">Back to the home page</Button>
          <Button href="/our-rooms" variant="ghost">
            Our rooms
          </Button>
          <Button href="/contact-us" variant="ghost">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
