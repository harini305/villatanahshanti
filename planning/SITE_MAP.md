# Site Map — Villa Tanah Shanti

Discovered via `sitemap.xml` → `pages-sitemap.xml` (14 URLs, lastmod 2025-01-09). Every page was downloaded (all HTTP 200) and rendered in headless Chrome at 1440 / 768 / 390 px, plus an iPhone user agent. Guessed routes `/about`, `/blog`, `/book`, `/booking` and `/retreats` all return **404**, and an unknown URL returns a real 404.

`robots.txt`: `Allow: /`, `Disallow: *?lightbox=`. No `noindex` on any page.

---

## 1. Current site (linked from the live navigation)

| # | Route | Wix title | Purpose | Main H2 (no page has an H1) |
|---|---|---|---|---|
| 1 | `/` | Villa Tanah Shanti/Ubud Bali/Welcome and a bit about us | Hero (logo, tagline, video), About Us, The Team | "illa Tanah Shanti" (the "V" is the logo image) |
| 2 | `/our-rooms` | Villa Tanah Shanti's rooms | 5 bedrooms plus Kitchen & dining | "Our Rooms" |
| 3 | `/yoga-space` | Villa Tanah Shanti's yoga space | Yoga shala description and equipment | "Our Yoga Shala" |
| 4 | `/exhale-spa` | Villa Tanah Shanti's guests only spa | Spa description and treatment list | "Our In-house Spa" |
| 5 | `/our-food` | Our yummy food | Meals and kitchen philosophy, 3 food photos | "Our Cuisine" |
| 6 | `/photos` | Photos of VTS | Pro Gallery in 7 categories (47 images) | "Gallery" |
| 7 | `/contact-us` | Villa Tanah Shanti, Ubud, Bali - Contact us | Enquiry form, Facebook link, Google Map | (wordmark only) |

### Primary navigation (identical on all current pages)
`About` → `/#aboutus` · `Rooms` → `/our-rooms` · `Yoga` → `/yoga-space` · `Spa` → `/exhale-spa` · `Food` → `/our-food` · `Photos` → `/photos` · `Contact us` → `/contact-us`

- The current page's button is rendered as a non-link `DIV` (no `aria-current`).
- On the home page the nav sits **below** the hero (y≈821 px). On inner pages it sits under the page title (y≈170–400 px). On Contact it is at the **top** (y≈33 px).
- In-page "Home" / "Back to Top" buttons appear at the end of each page.

### Footer (all pages)
- 3 social icons → `facebook.com/wix`, `pinterest.com/wixcom`, `instagram.com/wix` (**Wix template placeholders, not the villa's accounts**)
- "© 2023 by Jade&Andy. Proudly created with Wix.com"
- "Back to Top" widget (third-party iframe)

## 2. Legacy duplicate set (in the sitemap, not linked from the current nav)

These form an older parallel version of the site with its own lowercase nav (`about · rooms · yoga · spa · food · photos · contact us`). They link to each other and to `/contact-us`.

| # | Legacy route | Duplicates | Unique content not on the current page |
|---|---|---|---|
| 8 | `/welcome` | `/` | Staff photo (doorway, PNG `91cd5331`), differently worded team text ("these are the girls and guys…", in the order Wayan, Putri, Arik, Dewa) |
| 9 | `/rooms` | `/our-rooms` | None (identical copy and images) |
| 10 | `/yoga-space-and-facilities` | `/yoga-space` | Hero variant `90c98efd` (byte-identical to `0ef9903b`), plus a 4-image gallery: `178a47be` "Yoga Room Entrance", `d5fb8eb6` Ganesha statue, `e1e48ad2` shala set up with mats |
| 11 | `/inhouse-spa` | `/exhale-spa` | Spa hero variant `51f7f6cc` |
| 12 | `/delicious-and-nutricious-meals` | `/our-food` | Title "energy". Same copy and images |
| 13 | `/room-photos-1` | `/photos` (Agung, Batukaru, Catur) | Coconut background `a1770ccd`; caption "for easier viewing please click on each photo" |
| 14 | `/room-photos-2` | `/photos` (Batur, Abang, Living area, Other) | Same as above |

## 3. Navigation graph

```
                         ┌───────────── Header nav (all current pages) ─────────────┐
 /  ──#aboutus──▶ /#aboutus   /our-rooms   /yoga-space   /exhale-spa   /our-food   /photos   /contact-us
 │                                                                                    │
 ├─ "here" ─▶ Airbnb profile (external, new tab)                                    ├─ Facebook page (external)
 ├─ "Home" ─▶ /                                                                       └─ Google Map (embedded)
 └─ Inner pages: "Back to Top" ─▶ same page (scroll top)

 Legacy island (sitemap only):
 /welcome ⇄ /rooms ⇄ /yoga-space-and-facilities ⇄ /inhouse-spa ⇄ /delicious-and-nutricious-meals ⇄ /room-photos-1 ⇄ /room-photos-2
      └──────────────────────────────────────────────▶ /contact-us
```

## 4. Proposed route map for the rebuild

The current slugs are kept exactly, to preserve search equity and inbound links.

| New route | Source | Notes |
|---|---|---|
| `/` | `/` (+ `/welcome`) | Hero, video, About (`#about`, with an `#aboutus` alias anchor kept for old links), The Team (`#team`) |
| `/our-rooms` | `/our-rooms` | Sections `#agung`, `#batukaru`, `#catur`, `#batur`, `#abang`, `#kitchen-dining`. Each room opens its own photo set in the lightbox. |
| `/yoga-space` | `/yoga-space` (+ legacy gallery) | Adds the 3 unique legacy yoga photos as a small gallery |
| `/exhale-spa` | `/exhale-spa` (+ `/inhouse-spa`) | Treatment list as a semantic `<ul>` |
| `/our-food` | `/our-food` | 3 food photos |
| `/photos` | `/photos` (+ room-photos-1/2) | 7 category sections with a sticky in-page category nav, plus the lightbox |
| `/contact-us` | `/contact-us` | Form, map, Facebook, Airbnb |
| `/not-found` (404) | — | Custom, on-brand page with links back |
| `/sitemap.xml`, `/robots.txt` | — | Generated by the App Router (`app/sitemap.js`, `app/robots.js`) |

**Header order:** About · Rooms · Yoga · Spa · Food · Photos · Contact us, plus a distinct **"Check availability"** call to action (Airbnb, external, opens in a new tab with a visible "opens in new tab" cue).

### Redirects (`next.config.mjs`, `permanent: true`)

| From | To |
|---|---|
| `/welcome` | `/` |
| `/rooms` | `/our-rooms` |
| `/yoga-space-and-facilities` | `/yoga-space` |
| `/inhouse-spa` | `/exhale-spa` |
| `/delicious-and-nutricious-meals` | `/our-food` |
| `/room-photos-1` | `/photos` |
| `/room-photos-2` | `/photos` |

*(Pending decision D2 in PROJECT_BRIEF.)*

## 5. External destinations (verified)

| Destination | URL | Used on |
|---|---|---|
| Airbnb host profile (room availability) | `https://www.airbnb.com/users/147140693/listings?user_id=147140693&s=3` | Home About copy ("check availability here") |
| Facebook page | `https://www.facebook.com/Villa-Tanah-Shanti-322122621470020/?ref=br_rs` | Contact |
| Map location | lat **-8.5016654**, lng **115.2693959** (from the Wix map data item, title "Villa Tanah Shanti") | Contact |

The Airbnb and Facebook URLs were taken from the live HTML. Whether the listings are still active cannot be confirmed without logging in. They will be re-checked in Phase 2 by HTTP status only.
