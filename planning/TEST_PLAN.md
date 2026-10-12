# Test Plan — Villa Tanah Shanti

Tests run locally against `npm run build && npm run start` (production mode) as well as `npm run dev`. Automated checks use Playwright + axe if D7 is approved; otherwise the same checks run as headless-Chrome scripts (puppeteer-core in a scratch folder, outside the project). Results are reported with actual output; failures are reported, not hidden.

## 1. Build & static checks
| # | Check | Pass criteria |
|---|---|---|
| B1 | `npm run lint` | 0 errors |
| B2 | `npm run build` | Succeeds; all 7 routes + 404 are statically prerendered (○/● in the build output) |
| B3 | Bundle | First-load JS per route reported. Target ≤ 130 KB gzipped on content pages [E budget] |
| B4 | No TypeScript, no unapproved deps | `package.json` dependencies = next, react, react-dom, gsap, @gsap/react (+ approved devDeps) |
| B5 | Secrets scan | `git grep -nE "(api[_-]?key|secret|token|password)"` shows nothing sensitive; `.env*.local` gitignored |
| B6 | Console | 0 errors / 0 hydration warnings in the browser console on every route (dev and prod) |

## 2. Routes, links & content
| # | Check | Pass criteria |
|---|---|---|
| R1 | All routes return 200 | `/`, `/our-rooms`, `/yoga-space`, `/exhale-spa`, `/our-food`, `/photos`, `/contact-us` |
| R2 | Legacy redirects | 7 legacy paths return 308/301 → the correct target (SITE_MAP §4) |
| R3 | 404 | `/nope` returns 404 status + custom page |
| R4 | Internal links | Crawl every `<a href>`: no 404s; anchors (`#about`, `#aboutus`, `#team`, `#agung`…) exist |
| R5 | External links | Airbnb + Facebook + Google Maps URLs match `site.js`; `target="_blank"` + `rel="noopener noreferrer"`; HTTP check (non-4xx) where reachable without login |
| R6 | Content parity | Script compares key phrases from CONTENT_ASSET_INVENTORY (every room paragraph, all staff names, all 6 treatments, food paragraphs, yoga paragraphs, map note, success copy) to the rendered text. 100 % present |
| R7 | Image parity | All 47 gallery images + 6 room heroes + yoga/spa/food/team/brand images render; 0 broken images (`naturalWidth > 0`) |
| R8 | No fabricated data | Manual review: no price, phone, email, review, rating or availability claim anywhere |
| R9 | No Wix placeholders | No links to facebook.com/wix, pinterest.com/wixcom, instagram.com/wix; no "Proudly created with Wix" |

## 3. Responsive
Viewports: **320×568, 360×740, 390×844, 414×896, 768×1024, 820×1180, 1024×768, 1280×800, 1440×900, 1920×1080, 2560×1440**, plus landscape 844×390.

| # | Check | Pass criteria |
|---|---|---|
| V1 | Horizontal overflow | `document.documentElement.scrollWidth === clientWidth` on every route at every viewport (automated) |
| V2 | Navigation switch | < 1024: hamburger visible, desktop nav hidden; ≥ 1024: the reverse |
| V3 | Layout | Rooms stack < 768 and alternate ≥ 1024; gallery columns 2/3/4; form fields stack < 640 |
| V4 | Text | Body ≥ 16 px on mobile; no clipped or overlapping text; headings wrap gracefully (long words like "Batukaru" don't overflow at 320) |
| V5 | Images | Correct crops (no heads or beds cut awkwardly in hero `object-position`); no stretching; `sizes` delivers a ≤ 2× needed width (DevTools network check on 390 and 1440) |
| V6 | Touch targets | All interactive elements ≥ 44×44 px on touch viewports (automated bounding-box check; inline text links exempt per WCAG 2.5.8 but with ≥ 24 px line spacing) |
| V7 | Screenshots | Full-page screenshots of every route at 390 / 768 / 1440 saved for your Gate 3 review |
| V8 | Real devices (if available) | iOS Safari + Android Chrome: hero `svh`, sticky header, menu scroll lock, video inline playback |

## 4. Accessibility (WCAG 2.2 AA)
| # | Check | Pass criteria |
|---|---|---|
| A1 | axe-core scan per route (desktop + mobile, menu open, lightbox open) | 0 serious/critical violations |
| A2 | Headings | Exactly one `h1` per page; no skipped levels |
| A3 | Landmarks | header, nav (labelled), main, footer present once |
| A4 | Keyboard: full tab-through | Logical order; every control reachable and operable; no traps except intended (menu/lightbox, Esc exits) |
| A5 | Focus visibility | Visible `:focus-visible` ring on every control, on light and image backgrounds |
| A6 | Skip link | First Tab shows "Skip to main content"; Enter moves focus to `#main` |
| A7 | Mobile menu | `aria-expanded` toggles; focus moves into the panel; Esc closes and returns focus; background inert; closes on navigation |
| A8 | Lightbox | Opens with focus on the dialog; ←/→/Esc work; counter announced; focus returns to the originating tile |
| A9 | Form | Labels programmatically linked; errors announced (`aria-live`/summary); `aria-invalid` set; success/error status announced |
| A10 | Contrast | All text/background pairs ≥ 4.5:1 (≥ 3:1 large); verified by axe + manual check of text over images (overlay ensures ≥ 4.5:1) |
| A11 | Alt text | Every content image has meaningful alt; decorative = `alt=""`; baked-in words included |
| A12 | Reduced motion | DevTools "prefers-reduced-motion: reduce": no transforms/parallax; content fully visible |
| A13 | Zoom | 200 % browser zoom and 400 % at 1280 px (= 320 CSS px) without loss of content or horizontal scroll |
| A14 | Screen reader smoke test | NVDA + Chrome (Windows) on Home, Rooms, Photos (lightbox), Contact (form errors + success) |

## 5. Interaction & animation
| # | Check | Pass criteria |
|---|---|---|
| I1 | Header | Becomes solid after 80 px scroll; CTA opens Airbnb in a new tab |
| I2 | Hero video | Poster shown, no network download of the mp4 before click (`preload="none"` checked in the Network tab); click plays; controls work; pauses when off-screen |
| I3 | Room "View photos" | Opens the lightbox with the correct room set and count |
| I4 | Gallery | Category chips scroll to sections; active chip updates; tile click opens the right image; swipe works on touch emulation |
| I5 | Back to top | Appears after 1 viewport; returns to top; focus to top |
| I6 | Form – validation | Empty submit → errors for name and email; invalid email → message; valid → submits |
| I7 | Form – endpoint unset | Honest "being set up" notice with Facebook/Airbnb links; **no** success message |
| I8 | Form – endpoint set (test endpoint or mocked `fetch`) | Success copy shown on 200; error copy on 500 / offline; button disabled while sending; double-submit prevented |
| I9 | Honeypot | Filled honeypot → silently not sent |
| I10 | Map | Lazy-loads near the viewport; "Open in Google Maps" opens the correct coordinates |
| I11 | GSAP duplicates | Navigate Home→Rooms→Home→Photos→Home: `ScrollTrigger.getAll().length` on Home is identical each visit (dev log) |
| I12 | No-JS | JS disabled: all text and images visible; nav links work; form shows native validation (submission requires JS, so a `<noscript>` note points to Facebook) |
| I13 | Animation polish | Reveals 0.4–0.6 s; no jank at 4× CPU throttle; no layout shift caused by animation |

## 6. Performance (Lighthouse, mobile preset, production build)
| Metric | Target |
|---|---|
| Performance score | ≥ 90 on all routes (Photos ≥ 85 given image volume) |
| LCP | < 2.5 s (simulated 4G) |
| CLS | < 0.05 |
| INP/TBT | TBT < 200 ms |
| Accessibility score | 100 |
| Best Practices | ≥ 95 |
| SEO | 100 |
| Page weight | Home initial load < 1.5 MB excluding video (video not loaded until click) |
| Fonts | 2 families, `display: swap`, preloaded by next/font; no FOIT |

## 7. SEO
| # | Check | Pass criteria |
|---|---|---|
| S1 | Unique `<title>` + meta description per page | Present, lengths within targets |
| S2 | Canonical | Absolute URL on the configured `metadataBase` for each page |
| S3 | OG/Twitter | Title, description, 1200×630 image per page (validated with a local parser and the opengraph.xyz-style preview in Phase 3) |
| S4 | `sitemap.xml` | 7 URLs, valid XML |
| S5 | `robots.txt` | Production: allow all + sitemap. Preview env: disallow (verified by setting `VERCEL_ENV=preview` locally) |
| S6 | No `noindex` | No `<meta name="robots" content="noindex">` in the production build |
| S7 | JSON-LD | Valid `LodgingBusiness` (Schema.org validator / Rich Results Test at Gate 5); contains only verified facts |
| S8 | Redirects | Legacy URLs 301/308 to canonical pages |

## 8. Cross-browser
Chrome, Edge (installed locally), Firefox (if available), Safari/iOS (via BrowserStack or a real device if you have one; otherwise flagged as untested).

## 9. Reporting
At Gate 2 handover I provide: exact commands, localhost URL, a summary table of every check above (pass/fail/not run + reason), screenshots folder path, Lighthouse scores, and known issues.
