'use client';
// Click-to-play hero video (the original is not autoplayed). Until the visitor presses play,
// only the poster image loads: the <video> element isn't mounted, so no video bytes are fetched.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import styles from './HeroVideo.module.css';

const MP4 = '/video/villa-tanah-shanti-720.mp4';
const WEBM = '/video/villa-tanah-shanti-720.webm';

export default function HeroVideo({ poster }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef(null);
  const wrapRef = useRef(null);

  // focus the player once mounted, and pause when scrolled out of view
  useEffect(() => {
    if (!playing) return;
    const video = videoRef.current;
    video?.focus({ preventScroll: true });
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && video && !video.paused) video.pause();
    }, { threshold: 0.15 });
    if (wrapRef.current) io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [playing]);

  return (
    <figure className={styles.figure}>
      <div ref={wrapRef} className={styles.frame}>
        {playing ? (
          <video
            ref={videoRef}
            className={styles.video}
            controls
            autoPlay
            playsInline
            preload="auto"
            poster={poster.src}
            aria-label="Villa Tanah Shanti video"
            onError={() => setFailed(true)}
          >
            <source src={WEBM} type="video/webm" />
            <source src={MP4} type="video/mp4" onError={() => setFailed(true)} />
            <a href={MP4}>Download the villa video (MP4)</a>
          </video>
        ) : (
          <button type="button" className={styles.poster} onClick={() => setPlaying(true)}>
            <Image
              src={poster.src}
              alt=""
              fill
              sizes="(min-width: 1280px) 1160px, 92vw"
              quality={90}
              placeholder="blur"
              blurDataURL={poster.blurDataURL}
              style={{ objectFit: 'cover' }}
            />
            <span className={styles.play} aria-hidden="true">
              <Icon name="play" size={30} />
            </span>
            <span className="visually-hidden">Play the villa video (1 minute 50 seconds, with sound)</span>
            <span className={styles.label} aria-hidden="true">
              Play the villa video <span className={styles.duration}>1:50, with sound</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className={styles.caption}>
        {poster.alt}
        {failed && (
          <>
            {' '}
            The video could not be played here. <a href={MP4}>Open the video file</a>.
          </>
        )}
      </figcaption>
    </figure>
  );
}
