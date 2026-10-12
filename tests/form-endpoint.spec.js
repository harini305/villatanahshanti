// I8: behaviour when a real form endpoint IS configured. Requires a build made with
// NEXT_PUBLIC_FORM_ENDPOINT set (see README "Testing the form endpoint"). Skipped otherwise.
const { test, expect } = require('@playwright/test');

const ENDPOINT = process.env.FORM_ENDPOINT_UNDER_TEST;
test.skip(!ENDPOINT, 'Set FORM_ENDPOINT_UNDER_TEST and run against a build with NEXT_PUBLIC_FORM_ENDPOINT');

async function fill(page) {
  await page.goto('/contact-us');
    await page.waitForFunction(() => document.querySelector('form')?.noValidate === true); // hydrated
  await page.getByLabel('Your name').fill('Test Guest');
  await page.getByLabel('Your email').fill('guest@example.com');
  await page.getByLabel(/How can we help you/).fill('A test enquiry.');
}

test('2xx response shows the original thank-you message and disables double submit while sending', async ({ page }) => {
  let calls = 0;
  await page.route(ENDPOINT, async (route) => {
    calls++;
    await new Promise((r) => setTimeout(r, 600));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await fill(page);
  const submit = page.getByRole('button', { name: /^Send/ });
  await submit.click();
  await expect(page.getByRole('button', { name: /Sending/ })).toBeDisabled();
  await page.getByRole('button', { name: /Sending/ }).click({ force: true }).catch(() => {});
  await expect(page.locator('form').getByRole('status')).toHaveText('Thank you for your enquiry. We will get back to you as soon as we can.');
  expect(calls).toBe(1);
  await expect(page.getByLabel('Your name')).toHaveValue('');
});

test('server error shows a recoverable error message', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 500, body: 'nope' }));
  await fill(page);
  await page.getByRole('button', { name: /^Send/ }).click();
  await expect(page.locator('form').getByRole('alert')).toContainText("couldn’t be sent");
  await expect(page.locator('body')).not.toContainText('Thank you for your enquiry');
});

test('network failure shows the error message', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.abort('internetdisconnected'));
  await fill(page);
  await page.getByRole('button', { name: /^Send/ }).click();
  await expect(page.locator('form').getByRole('alert')).toContainText("couldn’t be sent");
});
