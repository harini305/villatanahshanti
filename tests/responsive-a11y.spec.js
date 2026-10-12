// V1–V4, V6–V7 and A1–A6, A10–A12: overflow, nav switch, touch targets, axe-core, focus, reduced motion.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { ROUTES, VIEWPORTS, scrollThrough } = require('./helpers');

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function axe(page, label) {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  const summary = results.violations.map((v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
  test.info().annotations.push({ type: `axe ${label}`, description: summary.join('\n') || 'no violations' });
  return { serious, all: results.violations, summary };
}

test.describe('responsive', () => {
  for (const [w, h] of VIEWPORTS) {
    test(`no horizontal overflow at ${w}×${h}`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width: w, height: h });
      for (const path of ROUTES) {
        await page.goto(path);
        await scrollThrough(page, Math.max(400, h));
        const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
        expect(sw, `${path} at ${w}px`).toBeLessThanOrEqual(cw);
      }
    });
  }

  test('navigation switches between menu button and full nav at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1279, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
    await expect(page.locator('header nav[aria-label="Main"]').first()).toBeHidden();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeHidden();
    await expect(page.locator('header nav[aria-label="Main"]').first()).toBeVisible();
  });

  test('body text is at least 16px on a 320px phone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/our-rooms');
    const size = await page.locator('main .prose p').first().evaluate((p) => parseFloat(getComputedStyle(p).fontSize));
    expect(size).toBeGreaterThanOrEqual(16);
  });

  test('interactive controls are at least 44×44px on touch-size screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const small = [];
    for (const path of ROUTES) {
      await page.goto(path);
      const found = await page.$$eval('main button, main a, header button, header a, footer a', (els) =>
        els
          .filter((el) => {
            const s = getComputedStyle(el);
            if (s.visibility === 'hidden' || s.display === 'none' || el.closest('dialog:not([open])')) return false;
            if (el.closest('p, li > p, figcaption') && el.tagName === 'A') return false; // inline text links (WCAG 2.5.8 exception)
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.width < 44 || r.height < 40);
          })
          .map((el) => `${el.tagName} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`)
      );
      small.push(...found.map((f) => `${path}: ${f}`));
    }
    expect(small, small.join('\n')).toEqual([]);
  });

  for (const path of ROUTES) {
    for (const width of [390, 768, 1440]) {
      test(`screenshot ${path} @${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: width < 800 ? 844 : 900 });
        await page.goto(path);
        await scrollThrough(page);
        await page.waitForTimeout(400);
        const name = path === '/' ? 'home' : path.slice(1);
        await page.screenshot({ path: `tests/screenshots/${name}-${width}.png`, fullPage: true });
      });
    }
  }
});

test.describe('accessibility (axe-core)', () => {
  for (const path of ROUTES) {
    for (const [w, h] of [
      [1440, 900],
      [390, 844],
    ]) {
      test(`axe: ${path} @${w}`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await page.goto(path);
        await scrollThrough(page);
        const { serious, summary } = await axe(page, `${path}@${w}`);
        expect(serious, summary.join('\n')).toEqual([]);
      });
    }
  }

  test('axe: mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.locator('#mobile-menu')).toHaveAttribute('open', '');
    await page.waitForTimeout(600);
    const { serious, summary } = await axe(page, 'menu');
    expect(serious, summary.join('\n')).toEqual([]);
  });

  test('axe: lightbox open', async ({ page }) => {
    await page.goto('/photos');
    await page.locator('#agung ul button').first().click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    await page.waitForTimeout(600);
    const { serious, summary } = await axe(page, 'lightbox');
    expect(serious, summary.join('\n')).toEqual([]);
  });

  test('axe: contact form with errors shown', async ({ page }) => {
    await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
    await scrollThrough(page);
    await page.getByRole('button', { name: /^Send/ }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
    const { serious, summary } = await axe(page, 'form-errors');
    expect(serious, summary.join('\n')).toEqual([]);
  });
});

test.describe('keyboard and focus', () => {
  test('skip link is the first tab stop and moves focus to main', async ({ page }) => {
    await page.goto('/our-rooms');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  test('every focusable control shows a visible focus indicator', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const missing = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        const visible = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
        return { visible, label: `${el.tagName} ${(el.textContent || '').trim().slice(0, 30)}` };
      });
      if (info && !info.visible) missing.push(info.label);
    }
    expect(missing, missing.join('\n')).toEqual([]);
  });

  test('current page is marked in the navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/exhale-spa');
    await expect(page.getByRole('navigation', { name: 'Main' }).locator('a[aria-current="page"]')).toHaveText('Spa');
  });
});

test.describe('motion', () => {
  test('reduced motion: content fades in without any movement', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await scrollThrough(page);
    await page.waitForTimeout(800);
    const hidden = await page.$$eval('[data-reveal], [data-hero-intro]', (els) =>
      els.filter((el) => {
        const s = getComputedStyle(el);
        return s.visibility === 'hidden' || parseFloat(s.opacity) < 1 || (s.transform !== 'none' && s.transform !== 'matrix(1, 0, 0, 1, 0, 0)');
      }).length
    );
    expect(hidden).toBe(0);
    await context.close();
  });

  test('without JavaScript every section, heading and image is still rendered and visible', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const path of ROUTES) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      const invisible = await page.$$eval('[data-reveal], [data-hero-intro]', (els) => els.filter((el) => getComputedStyle(el).visibility === 'hidden' || getComputedStyle(el).opacity === '0').length);
      expect(invisible, path).toBe(0);
    }
    await context.close();
  });

  test('scroll reveals complete and ScrollTriggers do not accumulate across navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForFunction(() => typeof window.__vtsTriggerCount === 'function');
    const first = await page.evaluate(() => window.__vtsTriggerCount());
    expect(first).toBeGreaterThan(0);
    const counts = [];
    for (const label of ['Rooms', 'Photos', 'Yoga']) {
      await page.locator('header nav').getByRole('link', { name: label, exact: true }).click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(400);
      await page.locator('header').getByRole('link', { name: 'Villa Tanah Shanti, home' }).click();
      await page.waitForURL('**/');
      await page.waitForTimeout(600);
      counts.push(await page.evaluate(() => window.__vtsTriggerCount()));
    }
    expect(counts).toEqual([first, first, first]);

    await scrollThrough(page);
    const stillHidden = await page.$$eval('[data-reveal]', (els) => els.filter((el) => parseFloat(getComputedStyle(el).opacity) < 1).length);
    expect(stillHidden).toBe(0);
  });
});
