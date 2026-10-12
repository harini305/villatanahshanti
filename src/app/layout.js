import localFont from 'next/font/local';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import MotionController from '@/components/motion/MotionController';
import { SITE_URL, site } from '@/data/site';
import { buildMetadata, lodgingJsonLd } from '@/lib/metadata';
import '@/styles/globals.css';

// Cormorant Garamond (display serif) and Manrope (body sans), OFL-licensed, self-hosted through
// next/font so builds never depend on reaching Google Fonts (see src/fonts/OFL-*.txt).
const cormorant = localFont({
  src: [
    { path: '../fonts/cormorant-garamond-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/cormorant-garamond-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/cormorant-garamond-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
  fallback: ['Garamond', 'Times New Roman', 'serif'],
});
const manrope = localFont({
  src: [{ path: '../fonts/manrope-latin-wght-normal.woff2', weight: '300 700', style: 'normal' }],
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['Segoe UI', 'system-ui', 'sans-serif'],
});

const base = buildMetadata({
  description:
    "A luxurious, architecturally designed villa a 10 minute walk from Ubud's town centre, Bali: five bedrooms, a yoga shala, an in-house spa and a gluten free kitchen.",
});

export const metadata = {
  ...base,
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} · Ubud, Bali`, template: `%s · ${site.name}, Ubud Bali` },
  applicationName: site.name,
  authors: [{ name: site.owners }],
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport = {
  themeColor: '#faf7f2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so the hero intro can animate without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd()) }} />
      </head>
      <body>
        <div id="top" tabIndex={-1} />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <BackToTop />
        <MotionController />
      </body>
    </html>
  );
}
