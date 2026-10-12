import { SITE_URL } from '@/data/site';

// Production is fully indexable. Vercel preview deployments are kept out of search results.
export default function robots() {
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  if (isPreview) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
