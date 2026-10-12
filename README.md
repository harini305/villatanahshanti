# Villa Tanah Shanti — website rebuild

A modernised, brand-faithful rebuild of [villatanahshanti.com](https://www.villatanahshanti.com/) (originally on Wix):
7 pages, all original copy and photography, responsive from 320 px to 2560 px, accessible, statically generated.

**Status:** Gate 3 (local review) — luxury redesign applied. Nothing has been pushed to GitHub or deployed.

## Stack

| | |
|---|---|
| Framework | Next.js 16.4 (App Router, JavaScript, Turbopack), React 19.3 |
| Animation | GSAP 3.15 + ScrollTrigger, `@gsap/react` (`useGSAP`) |
| Styling | CSS Modules + a small global token layer (`src/styles/tokens.css`, `globals.css`) |
| Fonts | Cormorant Garamond (display serif) and Manrope (body sans), OFL, self-hosted through `next/font/local` |
| Tests (dev only) | `@playwright/test` + `@axe-core/playwright` |

Runtime dependencies: `next`, `react`, `react-dom`, `gsap`, `@gsap/react`. No Tailwind, UI kits or other animation libraries.

## Commands

Requires Node.js 20.9 or later (tested on Node 24).

```bash
npm install

# development server: http://localhost:3030
npx next dev -p 3030        # or: npm run dev (port 3000 by default)

# production build + local production server: http://localhost:3030
npm run build
npx next start -p 3030      # or: npm run start

npm run lint
npm run test                # Playwright + axe; starts `next start` on :3100 against the last build
```

The tests use the installed Google Chrome (`channel: 'chrome'`). Without Chrome, run `npm run test:install`
and then `PW_CHANNEL= npm run test` to use Playwright's own Chromium.
Full-page screenshots at 390/768/1440 px are written to `tests/screenshots/` (gitignored).

### Testing the form endpoint

`NEXT_PUBLIC_FORM_ENDPOINT` is inlined at build time, so the "endpoint configured" behaviour is tested
against a separate build in `.next-form/`:

```bash
NEXT_DIST_DIR=.next-form NEXT_PUBLIC_FORM_ENDPOINT=https://forms.example.test/villa npx next build
NEXT_DIST_DIR=.next-form npx next start -p 3101 &
BASE_URL=http://localhost:3101 FORM_ENDPOINT_UNDER_TEST=https://forms.example.test/villa npx playwright test form-endpoint
```

(The endpoint is intercepted by Playwright; nothing is sent anywhere.)

## Environment variables

See `.env.example`. Both are public (`NEXT_PUBLIC_*`), neither is a secret.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph | `https://www.villatanahshanti.com` |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Form-service URL (e.g. Formspree or Web3Forms) owned by the villa | empty: the form says online sending is unavailable and points to Facebook/Airbnb |

## Routes

| Route | Page |
|---|---|
| `/` | Home: hero (wordmark, tagline, click-to-play video), About (`#about`, legacy `#aboutus`), Explore, The Team (`#team`) |
| `/our-rooms` | Agung, Batukaru, Catur, Batur, Abang, Kitchen & dining, each with its own photo viewer |
| `/yoga-space` | Yoga Shala, equipment, photos recovered from the legacy yoga page |
| `/exhale-spa` | In-house spa and the six treatments |
| `/our-food` | Cuisine and kitchen |
| `/photos` | Gallery: 7 collections, 47 photos, lightbox |
| `/contact-us` | Enquiry form, Facebook/Airbnb, Google Map with the road-entry note |

Permanent (308) redirects in `next.config.mjs`: `/welcome` → `/`, `/rooms` → `/our-rooms`,
`/yoga-space-and-facilities` → `/yoga-space`, `/inhouse-spa` → `/exhale-spa`,
`/delicious-and-nutricious-meals` → `/our-food`, `/room-photos-1` and `/room-photos-2` → `/photos`.

## Project structure

```
scripts/            fetch-assets.mjs, optimize-images.mjs, transcode-video.sh
assets-src/         raw Wix downloads (gitignored, ≈330 MB; recreate with `npm run assets:fetch`)
public/images/      optimised photos by section (brand, home, rooms, yoga, spa, food, gallery, og)
public/video/       villa-tanah-shanti-720.mp4 (11.5 MB) and .webm (10.0 MB)
src/app/            routes, layout, metadata routes (sitemap, robots, manifest), 404 and error boundaries
src/components/     layout/ brand/ ui/ media/ sections/ forms/ motion/
src/data/           site.js, pages.js, rooms.js, gallery.js, images.js, images.generated.json
src/lib/            gsap/ (register, motion tokens), metadata.js, validation.js
src/fonts/          Jost and Barlow woff2 files + OFL licences
tests/              Playwright + axe suite
planning/           Phase 1 research and plans
```

## Assets and provenance

- All 64 original images listed in `planning/research/media-originals.txt`, plus the video poster and favicon,
  were downloaded once from `static.wixstatic.com`. `scripts/optimize-images.mjs` resizes them (long edge
  ≤ 2560 px, mozjpeg q80, metadata stripped) into `public/images/` with descriptive names.
  `src/data/images.generated.json` records each file's original Wix media ID, size and blur placeholder.
  One original (`90c98efd…`) is a byte-identical duplicate of the yoga hero and is intentionally not used.
- Hero video: the 78.7 MB 1080p60 original was transcoded with FFmpeg 6.1 (portable `ffmpeg-static` binary,
  not installed on the system) to 720p30 H.264 two-pass (11.5 MB) and VP9/Opus WebM (10.0 MB).
  It is click-to-play; the `<video>` element isn't created until the visitor presses play.
- `next/image` serves AVIF/WebP at responsive sizes.

## Gate 3 redesign (requested 2026-10-12)

- Typography: Cormorant Garamond + Manrope (replacing Jost + Barlow).
- Mood: light and airy luxury — ivory/cream grounds, deep forest green, sand/gold hairlines, rectangular letter-spaced buttons.
- New homepage: full-screen photo hero, welcome statement with facts, About, film, rooms showcase, yoga/spa/food features, team, gallery preview, invitation.
- Inner pages: text-only headers (no images), with new layouts on every page. Only the homepage has an image hero.
- Desktop split navigation from 1280 px; menu button below that.
- Follow-up refinements: menu links always open the new page at its top (and the current page's link scrolls back up); tighter section spacing; more visible scroll reveals (text rises in, photographs wipe upward while settling from a zoom; gentle fades under reduced motion); hover zoom on every photograph and lift on cards; alignment pass on every page.
- Image quality: masters regenerated at up to 3200 px, mozjpeg q90 4:4:4 (`public/images` ≈ 103 MB); delivered as WebP at q85 (q90 for heroes and the lightbox); `sizes` tuned per slot, including portrait crops. Every image is delivered at full sharpness for 2× desktop and 3× phone screens except where the original upload is smaller (video poster 1,868 px, Batukaru room 2,048 px, shala-with-mats 907 px, flower mandala 1,431 px), which are shown at their full original resolution.

## Decisions applied (from Gate 1)

- D1 modernised, brand-faithful design; D2 legacy routes 308-redirected, unique legacy content folded in;
  D3 configurable form endpoint with honest fallback; D4 Wix placeholder social links removed;
  D5 "© {year} Jade & Andy", Wix credit removed; D6 both yoga dimensions kept verbatim
  (6 x 10 m on Home, 6 x 12 m on the Yoga page); D7 Playwright + axe as devDependencies;
  D8 video transcoded and served locally.
- Copy is verbatim from the original, including its spelling ("luwaks", "trialed", "nutricious").
  New text is limited to UI microcopy, section headings, alt text and short restatements of facts the copy already states.

## Test results (after the Gate 3 redesign, 2026-10-12, production build)

| Area | Result |
|---|---|
| ESLint | 0 errors, 0 warnings |
| `next build` | Succeeds; all 7 pages, 404, sitemap, robots, manifest and icons statically prerendered |
| Playwright suite | 120 passed, 0 failed; 3 endpoint tests skipped in the default run and passed separately against a mock-endpoint build |
| Routes & redirects | 7 routes 200, one `h1` each, landmarks present; 7 legacy paths → 308 to the right page; custom 404 returns 404 |
| Overflow | None on any page at 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560 px and 844×390 landscape |
| axe-core (WCAG 2.0–2.2 A/AA + best practice) | 0 serious/critical violations on every page at 1440 and 390 px, with the menu open, the lightbox open and form errors shown |
| Keyboard | Skip link first, visible focus on every control, menu and lightbox trap focus, Esc closes, focus returns |
| Motion | Reduced motion: nothing hidden or transformed. No JS: all content visible. ScrollTrigger count is identical after repeated navigation |
| Media | Video bytes = 0 until play; plays WebM/MP4; pauses off-screen. All images load; 47 gallery images with unique alt text |
| Form | Validation and error summary; honest "not sent" notice when no endpoint; with a mock endpoint: success copy, error copy, no double submit |
| Page weight (390 px, first visit) | 475–653 KB on most pages, 846 KB on Photos; CLS 0; ~210 KB compressed JS per page |

## Known limitations

- **No form endpoint yet.** Until `NEXT_PUBLIC_FORM_ENDPOINT` is set to a form service the villa owns, the form cannot send; it says so and points to Facebook/Airbnb.
- **JavaScript is ~210 KB compressed per page**, above the plan's estimated 130 KB budget (React/Next runtime plus GSAP on every page).
- **Image masters are large** (≈103 MB in `public/images`) to keep photos HD; visitors only download resized WebP.
- **WebP only.** AVIF is switched off because encoding it locally made first loads very slow; it can be re-enabled in `next.config.mjs` for Vercel.
- **Lighthouse was not run** (not installed); page weight, LCP and CLS were measured with Chrome via Playwright instead.
- **Not tested** on real iOS Safari or Android devices, Firefox or Edge; all automated tests used Google Chrome.
- **No screen-reader (NVDA) session** was done; accessibility is checked with axe plus keyboard and ARIA tests.
- **The video has an audio track but no captions.** Whether it contains speech hasn't been checked.
- **Airbnb and Facebook links** come from the original site; whether the listings are still live was not verified (it needs a login).
- **Canonical/OG URLs** point to `https://www.villatanahshanti.com` (still the Wix site) until `NEXT_PUBLIC_SITE_URL` is changed.
- **Console warning:** Next's automatic prefetch of the Contact page sometimes logs "CSS preloaded but not used". It's harmless.
