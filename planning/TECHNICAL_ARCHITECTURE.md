# Technical Architecture — Villa Tanah Shanti

## 1. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js, current stable** (App Router, JavaScript, no `src/` TypeScript) | Scaffold with `create-next-app@latest --js --app --eslint --src-dir --no-tailwind --import-alias "@/*"`; record the exact version in the README |
| UI | React (version bundled with Next) | Server Components by default; `'use client'` only where interaction or animation is needed |
| Animation | `gsap` + `ScrollTrigger` (in the gsap package) + `@gsap/react` (`useGSAP`) | The only runtime dependencies beyond Next/React |
| Styling | CSS Modules per component + `src/styles/` globals (tokens, reset, typography, utilities) | No Tailwind, no UI kits |
| Fonts | `next/font/google`: **Jost** (300/400/500 + 300 italic), **Barlow** (400/500/600) | Self-hosted at build; CSS variables `--font-display`, `--font-body` |
| Images | `next/image` with local static files in `/public/images` | AVIF/WebP via the Next image optimiser; `sizes` per usage |
| Linting | ESLint (`next/core-web-vitals`) | From create-next-app |
| Dev-only (pending D7) | `@playwright/test`, `@axe-core/playwright` | Not shipped to users |
| Asset tooling | `sharp` (comes with Next) via a Node script; `ffmpeg` (system binary) for video | Scripts in `/scripts`, run once |
| Hosting (later gate) | Vercel | Static output for all pages; no server functions required |

**Deliberately not used:** TypeScript, Tailwind, component libraries, Framer Motion, Lenis/smooth scroll, lightbox/carousel libraries, CMS, backend.

## 2. Rendering strategy
- Every page is **statically generated** (SSG) from local data modules. No runtime data fetching.
- Client components are limited to: `Header` (menu state), `MobileMenu`, `BackToTop`, `Reveal`/animation wrappers, `HeroVideo`, `Gallery` + `Lightbox`, `RoomPhotosButton`, `ContactForm`, `ActiveSectionNav`.
- Text content renders on the server inside server components. Client wrappers receive it as `children`, which keeps the JS bundle small and content crawlable.

## 3. Folder structure

```
D:\clone3\
├─ planning/                         # Phase 1 documents (this folder)
├─ scripts/
│  ├─ fetch-assets.mjs               # downloads Wix originals → assets-src/ (gitignored)
│  ├─ optimize-images.mjs            # sharp: resize/compress → public/images/
│  └─ transcode-video.sh             # ffmpeg: 720p mp4 + webm + poster
├─ assets-src/                       # gitignored raw downloads
├─ public/
│  ├─ images/
│  │  ├─ brand/        logo-plant.png, wheat-field.jpg, palm-leaf.jpg, coconuts.jpg
│  │  ├─ home/         team-stairs.jpg, team-doorway.png, video-poster.jpg
│  │  ├─ rooms/        agung-hero.jpg, batukaru-hero.jpg, … kitchen-dining.jpg
│  │  ├─ gallery/      agung-01.jpg … happy-snaps-11.jpg
│  │  ├─ yoga/  spa/  food/
│  │  └─ og/           og-home.jpg, og-rooms.jpg … (1200×630)
│  └─ video/           villa-tanah-shanti-720.mp4, villa-tanah-shanti-720.webm
├─ src/
│  ├─ app/
│  │  ├─ layout.js                   # <html lang="en">, fonts, Header, Footer, skip link, BackToTop, JSON-LD
│  │  ├─ page.js                     # Home
│  │  ├─ our-rooms/page.js
│  │  ├─ yoga-space/page.js
│  │  ├─ exhale-spa/page.js
│  │  ├─ our-food/page.js
│  │  ├─ photos/page.js
│  │  ├─ contact-us/page.js
│  │  ├─ not-found.js                # custom 404
│  │  ├─ error.js                    # 'use client' error boundary (friendly message + retry + home link)
│  │  ├─ global-error.js             # minimal fallback for root errors
│  │  ├─ sitemap.js                  # 7 routes, lastModified = build date
│  │  ├─ robots.js                   # allow all; sitemap URL; disallow nothing on prod
│  │  ├─ manifest.js                 # name, theme colour #D4CAC5, icons
│  │  ├─ icon.png, apple-icon.png    # generated from the favicon/logo
│  │  └─ opengraph-image.jpg         # default OG (home)
│  ├─ components/
│  │  ├─ layout/    Header, MobileMenu, NavLinks, Footer, SkipLink, BackToTop
│  │  ├─ ui/        Button (link|button variants), ExternalLink, Eyebrow (pill), SectionHeading,
│  │  │             Card, FramedImage, VisuallyHidden, Icon (inline SVG set)
│  │  ├─ brand/     Wordmark (plant "V" + text, accessible), LogoMark
│  │  ├─ media/     HeroVideo, Gallery, GalleryTile, Lightbox, MapEmbed
│  │  ├─ sections/  PageIntro, HomeHero, AboutSection, TeamSection, CtaBand,
│  │  │             RoomSection, RoomQuickNav, TreatmentList, CategoryNav
│  │  ├─ forms/     ContactForm, Field
│  │  └─ motion/    Reveal (wrapper applying useReveal), Parallax
│  ├─ data/
│  │  ├─ site.js                     # name, URLs, Airbnb, Facebook, geo, nav items, metadata defaults
│  │  ├─ rooms.js                    # 5 rooms + kitchen/dining: slug, name, occupancy, paragraphs, heroImage, galleryKey
│  │  ├─ gallery.js                  # categories → images (src, width, height, alt, wixId, bakedFrame)
│  │  ├─ pages.js                    # copy for home/yoga/spa/food/contact (verbatim)
│  │  └─ staff.js                    # Wayan, Putri, Arik, Dewa, Dadong
│  ├─ lib/
│  │  ├─ gsap/   register.js, motion.js, useReveal.js, useParallax.js
│  │  ├─ metadata.js                 # buildMetadata({ title, description, path, image })
│  │  └─ validation.js               # contact form validators (shared client logic)
│  └─ styles/
│     ├─ tokens.css                  # colours, spacing, radii, shadows, z-index, motion
│     ├─ reset.css
│     ├─ typography.css
│     └─ globals.css                 # imports the above + utilities (.container, .visually-hidden, focus ring)
├─ next.config.mjs                   # redirects (legacy routes), images config, headers
├─ jsconfig.json                     # "@/*" alias
├─ .env.example                      # NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_FORM_ENDPOINT (no secrets)
├─ .gitignore                        # node_modules, .next, assets-src, .env*.local
└─ README.md                         # commands, decisions, asset provenance
```

This is the simplest structure that covers 7 pages with shared patterns. No generic page builder, no CMS abstraction.

## 4. Key components

| Component | Type | Responsibility |
|---|---|---|
| `Header` | client | Sticky; logo mark + wordmark link to `/`; `NavLinks` (desktop ≥ 1024); hamburger toggle (< 1024); "Check availability" `ExternalLink`; solid-on-scroll class |
| `MobileMenu` | client | `<dialog>`-style off-canvas panel: `aria-modal`, focus trap, Esc closes, closes on route change, body scroll lock (`overflow: hidden` on `<html>`), returns focus to the toggle; toggle has `aria-expanded`/`aria-controls` |
| `NavLinks` | server-safe | Renders the nav from `site.js`; active via `usePathname` in a small client child for `aria-current="page"` |
| `Footer` | server | Logo, short blurb, nav, Facebook + Airbnb external links, map note, © line |
| `Wordmark` | server | `<span class="visually-hidden">Villa Tanah Shanti</span>` + `aria-hidden` composition (plant PNG as "V" + "illa Tanah Shanti") |
| `PageIntro` | server + Reveal | Background image (`next/image fill priority`), overlay, H1, underline bar, optional eyebrow |
| `HomeHero` | server + client motion | Full-viewport hero: wheat bg, logo oval, H1 wordmark, "Ubud, Bali", tagline pill, `HeroVideo` card, scroll cue |
| `HeroVideo` | client | Poster `next/image`; custom play button; on click mounts `<video controls autoPlay playsInline>` with mp4/webm sources (`preload="none"` until then); pause when scrolled out of view |
| `RoomSection` | server | Alternating layout; `FramedImage`; Eyebrow; H2; occupancy line; paragraphs; `RoomPhotosButton` |
| `RoomPhotosButton` | client | Opens `Lightbox` with that room's category from `gallery.js` |
| `Gallery` | client | Renders categories (H2 + grid of `GalleryTile` buttons); manages the lightbox index |
| `Lightbox` | client | Native `<dialog>` (`showModal()`): image (`next/image`, `sizes="100vw"`), caption (alt), counter, prev/next/close buttons (44 px), ←/→/Esc/Home/End keys, swipe (pointer events, 50 px threshold), preloads neighbours, restores focus |
| `ContactForm` | client | See §8 |
| `MapEmbed` | client (lazy) | `<iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=-8.5016654,115.2693959&z=16&output=embed" title=…>` inside an aspect-ratio box; "Open in Google Maps" link `https://www.google.com/maps/search/?api=1&query=-8.5016654,115.2693959` |
| `BackToTop` | client | Appears after 1 viewport; `window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'})`; moves focus to `#top` (skip-link target) |
| `Reveal` | client | Wraps server children, applies `useReveal` within its scope |

## 5. Data modules (single source of truth)
- **Copy is verbatim** from CONTENT_ASSET_INVENTORY and stored as arrays of paragraphs. Inline links (the Airbnb "here") are represented as structured segments, not raw HTML (no `dangerouslySetInnerHTML`).
- `gallery.js` keeps `wixId` per image for provenance, plus `bakedFrame: true|false` and `bakedText: 'Agung'|null` (used in alt text and frame styling).
- `site.js` holds every external URL in one place.

## 6. Design tokens
Defined in `src/styles/tokens.css` (values in UI_UX_AUDIT §3.3, §2.4, §4.2): colours, font families (via next/font variables), fluid type scale, spacing scale, container widths, radii (`--radius-sm: 4px; --radius-md: 6px; --radius-pill: 999px`), shadows (`--shadow-frame`, `--shadow-pill`, `--shadow-header`), z-index scale (header 100, menu 200, lightbox 300, back-to-top 90), motion durations (mirrors `motion.js`).

## 7. SEO & metadata
- `src/lib/metadata.js` → per-page `export const metadata` with `title` (template `%s · Villa Tanah Shanti, Ubud Bali`), `description`, `alternates.canonical`, `openGraph` (type website, locale en, siteName, image 1200×630), `twitter: summary_large_image`.
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`, defaulting to `https://www.villatanahshanti.com` **[confirm the final production domain at Gate 5. If deployed to a vercel.app URL first, the canonical must still point to the intended domain or be switched deliberately]**.
- Titles and descriptions start from the originals (SITE_MAP §1), lightly cleaned of typos ("Tannah", "VIlla") and length-tuned (title ≤ 60, description 140–160 chars). Proposed copy goes in the Phase 2 README for your approval.
- **JSON-LD** in `layout.js`: `LodgingBusiness` with `name`, `url`, `image`, `description` (from About), `geo` (lat/lng), `address` limited to `addressLocality: "Ubud"`, `addressRegion: "Bali"`, `addressCountry: "ID"` (no invented street), `sameAs` (Facebook), `amenityFeature` limited to stated facts (yoga studio, spa, infinity pool, gluten-free kitchen), `numberOfRooms: 5`. **No** `priceRange`, `telephone`, `aggregateRating`.
- `sitemap.js` lists the 7 canonical routes; `robots.js` allows all and points to the sitemap. A Vercel preview guard: if `VERCEL_ENV !== 'production'`, `robots` returns `disallow: /` so preview URLs aren't indexed. The production build stays indexable (no accidental `noindex`).
- Headings: exactly one `<h1>` per page. Landmarks: `header`, `nav[aria-label="Main"]`, `main#main`, `footer`.

## 8. Contact form (frontend-only, honest)

**Fields:** Name (required, 2–100 chars), Email (required, RFC-lite pattern + `type="email"`), Message (optional, max 2000 chars, matching the original), hidden honeypot field `company` (spam trap), submit "Send enquiry".

**Validation:** native constraint validation as the baseline (works without JS) plus custom inline messages on blur and submit. Errors are linked with `aria-describedby`, `aria-invalid`, and an error summary focused on submit failure.

**Submission (decision D3):**
```
if NEXT_PUBLIC_FORM_ENDPOINT is set:
    POST JSON/FormData via fetch → endpoint (e.g. Formspree/Web3Forms account owned by the villa)
    loading: button disabled + "Sending…"
    2xx → success panel: "Thank you for your enquiry. We will get back to you as soon as we can." (original copy)
    error/network → error panel: "Sorry, your message couldn't be sent. Please try again, or reach us on Facebook." (+ link)
else (not configured):
    form renders normally but submit shows an honest notice:
    "Online enquiries are being set up. In the meantime, please message us on Facebook or check room availability on Airbnb." (+ both links)
    — never a fake success.
```
- The endpoint URL is public by nature (form services are designed for client-side posting). **No secrets** in the client or repo; `.env.example` documents the variable.
- No backend or API route is created (frontend-only constraint).

## 9. Media pipeline
- **Images:** 64 originals (≈ 260 MB total, max 18 MB) → `sharp` resize to a 2560 px long edge (gallery/hero) or 1600 px (inline), mozjpeg q≈80, progressive, metadata stripped. Expected output ≈ 25–35 MB in `public/images` [E]. `next/image` generates responsive AVIF/WebP at request/build time on Vercel.
- **Priority/LCP:** the home hero background and each page-intro image use `priority` + `fetchPriority="high"`. Everything else is lazy by default.
- **`sizes`:** gallery tiles `(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw`; room images `(min-width:1024px) 58vw, 100vw`; lightbox `100vw`.
- **Placeholders:** `placeholder="blur"` using static imports (auto blurDataURL) for hero/room images.
- **Video:** ffmpeg → H.264 720p CRF ~26, `-movflags +faststart`, AAC 96k (or audio stripped if silent — check), plus VP9 WebM and a poster JPG. Target < 12 MB mp4. `preload="none"`.

## 10. Accessibility architecture
- Skip link "Skip to main content" → `#main`.
- Focus ring token: `outline: 2px solid var(--c-ink); outline-offset: 2px; box-shadow: 0 0 0 4px #fff` on `:focus-visible` (works on light and dark backgrounds).
- Menu, lightbox: focus trap, Esc, `inert` on background (native `<dialog>` provides it).
- External links: visually hidden "(opens in new tab)" plus an icon with `aria-hidden`.
- All images have meaningful `alt`, or `alt=""` if decorative (e.g. the wheat background).
- Form: labels, errors, `autocomplete="name"` / `"email"`.
- Motion: `prefers-reduced-motion` handled in GSAP (matchMedia) and in CSS (`scroll-behavior`, transitions).
- Colour tokens meet AA (UI_UX_AUDIT §3.3).

## 11. Security & config
- No secrets. `.env.local` gitignored. Only `NEXT_PUBLIC_*` variables (non-secret by design).
- `next.config.mjs` headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo off), `X-Frame-Options: SAMEORIGIN`. CSP is kept simple and documented (allows `frame-src https://www.google.com` for the map, plus the form endpoint in `connect-src`). Strict CSP is optional and adds complexity; recommend adding it after Gate 3 if wanted.
- `poweredByHeader: false`.
- External links use `rel="noopener noreferrer"`.

## 12. Error handling
- `not-found.js`: on-brand 404 ("This path seems to have wandered into the rice fields."), links to Home, Rooms and Contact. *(New microcopy, for your review.)*
- `error.js`: friendly message + "Try again" (`reset()`) + Home link.
- Images: `next/image` with known dimensions; no runtime remote images (no broken-link risk once local).
- Map iframe failure: the "Open in Google Maps" link plus the text note always stay visible.
- Video failure: the poster stays, with a text link "Download/watch video" pointing to the mp4.
- `loading.js` is **not needed** (static pages, instant navigation). It is omitted to avoid flicker.
