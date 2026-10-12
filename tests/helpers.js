const ROUTES = ['/', '/our-rooms', '/yoga-space', '/exhale-spa', '/our-food', '/photos', '/contact-us'];

const REDIRECTS = [
  ['/welcome', '/'],
  ['/rooms', '/our-rooms'],
  ['/yoga-space-and-facilities', '/yoga-space'],
  ['/inhouse-spa', '/exhale-spa'],
  ['/delicious-and-nutricious-meals', '/our-food'],
  ['/room-photos-1', '/photos'],
  ['/room-photos-2', '/photos'],
];

const VIEWPORTS = [
  [320, 568],
  [375, 667],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
  [844, 390],
];

const AIRBNB = 'https://www.airbnb.com/users/147140693/listings?user_id=147140693&s=3';
const FACEBOOK = 'https://www.facebook.com/Villa-Tanah-Shanti-322122621470020/?ref=br_rs';

// Scroll the page top to bottom so lazy images load and scroll reveals complete.
async function scrollThrough(page, step = 600) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
}

module.exports = { ROUTES, REDIRECTS, VIEWPORTS, AIRBNB, FACEBOOK, scrollThrough };
