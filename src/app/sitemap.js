import { SITE_URL, routes } from '@/data/site';

export default function sitemap() {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : path === '/our-rooms' ? 0.9 : 0.7,
  }));
}
