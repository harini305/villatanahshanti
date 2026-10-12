// Text-only page heading for inner pages: eyebrow, serif H1, gold rule and an optional lead.
// (Photographs are reserved for the content below; only the homepage has an image hero.)
import Eyebrow from '@/components/ui/Eyebrow';
import styles from './PageHeader.module.css';

export default function PageHeader({ eyebrow, title, accent, children, meta, align = 'center' }) {
  return (
    <section className={`${styles.header} ${styles[align]}`} aria-labelledby="page-title">
      <div className={`container ${styles.inner}`}>
        {eyebrow && (
          <Eyebrow center={align === 'center'} data-hero-intro>
            {eyebrow}
          </Eyebrow>
        )}
        <h1 id="page-title" className={styles.title} data-hero-intro>
          {title}
          {accent && (
            <>
              {' '}
              <em className={styles.accent}>{accent}</em>
            </>
          )}
        </h1>
        <span className={`rule ${styles.rule}`} aria-hidden="true" data-hero-intro />
        {children && (
          <div className={styles.lead} data-hero-intro>
            {children}
          </div>
        )}
        {meta && (
          <ul role="list" className={styles.meta} data-hero-intro>
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
