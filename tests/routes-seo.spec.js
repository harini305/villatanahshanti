// R1–R5, R9, S1–S8: routes, redirects, 404, links, metadata, sitemap and robots.
const { test, expect } = require('@playwright/test');
const { ROUTES, REDIRECTS, AIRBNB, FACEBOOK } = require('./helpers');

test.describe('routes', () => {
  for (const path of ROUTES) {
    test(`${path} returns 200 with one h1, landmarks and unique metadata`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res.status()).toBe(200);

      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByRole('banner')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveCount(1);
      await expect(page.locator('nav[aria-label="Main"]').first()).toBeAttached();

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(70);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description.length).toBeGreaterThan(80);
      expect(description.length).toBeLessThanOrEqual(170);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(`https://www.villatanahshanti.com${path === '/' ? '' : path}`);
      const og = await page.locator('meta[property="og:image"]').first().getAttribute('content');
      expect(og).toMatch(/^https:\/\/www\.villatanahshanti\.com\/(images\/og\/og-[a-z]+\.jpg|opengraph-image)/);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);

      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  test('titles and descriptions are unique across pages', async ({ page }) => {
    const titles = new Set();
    const descriptions = new Set();
    for (const path of ROUTES) {
      await page.goto(path);
      titles.add(await page.title());
      descriptions.add(await page.locator('meta[name="description"]').getAttribute('content'));
    }
    expect(titles.size).toBe(ROUTES.length);
    expect(descriptions.size).toBe(ROUTES.length);
  });

  test('unknown routes return the custom 404', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist');
    expect(res.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('wandered into the rice fields');
    await expect(page.getByRole('link', { name: 'Back to the home page' })).toHaveAttribute('href', '/');
  });
});

test.describe('legacy redirects', () => {
  for (const [from, to] of REDIRECTS) {
    test(`${from} → ${to} (permanent)`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 308]).toContain(res.status());
      expect(res.headers()['location']).toBe(to);
      const followed = await request.get(from);
      expect(followed.status()).toBe(200);
    });
  }
});

test.describe('links', () => {
  test('internal links and anchors resolve on every page', async ({ page, request }) => {
    const checked = new Map();
    for (const path of ROUTES) {
      await page.goto(path);
      const hrefs = await page.$$eval('a[href^="/"], a[href^="#"]', (as) => as.map((a) => a.getAttribute('href')));
      for (const href of hrefs) {
        const [route, hash] = href.startsWith('#') ? [path, href.slice(1)] : href.split('#');
        if (!checked.has(route)) checked.set(route, (await request.get(route)).status());
        expect(checked.get(route), `${href} on ${path}`).toBe(200);
        if (hash) {
          if (route !== path) await page.goto(route);
          await expect(page.locator(`[id="${hash}"]`), `#${hash} on ${route}`).toHaveCount(1);
          if (route !== path) await page.goto(path);
        }
      }
    }
  });

  test('external links open safely in a new tab and point to verified destinations', async ({ page }) => {
    const allowed = [AIRBNB, FACEBOOK, 'https://www.google.com/maps/search/?api=1&query=-8.5016654,115.2693959'];
    for (const path of ROUTES) {
      await page.goto(path);
      const links = await page.$$eval('a[href^="http"]', (as) => as.map((a) => ({ href: a.getAttribute('href'), target: a.target, rel: a.rel, text: a.textContent })));
      for (const l of links) {
        expect(allowed, `${l.href} on ${path}`).toContain(l.href);
        expect(l.target).toBe('_blank');
        expect(l.rel).toContain('noopener');
        expect(l.rel).toContain('noreferrer');
        expect(l.text).toContain('opens in new tab');
      }
      const html = await page.content();
      expect(html).not.toMatch(/facebook\.com\/wix|pinterest\.com\/wixcom|instagram\.com\/wix|Proudly created with Wix/i);
    }
  });

  test('header "Check availability" goes to Airbnb', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const cta = page.locator('header').getByRole('link', { name: /Check availability/ });
    await expect(cta).toHaveAttribute('href', AIRBNB);
    await expect(cta).toHaveAttribute('target', '_blank');
  });
});

test.describe('SEO files', () => {
  test('sitemap.xml lists the 7 canonical routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toHaveLength(7);
    for (const path of ROUTES) expect(locs).toContain(`https://www.villatanahshanti.com${path === '/' ? '' : path}`);
  });

  test('robots.txt allows indexing and points to the sitemap', async ({ request }) => {
    const txt = await (await request.get('/robots.txt')).text();
    expect(txt).toMatch(/Allow: \//);
    expect(txt).not.toMatch(/Disallow: \/\s*$/m);
    expect(txt).toContain('Sitemap: https://www.villatanahshanti.com/sitemap.xml');
  });

  test('LodgingBusiness JSON-LD contains only verified facts', async ({ page }) => {
    await page.goto('/');
    const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    expect(data['@type']).toBe('LodgingBusiness');
    expect(data.geo.latitude).toBe(-8.5016654);
    expect(data.numberOfRooms).toBe(5);
    for (const key of ['telephone', 'email', 'priceRange', 'aggregateRating', 'review', 'streetAddress']) {
      expect(JSON.stringify(data)).not.toContain(`"${key}"`);
    }
  });
});
