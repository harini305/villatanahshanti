// Single source of truth for site-wide facts and external URLs.
// Every external URL here was taken from the live villatanahshanti.com HTML (SITE_MAP.md §5).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.villatanahshanti.com').replace(/\/$/, '');

export const site = {
  name: 'Villa Tanah Shanti',
  location: 'Ubud, Bali',
  tagline: 'nurtured amidst nature',
  owners: 'Jade & Andy',
  description:
    'A luxurious, architecturally designed villa in Ubud, Bali: five bedrooms, a yoga shala, an in-house spa and a gluten free kitchen, overlooking a jungle ravine.',
  airbnbUrl: 'https://www.airbnb.com/users/147140693/listings?user_id=147140693&s=3',
  facebookUrl: 'https://www.facebook.com/Villa-Tanah-Shanti-322122621470020/?ref=br_rs',
  geo: { lat: -8.5016654, lng: 115.2693959 },
  mapNote: 'PLEASE NOTE - the pin is at our road entry. The villa is 150m east towards the river.',
};

export const mapEmbedUrl = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&output=embed`;
export const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;

export const navItems = [
  { href: '/#about', label: 'About', match: '/' },
  { href: '/our-rooms', label: 'Rooms' },
  { href: '/yoga-space', label: 'Yoga' },
  { href: '/exhale-spa', label: 'Spa' },
  { href: '/our-food', label: 'Food' },
  { href: '/photos', label: 'Photos' },
  { href: '/contact-us', label: 'Contact us' },
];

export const routes = ['/', '/our-rooms', '/yoga-space', '/exhale-spa', '/our-food', '/photos', '/contact-us'];
