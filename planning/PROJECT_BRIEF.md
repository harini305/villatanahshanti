# Project Brief — Villa Tanah Shanti (Project 3)

**Status:** Phase 1 (research & audit) complete. Waiting for Gate 1 approval.
**Source site:** https://www.villatanahshanti.com/
**Research date:** 2026-10-12
**Project folder:** `D:\clone3` (separate from Projects 1 & 2; no shared repo, assets or config)

---

## 1. What the source site is

| Fact | Evidence |
|---|---|
| Built on **Wix** (classic editor, "Thunderbolt" renderer) | `<meta name="generator" content="Wix.com Website Builder">` |
| **14 public routes** in the sitemap, which form two overlapping page sets: **7 current pages** plus **7 older duplicates** that still resolve | `pages-sitemap.xml` (lastmod 2025-01-09) |
| Desktop layout is a **fixed 980 px canvas**; Wix serves a separate **fixed 320 px mobile layout** to phone user agents. It is **not responsive** | Headless Chrome: `scrollWidth` 980 at 768 px and 390 px (desktop UA); `viewport=width=320` (iPhone UA) |
| Business: a fully staffed luxury villa in Ubud, Bali, for private stays, yoga retreats, trainings and art/dance retreats. Sleeps up to 11, or 17 with the sister villa | Home/About copy |
| Booking: **no on-site booking engine.** Individual rooms link out to the owner's **Airbnb** profile; everything else goes through the contact form | `https://www.airbnb.com/users/147140693/listings?...` |
| Contact: a Wix Form (name, email, message), a Google Map pin, and a real **Facebook** page. **No phone, email or street address is published anywhere** | Contact page HTML, plus a grep of all 14 pages |

## 2. Goals

1. Rebuild the **complete** frontend (every current page and feature, not just a homepage) in Next.js (App Router, JavaScript) with GSAP/ScrollTrigger.
2. **Preserve** all original content: copy, room names, staff names, treatments, food descriptions, the 64 original images, the hero video, the logo, the map location, and the real external links.
3. **Fix the source site's real problems**: no responsive layout, no `<h1>` on any page, empty alt text, low-contrast buttons, Wix placeholder social links, duplicate pages, no OG image, and a 78 MB video.
4. Produce a polished, accessible, fast, SEO-sound site ready for Vercel. Deployment waits for its own approval (see §6).

## 3. Scope

**In scope**
- 7 public pages: Home (About + Team), Our Rooms, Yoga Shala, Exhale Spa, Our Cuisine, Photos (gallery), Contact us.
- Shared header (desktop nav plus accessible mobile menu), shared footer, back-to-top control.
- Gallery with 7 categories and an accessible lightbox. Per-room photo access from the Rooms page.
- Contact form with client validation and honest submission handling (see §5, decision D3).
- Google Map embed, with the original "pin is at our road entry" note.
- Hero video (click-to-play, optimised).
- SEO: per-page metadata (adapted from the originals), canonical URLs, OG/Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD (`LodgingBusiness`, using verified facts only).
- Permanent (301/308) redirects from the 7 legacy routes to their current equivalents.
- Custom 404, error boundary, loading handling where it adds value.
- Reduced-motion support, keyboard support, visible focus, WCAG 2.2 AA contrast.

**Out of scope** (each needs explicit approval)
- Backend, database, authentication, booking engine, payment, CMS.
- Prices, availability calendars, reviews/testimonials. None appear on the source site, so none will be invented.
- New copy beyond small UI microcopy (button labels, form errors, 404 text, alt text).
- Stock or AI-generated imagery.
- TypeScript, UI component libraries, other animation libraries.

## 4. Constraints

- **Stack:** Next.js (current stable, App Router, JavaScript), React, GSAP plus ScrollTrigger (`@gsap/react` for `useGSAP` cleanup), CSS Modules plus a small global token layer. No Tailwind or UI kits.
- **Fonts:** the original fonts (Futura LT, DIN Next, Bree, DIN Neuzeit Grotesk) are **licensed to Wix** and cannot be self-hosted. Close Google Fonts substitutes will be loaded through `next/font` (see UI_UX_AUDIT §2).
- **Assets:** images and video are downloaded once from `static.wixstatic.com` / `video.wixstatic.com` and served locally, so the site does not depend on the Wix account staying live. Originals go up to 18 MB each and must be pre-optimised.
- **Honesty rules:** no invented contact details, prices, availability, amenities or reviews. Unverifiable items are listed in §7.
- **Gates:** see §6. No GitHub push or Vercel deploy without separate explicit approval.

## 5. Decisions needed at Gate 1

| # | Decision | Recommendation |
|---|---|---|
| D1 | **Design direction:** a pixel-faithful Wix replica, or a modernised, brand-faithful rebuild? | **Modernised, brand-faithful.** Keep the logo, the "V-from-rice-plant" wordmark, the taupe/green palette, the lime-bordered content cards, green label pills and the wheat-field atmosphere. Rebuild the layout properly responsive, with refined typography and accessible contrast. See UI_UX_AUDIT §9. |
| D2 | **Legacy duplicate routes** (`/welcome`, `/rooms`, `/yoga-space-and-facilities`, `/inhouse-spa`, `/delicious-and-nutricious-meals`, `/room-photos-1`, `/room-photos-2`) | **301 redirect** to the current equivalents. Their unique content (staff doorway photo, 3 extra yoga photos, spa photo variant, coconut background) is folded into the current pages and gallery. |
| D3 | **Contact form submission.** The original posts to Wix Forms, which emails the owner at an address that is not public. A frontend-only site needs a third-party form endpoint. | Build the form with full validation and submit to a configurable endpoint (`NEXT_PUBLIC_FORM_ENDPOINT`, e.g. Formspree or Web3Forms, using an account the owner controls). **Until that is configured, the form shows an honest notice and points visitors to Facebook and Airbnb. No fake success.** |
| D4 | **Footer social links.** The original footer links to Wix's own Facebook, Pinterest and Instagram (template leftovers). | **Remove** them. Keep only the real Facebook page. Add Instagram etc. only if you supply verified URLs. |
| D5 | **Footer credit "© 2023 by Jade&Andy. Proudly created with Wix.com"** | Keep "© Jade & Andy" ownership wording with an auto year. Drop the Wix credit. Please confirm. |
| D6 | **Yoga studio size conflict:** Home says "6 x 10 meter", the Yoga page says "6 x 12 mtrs". | Keep both texts verbatim (no silent correction) unless you tell me which is right. |
| D7 | **Dev-only test tooling:** `@playwright/test` + `@axe-core/playwright` for automated responsive/a11y/interaction checks | Approve as **devDependencies only** (never shipped to users). Otherwise I test manually with headless Chrome scripts. |
| D8 | **Video hosting:** the 78.7 MB 1080p MP4 | Transcode to a ~720p H.264 file (target under 12 MB) plus a WebM version and a poster image, served from `/public`, `preload="none"`. Needs `ffmpeg` locally, which I will check in Phase 2. |

## 6. Gate sequence (from your brief)

1. **Gate 1 — Research approval** ← *we are here*
2. Gate 2 — Local implementation (localhost only)
3. Gate 3 — Local preview approval and corrections
4. Gate 4 — GitHub push (only after explicit permission)
5. Gate 5 — Vercel deployment (only after separate explicit permission)

Approval of one gate is never treated as approval of the next.

## 7. Unverified / unavailable information

| Item | Status |
|---|---|
| Phone number, email address, street address | **Not published** on the site. None will be shown. |
| Prices, availability, minimum stay, retreat packages | **Not published.** Availability is checked via Airbnb only. |
| Sister villa name and details | Mentioned ("another 6 students"); name not given. |
| Instagram, TripAdvisor or other profiles | None found (the footer icons are Wix placeholders). |
| Where the contact form delivers | Wix-internal. Not discoverable. |
| Exact type of the Wix entrance animations | The DOM shows `data-motion-enter="done"` on 3 hero elements per page. The animation type (fade/float) cannot be read back once played. Recorded as an estimate. |
| Yoga studio dimensions | Conflicting (6×10 vs 6×12 m). See D6. |
| Image 61 (`f2ea6f6b`) | An **architectural render**, not a photo. Kept in the gallery as on the original. |
| Wix "Back to Top" widget | A third-party iframe (`back-to-top.appspot.com`). Its behaviour is replicated natively. |

## 8. Planning documents

| File | Contents |
|---|---|
| `PROJECT_BRIEF.md` | This file |
| `SITE_MAP.md` | All 14 discovered routes, navigation graph, redirect plan |
| `CONTENT_ASSET_INVENTORY.md` | Page-by-page copy, image/video mapping, link inventory |
| `UI_UX_AUDIT.md` | Measured design tokens, layout, components, responsive and accessibility findings |
| `ANIMATION_PLAN.md` | GSAP/ScrollTrigger strategy and rules |
| `TECHNICAL_ARCHITECTURE.md` | Stack, folder structure, components, data, SEO |
| `TEST_PLAN.md` | Responsive, accessibility, interaction, performance and SEO checks |
| `IMPLEMENTATION_ROADMAP.md` | Phased tasks and acceptance criteria |
| `research/` | Evidence: screenshots (desktop/tablet/mobile/lightbox), image contact sheets, original-media size list |
