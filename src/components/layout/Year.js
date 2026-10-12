'use client';
// The current year. Pages are statically generated, so the client re-reads the clock
// to keep the copyright current between builds.
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();

export default function Year() {
  const year = useSyncExternalStore(subscribe, getYear, getYear);
  return <span suppressHydrationWarning>{year}</span>;
}
