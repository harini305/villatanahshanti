'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './status.module.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={styles.wrap} aria-labelledby="err-title">
      <div className={styles.inner}>
        <p className={styles.code}>Sorry</p>
        <h1 id="err-title" className={styles.title}>
          Something went wrong while loading this page.
        </h1>
        <p className={styles.text}>Please try again. If the problem continues, the home page is always a safe place to start.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className={`${styles.btn} ${styles.ghost}`}>
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
