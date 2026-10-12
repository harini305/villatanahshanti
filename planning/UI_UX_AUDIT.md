# UI/UX Audit — Villa Tanah Shanti

**Method.** Headless Chrome (puppeteer-core plus the installed Chrome) on 10 pages × 3 viewports (1440×900, 768×1024, 390×844, desktop UA), plus 4 pages with an iPhone UA (Wix mobile site). Computed styles were read from leaf text elements and component boxes, Wix theme variables (`--color_0…60`, `--font_0…10`) were read from `:root`, hover states were triggered, and pixels were sampled from screenshots.

**Legend:** **[O]** = observed/measured value · **[E]** = estimate (visual judgement or derived) · **[R]** = recommendation for the rebuild.

Evidence: `research/screenshots/*.png`

---

## 1. Overall impression

The site has a warm, gentle, hand-made character: a dreamy pink-beige wheat field behind everything, a rice-plant logo that doubles as the "V" of Villa, embossed white title lettering, soft taupe buttons, green "pill" labels and lime-bordered text cards. The photography is strong and professional (high-res interiors with HDR-style processing).

The execution is dated and has real usability problems:

1. **Not responsive.** The fixed 980 px desktop canvas overflows horizontally on tablets. Phones get a separate 320 px layout scaled up by the browser.
2. **Body text is small and dense.** It is mostly 14 px DIN Next Light, with lines of ~150 characters inside 980 px cards (comfortable reading is ~60–80).
3. **No heading hierarchy.** No `<h1>` anywhere. The brand wordmark is an `<h2>` whose first letter is an image ("illa Tanah Shanti"). Subtitles are `<h6>`.
4. **Low-contrast controls.** White on taupe buttons is 2.61:1; white on the green pills is 2.66:1.
5. **Repetitive chrome.** The 300 px wordmark hero is repeated on every page before any content, and the nav moves position between page types.
6. **Template leftovers.** The footer social icons link to Wix's own accounts, and the "Proudly created with Wix" credit remains.
7. **Inaccessible media.** All gallery images have empty alt text. Several photos carry baked-in titles that screen readers can't read. The video has no captions and is 78 MB.
8. **Weak conversion path.** The only booking route is the word "here" buried in paragraph 2 of About. The contact form is the only other action, and no email or phone is published.

---

## 2. Typography

### 2.1 Font families [O]
| Role | Wix font | Where | Licence |
|---|---|---|---|
| Wordmark and page titles | **Futura LT W01 Book** | "illa Tanah Shanti" 65–71 px; "Our Rooms" etc. 41 px | Wix-licensed (Monotype) |
| Script-like accents | **Bree W01 Thin Oblique** | "Ubud, Bali" (33/25 px, italic), "nurtured amidst nature" (40/30 px), green pill labels (19–22 px), form fields (16 px, 700), "send" (22 px, 700) | Wix-licensed (TypeTogether) |
| Body and nav | **DIN Next W01 Light** | Body copy 14–17 px, nav buttons 20 px, list items 14 px bold | Wix-licensed (Monotype) |
| Map note | DIN Neuzeit Grotesk LT W01 (condensed) | 15 px | Wix-licensed |
| Theme heading default | Futura LT W01 Light (`--font_6`) | Fallback "Ubud, Bali" on some pages | Wix-licensed |
| Form success | Helvetica W01 Roman | 14 px | Wix-licensed |

Font files are served from `static.parastorage.com/fonts/v2/...woff2` under Wix's licence and **must not be copied**.

### 2.2 Substitutes [R]
All from Google Fonts via `next/font/google` (self-hosted at build, no layout shift, `display: swap`):

| Original | Substitute | Why |
|---|---|---|
| Futura LT Book/Light | **Jost** (300, 400, 500) | Geometric Futura revival with a near-identical silhouette for the wordmark |
| DIN Next Light | **Barlow** (300, 400, 600) | DIN-flavoured grotesque, very readable at body sizes, wide weight range |
| Bree Thin Oblique | **Jost Light Italic** for the "Ubud, Bali" and tagline accents [E] | Bree has no close free match. Using Jost italic keeps the system to two families. Alternative to compare in Phase 2: Nunito Light Italic. |
| DIN Neuzeit Grotesk (condensed) | **Barlow Condensed** 400 (only if a condensed style is still needed) | Same family as body |

### 2.3 Observed type scale (desktop, 1440) [O]
| Element | Font | Size | Weight / style | Line height | Colour | Effects |
|---|---|---|---|---|---|---|
| Wordmark "illa Tanah Shanti" (home) | Futura Book | 71 px | 400 | normal | #FFFFFF | Stacked 3D shadow: `1px 1px 0 #c8c8c8, 0 2px 0 #b4b4b4, 0 3px 0 #a0a0a0, 0 4px 0 rgba(140,140,140,.5), 0 5px 10px rgba(0,0,0,.5)` |
| Wordmark (inner pages) | Futura Book | 65 px | 400 | normal | #FFF | same |
| Wordmark (legacy /welcome) | — | 103 px | — | — | — | — |
| Page title "Our Rooms", "Gallery"… | Futura Book | 41 px | 400 | normal | #FFF | same shadow, plus a 299×8 px white bar underneath (radius 7 px, inset shadow) |
| "Ubud, Bali" | Bree Thin Oblique | 33 px (home) / 25 px | 400 italic | normal | #FFF | — |
| Tagline "nurtured amidst nature" | Bree Thin Oblique | 40 px (home) / 30 px (contact) | 400 | normal | #FFF | on a green pill |
| Green section label ("About Us", room names) | Bree Thin Oblique | 19 px (home) / 22 px (rooms, gallery) | 400 | normal | #FFF | `text-shadow: 1px 1px 1px rgba(255,255,255,.6), -1px -1px 1px rgba(0,0,0,.6)` (embossed) |
| Nav button label | DIN Next Light | 20 px | 400 | 28 px | #FFF | — |
| Body (home cards) | DIN Next Light | 14 px | 400 | 19.6 px (1.4) | #2A2421 | — |
| Body (team card) | DIN Next Light | 14 px | 400 | 16.8 px (1.2) | #2A2421 | — |
| Body (legacy welcome) | DIN Next Light | 17 px | 400 | 23.8 px | #2A2421 | — |
| Sign-off "Om shanti…" | DIN Next | 18 px | 700 | normal | #2A2421 | embossed shadow |
| Spa treatment list | DIN Next | 14 px | 700 | normal | #2A2421 | — |
| Form input text | Bree Thin Oblique | 16 px | 700 | 22.4 px | #4F4F4F | — |
| Submit "send" | Bree Thin Oblique | 22 px | 700 | 30.8 px | #FFF | — |
| Map note | DIN Neuzeit Grotesk | 15 px | 400 | 21 px | #544943 | centred |

Letter-spacing is `normal` everywhere [O]. Body text is left-aligned. Labels, sign-off and map note are centred [O].
Wix theme scale (`--font_0…10`) [O]: 68 / 16 / 34 / 60 / 34 / 25 / 21 / 20 / 17 / 14 / 12 px, all with a 1.4em line height.

### 2.4 Proposed type scale [R]
Fluid with `clamp()`; root 16 px.

| Token | Use | Size (mobile → desktop) | Family / weight | Line height |
|---|---|---|---|---|
| `--fs-display` | Hero wordmark (H1 on home) | 2.5rem → 4.5rem | Jost 400 | 1.05 |
| `--fs-h1` | Page title (H1 on inner pages) | 2.25rem → 3.25rem | Jost 400 | 1.1 |
| `--fs-h2` | Section headings (room names, "About us") | 1.75rem → 2.25rem | Jost 400 | 1.2 |
| `--fs-h3` | Sub-headings | 1.25rem → 1.5rem | Jost 500 | 1.3 |
| `--fs-accent` | "Ubud, Bali", tagline | 1.25rem → 2rem | Jost 300 italic | 1.2 |
| `--fs-body` | Paragraphs | 1.0625rem → 1.125rem | Barlow 400 | 1.65 |
| `--fs-small` | Captions, notes, footer | 0.875rem → 0.9375rem | Barlow 400 | 1.5 |
| `--fs-label` | Nav, buttons, pills | 0.9375rem → 1rem | Barlow 500, letter-spacing 0.04em | 1.2 |

Paragraph measure: `max-width: 68ch` [R]. Text stays left-aligned. Centred text only for short labels and notes.

---

## 3. Colour

### 3.1 Observed palette [O]
| Role | Value | Source |
|---|---|---|
| Ink (body text) | **#2A2421** | `--color_15` / `--color_37`, text colour |
| Ink muted (subtitles, notes) | **#544943** | `--color_14` / `--color_40`; nav hover background |
| Taupe dark | **#7F6E64** | `--color_13` |
| Taupe (button background) | **#A99E98** | `--color_12`; all nav and "Home" buttons |
| Taupe light (nav strip, lightbox bg, hover text) | **#D4CAC5** | `--color_11`; pixel-sampled nav strip |
| White | **#FFFFFF** | content area, image frames, logo oval |
| Leaf green (pills, submit) | **#68B04D** at 0.7 / 0.9 / 1.0 alpha | box backgrounds |
| Lime (card borders, form success bar, map note bar) | **#BADA55** | pixel-sampled card borders |
| Form text | #4F4F4F | inputs |
| Field background | translucent lime/green over the photo [E] | contact screenshot |
| Unused Wix theme accents | #ED1C24, #0088CB, #FFCB05 and blue/brown ramps | Template defaults, not used visibly |

### 3.2 Contrast check (WCAG 2.2) [O, computed]
| Pair | Ratio | AA normal (4.5) | AA large (3.0) |
|---|---|---|---|
| #2A2421 on #FFFFFF (body) | 15.3 | ✅ | ✅ |
| #544943 on #FFFFFF (muted) | 8.71 | ✅ | ✅ |
| **#FFFFFF on #A99E98 (nav buttons)** | **2.61** | ❌ | ❌ |
| #FFFFFF on #544943 (nav hover bg) | 8.71 | ✅ | ✅ |
| #D4CAC5 on #544943 (actual hover text) | 5.41 | ✅ | ✅ |
| **#FFFFFF on #68B04D (green pills, submit)** | **2.66** | ❌ | ❌ |
| #FFFFFF on #BADA55 | 1.59 | ❌ | ❌ |
| #544943 on #BADA55 (map note) | 5.49 | ✅ | ✅ |
| #2A2421 on #D4CAC5 | 9.51 | ✅ | ✅ |
| White hero text on the wheat photo | variable, often < 3 [E] | ❌ in places | — |

### 3.3 Proposed tokens [R]
Same hues, adjusted so every text/background pair passes AA.

```css
:root {
  /* neutrals (from Wix theme) */
  --c-ink:        #2A2421;
  --c-ink-muted:  #544943;
  --c-taupe-700:  #7F6E64;  /* white text 4.86:1 ✅, replaces #A99E98 as button bg */
  --c-taupe-400:  #A99E98;  /* decorative only: borders, dividers */
  --c-taupe-200:  #D4CAC5;  /* nav strip, section tint, lightbox bg */
  --c-sand-50:    #F7F3F0;  /* new: soft page tint derived from #D4CAC5 [E] */
  --c-white:      #FFFFFF;

  /* greens */
  --c-leaf:       #68B04D;  /* decorative fills and large graphics only */
  --c-leaf-700:   #467A30;  /* white text 5.14:1 ✅, pills and primary buttons */
  --c-lime:       #BADA55;  /* card borders, focus-ring accent, underline bars; never under text */

  /* states */
  --c-focus:      #2A2421;  /* 2px outline + 2px white offset ring */
  --c-error:      #A3261B;  /* new [E]; verify ≥4.5:1 on white */
  --c-success:    #467A30;

  /* overlays */
  --overlay-hero: linear-gradient(180deg, rgba(42,36,33,.35), rgba(42,36,33,.15) 50%, rgba(42,36,33,.45));
}
```

---

## 4. Layout

### 4.1 Observed [O]
| Property | Value |
|---|---|
| Content canvas | **980 px** fixed, centred (x≈230–1210 at a 1440 viewport) |
| Hero block | Full-bleed wheat background. Home hero ≈ 800 px tall (logo, title, tagline, video). Inner page hero ≈ 375–390 px. |
| Logo oval | 196–204 × 220–229 px at x≈230–347. White fill, 6 px white border, `border-radius: 50%`, shadow `7px 8px 16px 6px rgba(0,0,0,.2)` |
| Video | 766 × 433 px (≈16:9), centred under the title |
| Nav strip | Full-bleed `#D4CAC5`, ≈ 85 px tall. 7 buttons, each **96 × 40 px** ("Contact us" also 96 px wide, so the label is cramped), spaced ~18 px apart, centred group ≈ 783 px |
| Content cards | 980 px wide (home 900 px), white, **≈5 px solid #BADA55** border [E], padding ≈ 20 px [E] |
| Section labels (pills) | 166 × 41 px (home), 181 × 45 px (gallery/rooms). Radius 5 px, shadow `9px 10.5px 25px 3px rgba(0,0,0,.6)`. Overlap the top-left of the card/image by ≈ 20 px. |
| Room image frames | ≈ 600 × 400 px image with an 8 px white border, right-aligned in the 980 canvas over the wheat strip. The pill sits bottom-left. |
| Food/yoga hero frames | ~600 × 400 px, right side, 8 px white border |
| Gallery | Pro Gallery collage: rows of mixed sizes (285×190, 256×190, 551×367, 419×279…), ≈ 10 px gaps, 980 px wide. 7 category blocks separated by pills. |
| Vertical rhythm | Section gaps ≈ 25–60 px [E]; inconsistent between pages |
| Header/footer | No real `<header>`/`<footer>` landmarks (Wix master-page containers report 0 height). The footer is the 30 px social icons plus a one-line credit. |
| Page heights (1440) | Home 2177 · Rooms 4320 · Yoga 1305 · Spa 1366 · Food 1684 · Photos 8486 · Contact 1021 px |

### 4.2 Proposed layout system [R]
- **Containers:** `--container: min(100% - 2*var(--gutter), 1200px)`; text column `min(100%, 68ch)`; wide media `min(100%, 1360px)`.
- **Gutters:** `--gutter: clamp(16px, 4vw, 40px)`.
- **Grid:** 12-column CSS grid at ≥ 1024 px, 6 at ≥ 640 px, 1 below that. Room sections alternate image left/right (7/5 split) on desktop and stack on mobile.
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px (`--space-1…10`). Section padding `clamp(64px, 10vw, 128px)` vertical.
- **Image ratios:** room heroes 3:2 (the originals are 3:2, e.g. 6240×4160). Gallery uses the natural ratio in a masonry/justified layout. The team portrait is ~4:7 (cropped 954×1626). Hero background is full-bleed `object-fit: cover`.
- **Cards:** keep the lime border as the brand signature, but thinner: a 3 px `--c-lime` left or top border on a white card with a soft radius (6 px), not a full heavy box.
- **Header:** a single consistent sticky header, ~72 px desktop / 60 px mobile: logo mark plus wordmark left, nav right, "Check availability" CTA. It replaces the repeated 300 px wordmark block.
- **Page intro:** each inner page gets a compact hero (≈ 50–60 vh) with the wheat-field or section photo, H1 page title, and the white underline bar motif (kept as a small accent).
- **Footer:** a real `<footer>` with logo, short description ("A luxury villa for retreats and private stays in Ubud, Bali", condensed from the About copy), nav, Facebook, Airbnb, map note and copyright.

---

## 5. Components

| Component | Observed [O] | Issues | Rebuild [R] |
|---|---|---|---|
| **Nav buttons** | Rectangles 96×40, bg #A99E98, white DIN 20 px; hover: bg → #544943, text → #D4CAC5; current page = non-link DIV with no visual difference [O] | 2.61:1 contrast, no active state, no focus style, cramped "Contact us" | Text links with an animated lime underline on hover/focus, `aria-current` with a persistent underline, ≥ 44 px hit area |
| **"Home" / "Back to Top" buttons** | Same as nav buttons | Repeated per page; inconsistent labels | One floating back-to-top button (44×44, taupe-700, white arrow icon, visible focus) appearing after ~1 viewport of scroll |
| **Green label pills** | #68B04D (70–100%), radius 5, big drop shadow, embossed Bree text | Low contrast, heavy shadow | Real headings (`h2`) with a small leaf-green "eyebrow" pill above (bg `--c-leaf-700`, white 14–15 px, radius 999 px, subtle shadow) |
| **Lime content cards** | White, ~5 px #BADA55 border | Heavy, dated; long line length | White card, 3 px lime accent, generous padding, 68ch measure |
| **Image frames** | 8 px white border, drop shadow | Duplicates the frames baked into some images | 6–8 px white frame only on non-baked images (a flag in the data); subtle shadow |
| **Logo oval** | White oval with shadow, plant PNG | — | Keep as the header mark (smaller, ~48 px) and a large version in the home hero |
| **Hero wordmark** | "V" PNG + "illa Tanah Shanti" text | Screen readers hear "illa Tanah Shanti" | `<h1>` with visually hidden full text "Villa Tanah Shanti" and an `aria-hidden` decorative composition (plant image + "illa Tanah Shanti") |
| **Video player** | Wix player, no autoplay, no poster set on the `<video>` (Wix overlay shows a poster) | 78 MB, no captions | `<video controls preload="none" poster playsinline>` with a custom large play button overlay (`<button aria-label="Play villa video">`). No autoplay. Captions not needed if there is no speech (to confirm in Phase 2; add a short text description). |
| **Gallery** | Pro Gallery collage; hover overlay; lightbox with expand/share/love/close/next/prev | Empty alt text; heavy JS | CSS-columns masonry, `next/image` lazy, category chips (sticky). Custom lightbox: `<dialog>`, ←/→/Esc, swipe, counter "3 / 6", caption = alt, focus returns to the tile. No "love"/share (they depend on Wix). |
| **Room cards** | Image + pill + lime card | — | `RoomSection`: name (h2), occupancy line from the copy (e.g. "Up to 3 guests · king double + single or 3 king singles"), description, "View photos (6)" button opening the lightbox filtered to that room |
| **Treatment list** | Bold paragraphs | Not a list | `<ul>` with leaf icon bullets, 2 columns on desktop |
| **Form** | 2 inputs side by side + textarea + full-width green "send"; translucent fields over the photo; placeholder-only labels | No visible labels, no error states, low contrast on the photo | Solid white form card over the blurred palm-leaf background; visible `<label>`s; inline errors; disabled+spinner while sending; success/error `role="status"` region |
| **Map** | Google Map widget 608×235 | — | Responsive 16:9 (mobile 4:3) lazy iframe, `title="Map showing the road entry to Villa Tanah Shanti, Ubud"`, plus an "Open in Google Maps" link and the note |
| **Footer socials** | Wix placeholders | Wrong links | Facebook only (D4) |
| **Dividers** | White 8 px underline bars under page titles | — | Keep as a 64×4 px lime/white accent bar under H1s |

---

## 6. Responsive behaviour

### 6.1 Observed [O]
| Viewport | Behaviour |
|---|---|
| 1440 (desktop UA) | 980 canvas centred; full-bleed backgrounds |
| 768 (desktop UA) | **Horizontal overflow**: `scrollWidth` 980 > 768. Content cut off with a sideways scroll bar (`research/screenshots/home-768.png`) |
| 390 (desktop UA) | Same: 980 px page, horizontal scroll |
| iPhone UA (Wix mobile site) | Separate layout, `meta viewport width=320` (scaled on bigger phones). Stack: logo + wordmark → tagline pill → video → **nav as a 2-column grid of 120×42 buttons** (no hamburger) → full-width lime cards → images. Page heights grow (Home 2571 px at 320). |
| Touch targets (mobile) | Nav 120×42 (just under 44 px); inline "here" link 27×17 ❌; video controls 26×26 ❌ |
| Breakpoints | None in the CSS sense. Wix switches desktop/mobile by user agent. |

### 6.2 Proposed breakpoints [R]
| Name | Min width | Changes |
|---|---|---|
| base | 0 | Single column, 16 px gutters, hamburger menu, stacked rooms, 2-column gallery |
| `sm` | 640 px | Wider gutters, 2-column treatment list, form fields side by side |
| `md` | 768 px | Room sections 2-column; gallery 3 columns |
| `lg` | 1024 px | Full desktop nav visible (hamburger hidden), 12-column grid, alternating room layout |
| `xl` | 1280 px | Max container 1200 px; gallery 4 columns |

Rules: no horizontal overflow at any width from 320 to 2560 px; images `sizes`-tuned; text scales with `clamp()`; all touch targets ≥ 44×44 px; works in landscape phones (hero min-height uses `svh`).

---

## 7. UX findings and recommendations

| # | Finding | Severity | Recommendation |
|---|---|---|---|
| U1 | No responsive layout | Critical | Mobile-first CSS rebuild (§6.2) |
| U2 | Booking path buried ("here" inside About) | High | Persistent "Check availability" CTA in the header and footer, plus a CTA band at the end of Home, Rooms and Yoga ("Plan a retreat or private stay": Enquire → /contact-us, Check room availability → Airbnb) |
| U3 | No H1, wordmark split into image + text | High (SEO/a11y) | One H1 per page (§5) |
| U4 | Low-contrast buttons and pills | High | Darkened tokens (§3.3) |
| U5 | Empty alt text across 47 gallery images | High | Descriptive alt per image (drafted from the subject list in CONTENT_ASSET_INVENTORY §6) |
| U6 | 300 px wordmark hero repeated on every page; nav position jumps | Medium | Consistent sticky header plus compact page intros |
| U7 | Long line lengths (≈150 characters) at 14 px | Medium | 17–18 px body, 68ch measure |
| U8 | Gallery: 8,486 px single page, no way to jump to a category | Medium | Sticky category chips with anchor links |
| U9 | Rooms page: photos of each room live on a different page | Medium | "View photos" per room opens that room's set in the lightbox |
| U10 | Form: placeholder-only labels, no error messages, optional message field | Medium | Visible labels, inline validation, message recommended (keep optional to match the original) |
| U11 | Wix placeholder socials and Wix credit | Medium (trust) | Remove (D4/D5) |
| U12 | 78 MB video, 18 MB images | High (performance) | Transcode and pre-optimise (TECHNICAL_ARCHITECTURE §9) |
| U13 | No OG image, so link previews are blank | Medium | OG image per page (1200×630 crops of section heroes) |
| U14 | Duplicate legacy pages split SEO | Medium | 301 redirects (D2) |
| U15 | Baked-in text on images (room names, "Tofu Curry", "Exhale Spa", "Yoga Room Entrance") | Low | Include those words in alt text; avoid placing heading text over those areas; prefer non-text variants for heroes where one exists (e.g. Agung `8b10d97a`) and keep the text versions in the gallery [decision for Phase 2 review] |

---

## 8. Accessibility audit summary (source site)

| Check | Result |
|---|---|
| Landmarks | No semantic header/nav/main/footer roles visible to assistive technology ❌ |
| Headings | No H1; H2/H6 misuse ❌ |
| Alt text | Gallery all empty; a few filenames used as alt ("Staff on stairs.jpg", "IMG_6461.JPG") ❌ |
| Contrast | Buttons and pills fail ❌ |
| Keyboard | Wix default focus; nav buttons focusable, but no visible custom focus style ⚠️ |
| Form labels | Placeholders only (an empty `<label>` was observed) ❌ |
| Motion | Wix entrance animations do not check `prefers-reduced-motion` [E] ⚠️ |
| Language | `lang="en"` ✅ |
| Console errors | None captured on any page at any viewport ✅ |

## 9. Design direction proposal (for Gate 1, decision D1)

**"Nurtured amidst nature — refined."** Keep everything that is recognisably Villa Tanah Shanti and remove the Wix-era friction.

- **Keep:** the rice-plant logo and V-wordmark composition; the taupe/sand neutrals; leaf green and lime as accents; the soft wheat-field image as the atmospheric backdrop of the home hero and page intros; white-framed photographs; green label pills (as eyebrows); lime accents on cards; the embossed-title feeling (as a subtle `text-shadow`, not a 5-layer 3D effect); all original copy and photos.
- **Change:** responsive, generous layout; a single sticky header with a clear CTA; larger, more readable body type; a real heading hierarchy; accessible contrast; a modern gallery with lightbox; subtle GSAP reveals and gentle parallax (see ANIMATION_PLAN).
- **Mood:** calm, airy, warm-neutral, photographic. Photography leads; UI recedes.
