# Implementation Roadmap — Villa Tanah Shanti

Each phase ends with its acceptance criteria met before moving on. **Nothing runs until Gate 1 is approved.** Phases 2.1–2.9 all happen inside **Gate 2 (local only)**.

---

## Gate 1 — Research approval ← current
**Deliverables:** the 8 documents in `planning/` + `planning/research/` evidence.
**Exit:** your explicit approval, plus answers to decisions D1–D8 (PROJECT_BRIEF §5). Unanswered decisions fall back to the stated recommendation only if you say so.

---

## Gate 2 — Local implementation

### 2.1 Project scaffold
- `create-next-app@latest` (JS, App Router, ESLint, `src/`, no Tailwind), then remove boilerplate.
- Install `gsap`, `@gsap/react` (+ approved devDeps).
- `jsconfig.json` alias, `.gitignore` (add `assets-src/`, `.env*.local`), `.env.example`, README skeleton.
- `git init` locally (**no remote, no push**).

**Accept:** `npm run dev` serves a blank layout at `http://localhost:3000`; lint passes; dependency list matches TEST_PLAN B4.

### 2.2 Asset pipeline
- `scripts/fetch-assets.mjs`: download 64 originals + poster + favicon + video from Wix to `assets-src/` (with retry and checksum logging).
- `scripts/optimize-images.mjs`: sharp → `public/images/**` with descriptive names; write `src/data/images.generated.json` (path, w, h, wixId).
- `scripts/transcode-video.sh`: ffmpeg → 720p mp4 + webm + poster (check that ffmpeg is installed; if missing, report and ask before installing anything system-wide).
- Generate `icon.png`, `apple-icon.png`, OG crops (1200×630) for 7 pages.

**Accept:** every image in CONTENT_ASSET_INVENTORY exists locally; total `public/images` ≤ ~40 MB; video mp4 ≤ ~12 MB; provenance mapping complete.

### 2.3 Design system foundation
- `tokens.css`, `reset.css`, `typography.css`, `globals.css`; next/font setup (Jost, Barlow).
- UI primitives: `Button`, `ExternalLink`, `Eyebrow`, `SectionHeading`, `Card`, `FramedImage`, `VisuallyHidden`, `Icon`.
- A temporary `/_styleguide` route (dev only, removed before Gate 3) showing tokens and components.

**Accept:** all colour pairs used pass AA; focus ring visible on all primitives; components render at 320–1920 without overflow.

### 2.4 Layout shell
- `layout.js` (lang, fonts, skip link, JSON-LD), `Header` + `MobileMenu` + `NavLinks`, `Footer`, `BackToTop`.
- Data: `site.js` nav + external URLs.

**Accept:** keyboard and screen-reader behaviour of the menu per TEST_PLAN A7; header solid-on-scroll; CTA opens Airbnb in a new tab; no horizontal overflow.

### 2.5 Content data
- `pages.js`, `rooms.js`, `staff.js`, `gallery.js` with **verbatim** copy and the image mapping; alt text written for all images.

**Accept:** content-parity script (TEST_PLAN R6) passes 100 % against the inventory.

### 2.6 Pages
1. **Home:** HomeHero (wordmark H1, tagline, HeroVideo), About (`#about` + `#aboutus`), Team (`#team`), CTA band.
2. **Our Rooms:** PageIntro, RoomQuickNav, 5 × RoomSection + Kitchen & dining, per-room "View photos".
3. **Yoga Shala:** intro, copy, equipment highlights (from copy), extra photos (3 legacy images + related gallery shots), CTA.
4. **Exhale Spa:** intro, copy, TreatmentList (6), note that treatments are booked in advance (original copy).
5. **Our Cuisine:** intro, copy, 3 photos.
6. **Photos:** CategoryNav + 7 categories (47 images) + Lightbox.
7. **Contact us:** form (D3 behaviour), Facebook + Airbnb, MapEmbed + note.
8. **404**, `error.js`, `sitemap.js`, `robots.js`, `manifest.js`, legacy redirects.

**Accept (per page):** matches the inventory section order and content; one H1; metadata set; responsive at all TEST_PLAN viewports; no console errors.

### 2.7 Motion
- `lib/gsap/*`, `Reveal`, hero timeline, parallax (hero + room images), menu, lightbox transitions, active-section sync.

**Accept:** ANIMATION_PLAN §7 checklist passes; reduced-motion verified; no-JS verified; no added CLS.

### 2.8 Hardening
- Security headers, preview-env robots guard, image `sizes` tuning, LCP `priority`, remove `/_styleguide`.

**Accept:** Lighthouse targets (TEST_PLAN §6) met or gaps documented with reasons.

### 2.9 Full test pass & handover
- Run TEST_PLAN §1–§8; capture screenshots (390/768/1440) of every route; write the results table.
- Provide: `npm install`, `npm run dev` → `http://localhost:3000`; `npm run build && npm run start` for the production check.

**Gate 2 exit:** site running locally, results reported honestly. **Stop and wait.** No GitHub, no Vercel.

---

## Gate 3 — Local preview review
- You inspect localhost. I apply requested corrections, re-run the affected tests plus the regression subset (V1 overflow, A1 axe, R1–R4 routes, B2 build), and report.
- Repeat until you explicitly approve.

**Exit:** your explicit permission to push to GitHub.

## Gate 4 — GitHub (only after permission)
- Confirm the repository name/owner with you (new, dedicated repo for Project 3; never reuse Project 1/2 repos).
- Review `git status` and the `.gitignore` effect (no `assets-src/`, no `.env*.local`, no `node_modules`).
- Commit with a clear message; push; report the repository URL, branch, and commit SHA.

**Exit:** repository verified. **Stop and wait.** No deployment.

## Gate 5 — Vercel (only after separate permission)
- Create or link a **new** Vercel project for this repository (never overwrite an existing production project). Framework preset Next.js, Node version per `engines`.
- Environment variables: `NEXT_PUBLIC_SITE_URL` (agreed domain), `NEXT_PUBLIC_FORM_ENDPOINT` (if provided).
- Deploy; then verify: deployment status READY, all routes 200, redirects, robots/sitemap correct for production, no `noindex`, OG preview, console clean, Lighthouse spot check.
- Report the deployment URL and the GitHub ↔ Vercel connection only after verification.
- Custom domain (`villatanahshanti.com`) only with your explicit instruction, since it currently points to Wix and switching DNS takes the Wix site offline.

---

## Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Original fonts are Wix-licensed | Visual drift | Close Google substitutes (Jost/Barlow); you review at Gate 3 |
| No form backend / owner email unknown | Enquiries can't be delivered | D3: configurable endpoint + honest fallback; owner to create a form-service account |
| Large originals (up to 18 MB) and a 78 MB video | Slow builds, repo bloat, poor performance | Pre-optimise; keep raw files out of git |
| Wix-hosted assets could disappear | Broken images if hotlinked | Download once and serve locally |
| Baked-in text and frames in images | Visual clutter, accessibility | Alt text includes the words; frame flag avoids double frames; prefer clean variants for heroes |
| Conflicting facts (6×10 vs 6×12 m) | Credibility | Keep verbatim until you decide (D6) |
| Airbnb listing may be inactive | Dead CTA | HTTP check in Phase 2; you confirm the listing is live before Gate 5 |
| Canonical domain mismatch on a vercel.app deploy | SEO confusion | `NEXT_PUBLIC_SITE_URL` decided at Gate 5; preview-env robots guard |
| Scope creep (booking, prices, reviews) | Fabricated or unsupported content | Excluded unless you supply verified data and approve |

## Relative effort (Gate 2) [E]
Pages (2.6) ≈ 35 % · motion (2.7) and design system + shell (2.3–2.4) ≈ 15 % each · hardening and the full test pass (2.8–2.9) ≈ 15 % · scaffold, asset pipeline and content data (2.1, 2.2, 2.5) ≈ 20 %. Progress updates are given at the end of each sub-phase.
