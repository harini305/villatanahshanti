/** @type {import('next').NextConfig} */

// Legacy Wix routes (SITE_MAP.md §2). Their unique content has been folded into the current pages.
const legacyRedirects = [
  ['/welcome', '/'],
  ['/rooms', '/our-rooms'],
  ['/yoga-space-and-facilities', '/yoga-space'],
  ['/inhouse-spa', '/exhale-spa'],
  ['/delicious-and-nutricious-meals', '/our-food'],
  ['/room-photos-1', '/photos'],
  ['/room-photos-2', '/photos'],
];

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

const nextConfig = {
  // A separate output folder lets the test suite build a variant with a mock form endpoint.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // WebP only: AVIF encoding is several times slower on first request (re-enable for Vercel if wanted).
    formats: ['image/webp'],
    // Every image is delivered at q85+ (q90 for heroes and the lightbox); 75 isn't allowed, so the default maps to 85.
    qualities: [85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/video/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
};

export default nextConfig;
