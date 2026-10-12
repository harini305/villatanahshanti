// R6–R8: original copy present, every image renders, no fabricated business data.
const { test, expect } = require('@playwright/test');
const { ROUTES, scrollThrough } = require('./helpers');

const PHRASES = {
  '/': [
    'Situated only a 10 minute walk from Ubud',
    'This allows for a total of 17 people to be accommodated.',
    'you can check availability',
    '6 x 10 meter yoga studio',
    'everything else that the Island of the Gods has to offer you',
    'Om shanti, shanti shanti - The Villa Tanah Shanti Team.',
    'This is the amazing and fabulous crew that helps make this place what it is.',
    'Clockwise from bottom left,',
    "Putri is Wayan's apprentice and a real delight.",
    "Arik is a 'can-do' guy.",
    'Dewa is another DIY marvel',
    'And finally, Wayan.',
    "You might also catch sight of Dadong, Wayan's quiet but determined mother",
  ],
  '/our-rooms': [
    'How good can life get?',
    'feels almost cathedral like in its spaciousness',
    'even during the hottest of Bali days',
    'Peace, nature and nurture.',
    'This is our only single occupant room',
    'very welcomed by the occupant',
    'The first impression one has of the living area is the huge scale and openness.',
    'so add baking smells to the enticing aspects of this villa!',
    'a place to relax and enjoy the company of friends and other guests.',
  ],
  '/yoga-space': [
    'eight aerial silks',
    'Our space measures 6 x 12 mtrs',
    'three huge cocoon shaped lights',
    'luwaks, butterflies, squirrels, dragonflies, cicadas, tokays, fire-flies, frogs',
    'art stands and stools for those looking for somewhere to host an art based retreat perhaps.',
  ],
  '/exhale-spa': [
    'this quiet and private spa is for the exclusive use of our guests',
    "'Sensatia Botanicals'",
    'virgin coconut oil from one of our close by local villages',
    'We can offer the following treatments on site:',
    'Balinese traditional massage',
    'Hot rock massage',
    'Facial treatments',
    'Body scrubs',
    'Pedicures',
    'Manicures',
  ],
  '/our-food': [
    'We run a completely gluten free kitchen at the villa',
    'the best cashew curry in Bali!',
    'delicious roasted tomato soup',
    "organic straw which is made from the papaya tree's leaf stems",
    'Oh, and did I mention the home made coconut ice-cream?',
  ],
  '/photos': ['Agung', 'Batukaru', 'Catur', 'Batur', 'Abang', 'Living Area', 'Happy snaps', 'For easier viewing please click on each photo.'],
  '/contact-us': ['PLEASE NOTE - the pin is at our road entry. The villa is 150m east towards the river.'],
};

test.describe('content parity', () => {
  for (const [path, phrases] of Object.entries(PHRASES)) {
    test(`original copy present on ${path}`, async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator('main').textContent()).replace(/\s+/g, ' ');
      for (const p of phrases) expect(text, `missing: ${p}`).toContain(p);
    });
  }

  test('the conflicting yoga dimensions are both preserved verbatim', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toContainText('6 x 10 meter yoga studio');
    await page.goto('/yoga-space');
    await expect(page.locator('main')).toContainText('6 x 12 mtrs');
  });
});

test.describe('images', () => {
  for (const path of ROUTES) {
    test(`every image on ${path} loads and content images have alt text`, async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      const images = await page.$$eval('img', (imgs) =>
        imgs
          .filter((i) => !i.closest('dialog:not([open])') && i.getClientRects().length > 0)
          .map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, alt: i.getAttribute('alt'), lazy: i.loading }))
      );
      expect(images.length).toBeGreaterThan(0);
      const broken = images.filter((i) => !i.ok);
      expect(broken, JSON.stringify(broken)).toEqual([]);
      expect(images.every((i) => i.alt !== null)).toBe(true);
    });
  }

  test('the photos page shows all 47 gallery images in 7 collections', async ({ page }) => {
    await page.goto('/photos');
    await expect(page.locator('main section[id] h2')).toHaveCount(7);
    const tiles = page.locator('main section[id] ul button img');
    await expect(tiles).toHaveCount(47);
    const alts = await tiles.evaluateAll((imgs) => imgs.map((i) => i.alt));
    expect(alts.every((a) => a.length > 15)).toBe(true);
    expect(new Set(alts).size).toBe(47);
  });
});

test.describe('honesty', () => {
  test('no prices, phone numbers, emails, reviews or ratings are invented', async ({ page }) => {
    for (const path of ROUTES) {
      await page.goto(path);
      const text = await page.evaluate(() => {
        const clone = document.body.cloneNode(true);
        clone.querySelectorAll('script, style, noscript').forEach((n) => n.remove());
        return clone.textContent.replace(/\s+/g, ' ');
      });
      expect(text, path).not.toMatch(/(\$|USD|IDR|Rp\.?)\s?\d/);
      expect(text, path).not.toMatch(/\+?\d[\d\s-]{8,}\d/);
      expect(text, path).not.toMatch(/[\w.]+@[\w-]+\.[a-z]{2,}/i);
      expect(text, path).not.toMatch(/★|\b\d(\.\d)? (out of|\/) ?5\b|reviews?\b/i);
    }
  });

  test('footer shows the automatic copyright year for Jade & Andy', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText(`© ${new Date().getFullYear()} Jade & Andy`);
  });
});
