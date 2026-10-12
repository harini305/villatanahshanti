// I1–I10, A7–A9: header, mobile menu, video, room photos, gallery lightbox, back to top, contact form, map.
const { test, expect } = require('@playwright/test');
const { AIRBNB, FACEBOOK } = require('./helpers');

test.describe('header & mobile menu', () => {
  test('header gains its scrolled state', async ({ page }) => {
    await page.goto('/our-rooms');
    const header = page.locator('header').first();
    const before = await header.getAttribute('class');
    await page.mouse.wheel(0, 600);
    await expect.poll(async () => header.getAttribute('class')).not.toBe(before);
  });

  test('mobile menu: opens, traps focus, closes with Esc and returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const dialog = page.locator('#mobile-menu');
    await expect(dialog).toHaveAttribute('open', '');
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await expect(page.locator('html')).toHaveClass(/scroll-locked/);
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement.closest('#mobile-menu') || document.activeElement === document.body);
      expect(inside).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open', '');
    await expect(toggle).toBeFocused();
    await expect(page.locator('html')).not.toHaveClass(/scroll-locked/);
  });

  test('mobile menu: navigating closes it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'Photos' }).click();
    await page.waitForURL('**/photos');
    await expect(page.locator('#mobile-menu')).not.toHaveAttribute('open', '');
    await expect(page.locator('h1')).toHaveText('Gallery');
  });

  test('menu links open the new page at its top, even from far down the current page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/our-rooms');
    await page.evaluate(() => window.scrollTo({ top: 5000, behavior: 'instant' }));
    await page.waitForTimeout(400);
    for (const label of ['Photos', 'Spa', 'Rooms']) {
      await page.locator('header nav').getByRole('link', { name: label, exact: true }).click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(700);
      expect(await page.evaluate(() => window.scrollY), label).toBe(0);
      await page.evaluate(() => window.scrollTo({ top: 3000, behavior: 'instant' }));
      await page.waitForTimeout(300);
    }
    // the current page's own link returns to the top
    await page.locator('header nav').getByRole('link', { name: 'Rooms', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('About link reaches the About section (and the legacy #aboutus anchor exists)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/our-food');
    await page.locator('header nav').getByRole('link', { name: 'About' }).click();
    await page.waitForURL('**/#about');
    await expect(page.locator('#about-title')).toBeInViewport();
    await expect(page.locator('#aboutus')).toHaveCount(1);
  });
});

test.describe('hero video', () => {
  test('no video bytes load before play; clicking plays the optimised video', async ({ page }) => {
    const videoRequests = [];
    page.on('request', (r) => r.url().includes('/video/') && videoRequests.push(r.url()));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(videoRequests).toEqual([]);
    await expect(page.locator('video')).toHaveCount(0);

    await page.getByRole('button', { name: /Play the villa video/ }).click();
    const video = page.locator('video');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute('controls', '');
    await expect.poll(() => video.evaluate((v) => v.currentTime), { timeout: 20000 }).toBeGreaterThan(0.5);
    const src = await video.evaluate((v) => v.currentSrc);
    expect(src).toMatch(/villa-tanah-shanti-720\.(webm|mp4)$/);
    expect(videoRequests.length).toBeGreaterThan(0);

    // pauses when scrolled out of view
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  });

  test('the MP4 fallback is served and under 12 MB', async ({ request }) => {
    const res = await request.head('/video/villa-tanah-shanti-720.mp4');
    expect(res.status()).toBe(200);
    expect(Number(res.headers()['content-length'])).toBeLessThan(12 * 1024 * 1024);
  });
});

test.describe('room photos', () => {
  const expected = { agung: 5, batukaru: 6, catur: 5, batur: 7, abang: 6 };
  for (const [slug, count] of Object.entries(expected)) {
    test(`${slug}: "View photos" opens that room's ${count} photos`, async ({ page }) => {
      await page.goto(`/our-rooms#${slug}`);
      const section = page.locator(`#${slug}`);
      await section.getByRole('button', { name: new RegExp(`View photos \\(${count}\\)`) }).click();
      const dialog = page.locator('dialog[open]');
      await expect(dialog).toBeVisible();
      const name = slug[0].toUpperCase() + slug.slice(1);
      await expect(dialog).toContainText(name);
      await expect(dialog).toContainText(`Photo 1 of ${count}`);
      await page.keyboard.press('End');
      await expect(dialog).toContainText(`Photo ${count} of ${count}`);
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog[open]')).toHaveCount(0);
    });
  }
});

test.describe('gallery lightbox', () => {
  test('keyboard: open, next/prev, wrap, Esc, focus returns, scroll locked', async ({ page }) => {
    await page.goto('/photos');
    const tile = page.locator('#batukaru ul button').nth(2);
    await tile.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Photo 3 of 6');
    await expect(page.locator('html')).toHaveClass(/scroll-locked/);
    await expect(page.getByRole('button', { name: 'Close photo viewer' })).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(dialog).toContainText('Photo 4 of 6');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(dialog).toContainText('Photo 2 of 6');
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowLeft');
    await expect(dialog).toContainText('Photo 6 of 6');

    const alt = await dialog.locator('figure img').getAttribute('alt');
    await expect(dialog.locator('figcaption')).toHaveText(alt);

    await page.getByRole('button', { name: 'Next photo' }).click();
    await expect(dialog).toContainText('Photo 1 of 6');

    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(tile).toBeFocused();
    await expect(page.locator('html')).not.toHaveClass(/scroll-locked/);
  });

  test('touch: swipe left advances, swipe right goes back', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await page.goto('/photos');
    await page.locator('#agung ul button').first().tap();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toContainText('Photo 1 of 5');
    const stage = dialog.locator('figure');
    const box = await stage.boundingBox();
    const swipe = async (from, to) => {
      const y = box.y + box.height / 2;
      await stage.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: from, clientY: y, isPrimary: true });
      await stage.dispatchEvent('pointerup', { pointerType: 'touch', clientX: to, clientY: y, isPrimary: true });
    };
    await swipe(box.x + box.width * 0.8, box.x + box.width * 0.2);
    await expect(dialog).toContainText('Photo 2 of 5');
    await swipe(box.x + box.width * 0.2, box.x + box.width * 0.8);
    await expect(dialog).toContainText('Photo 1 of 5');
    await context.close();
  });

  test('category chips jump to their collection and track the active one', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/photos');
    const chips = page.getByRole('navigation', { name: 'Photo collections' });
    await chips.getByRole('link', { name: /Happy snaps/ }).click();
    await expect(page.locator('#happy-snaps-title')).toBeInViewport();
    await expect(chips.locator('a[aria-current="true"]')).toContainText('Happy snaps');
  });
});

test.describe('back to top', () => {
  test('appears after scrolling and returns to the top', async ({ page }) => {
    await page.goto('/our-rooms');
    const btn = page.getByRole('button', { name: 'Back to top' });
    await expect(btn).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect(btn).toBeVisible();
    await btn.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  });
});

test.describe('contact form (no endpoint configured)', () => {
  test('labels are linked to fields', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
    await expect(page.getByLabel('Your name')).toHaveAttribute('autocomplete', 'name');
    await expect(page.getByLabel('Your email')).toHaveAttribute('type', 'email');
    await expect(page.getByLabel(/How can we help you/)).toBeVisible();
  });

  test('empty submit shows a focused error summary and inline errors', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
    await page.getByRole('button', { name: /^Send/ }).click();
    const summary = page.getByRole('alert').filter({ hasText: 'Please check' });
    await expect(summary).toBeFocused();
    await expect(summary).toContainText('these 2 fields');
    await expect(page.getByLabel('Your name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Your email')).toHaveAttribute('aria-describedby', 'error-email');
    await expect(page.locator('#error-name')).toHaveText(/Please enter your name/);
  });

  test('invalid email is explained', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
    await page.getByLabel('Your name').fill('Test Guest');
    await page.getByLabel('Your email').fill('not-an-email');
    await page.getByLabel('Your email').blur();
    await expect(page.locator('#error-email')).toContainText('valid email address');
  });

  test('valid submit is honest: nothing is sent and no success is claimed', async ({ page }) => {
    // Only our own page could submit the form; the embedded Google Map makes its own requests.
    const posts = [];
    page.on('request', (r) => r.method() === 'POST' && posts.push(r.url()));
    await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
    await page.getByLabel('Your name').fill('Test Guest');
    await page.getByLabel('Your email').fill('guest@example.com');
    await page.getByLabel(/How can we help you/).fill('Hello, do you have space in March?');
    await page.getByRole('button', { name: /^Send/ }).click();
    const status = page.getByRole('status').filter({ hasText: 'has not been sent' });
    await expect(status).toBeVisible();
    await expect(status).toBeFocused();
    await expect(status.getByRole('link', { name: /Facebook/ })).toHaveAttribute('href', FACEBOOK);
    await expect(status.getByRole('link', { name: /Airbnb/ })).toHaveAttribute('href', AIRBNB);
    await expect(page.locator('body')).not.toContainText('Thank you for your enquiry');
    const ours = posts.filter((u) => !/^https:\/\/([a-z0-9-]+\.)*(google|gstatic|googleapis)\.com\//.test(u));
    test.info().annotations.push({ type: 'POST requests seen', description: posts.join('\n') || 'none' });
    expect(ours).toEqual([]);
  });

  test('honeypot submissions are silently dropped', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
    await page.getByLabel('Your name').fill('Bot');
    await page.getByLabel('Your email').fill('bot@example.com');
    await page.locator('#field-company').fill('spam inc', { force: true });
    await page.getByRole('button', { name: /^Send/ }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('status')).toHaveCount(0);
  });

  test('map embed is lazy and labelled, with the road-entry note and a maps link', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
    const map = page.locator('iframe[title*="Villa Tanah Shanti"]');
    await expect(map).toHaveAttribute('loading', 'lazy');
    await expect(map).toHaveAttribute('src', /-8\.5016654,115\.2693959/);
    await expect(page.getByRole('link', { name: /Open in Google Maps/ }).first()).toHaveAttribute('href', /query=-8\.5016654,115\.2693959/);
  });
});
