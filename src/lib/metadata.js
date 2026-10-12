import { SITE_URL, site } from '@/data/site';

// Per-page metadata: canonical URL, Open Graph and Twitter cards with an original-photo preview.
export function buildMetadata({ title, description, path = '/', og = 'home' }) {
  const image = { url: `/images/og/og-${og}.jpg`, width: 1200, height: 630, alt: `${site.name}, ${site.location}` };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: site.name,
      url: path,
      title: title ? `${title} · ${site.name}` : `${site.name} · ${site.location}`,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} · ${site.name}` : `${site.name} · ${site.location}`,
      description,
      images: [image.url],
    },
  };
}

// Structured data limited to facts stated on the original site (no prices, ratings, phone or street address).
export function lodgingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: site.name,
    url: SITE_URL,
    image: `${SITE_URL}/images/og/og-home.jpg`,
    logo: `${SITE_URL}/icon.png`,
    description:
      "Villa Tanah Shanti is a luxurious, architecturally designed villa with a modern Bali feel. Situated only a 10 minute walk from Ubud's town centre, it is quietly set amongst nature with a stunning view onto a deep jungle ravine.",
    address: { '@type': 'PostalAddress', addressLocality: 'Ubud', addressRegion: 'Bali', addressCountry: 'ID' },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    numberOfRooms: 5,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Yoga studio', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'In-house spa', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Infinity pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Gluten free kitchen', value: true },
    ],
    sameAs: [site.facebookUrl],
  };
}
