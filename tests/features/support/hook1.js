const { Before, BeforeAll, After, BeforeStep, AfterStep, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { POManager } = require('../../../PoMForE-ComWeb/POManager');
const fs = require('fs');

setDefaultTimeout(60 * 1000);

// ---------- BeforeAll: runs ONCE before all tests ----------
// Makes sure the test user exists (demo site database gets reset)
BeforeAll(async function () {
  const API = 'https://api.practicesoftwaretesting.com';
  const user = { email: 'user@gmail.com', password: 'User12@?' };

  const login = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (login.ok) {
    console.log('✔ Test user exists');
    return;
  }

  console.log('⚠ Test user not found - registering again...');
  const reg = await fetch(`${API}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: 'Test', last_name: 'User', dob: '1995-01-01', phone: '03001234567',
      ...user,
      address: { street: 'Main Road 1', house_number: '12', city: 'Gujranwala',
                 state: 'Punjab', country: 'PK', postal_code: '52250' },
    }),
  });
  console.log(reg.ok ? '✔ Test user registered' : `✖ Register failed: ${await reg.text()}`);
});

// ---------- Before: runs before EVERY scenario ----------
// Opens Chrome and creates the page objects
Before(async function (scenario) {
  this.browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'true',                              // HEADLESS=false -> see the browser
    channel: process.env.BROWSER_CHANNEL === 'bundled' ? undefined : 'chrome', // Google Chrome
    slowMo: Number(process.env.SLOWMO || 0),                                 // SLOWMO=500 -> slow motion
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.poManager = new POManager(this.page);
  console.log(`\n▶ Scenario started: ${scenario.pickle.name}`);
});

// ---------- BeforeStep: runs before EVERY step ----------
BeforeStep(async function (step) {
  console.log(`   → ${step.pickleStep.text}`);
});

// ---------- AfterStep: runs after EVERY step ----------
// Takes a screenshot if the step failed
AfterStep(async function ({ result, pickle, pickleStep }) {
  if (result.status === Status.FAILED) {
    fs.mkdirSync('screenshots', { recursive: true });
    const name = `${pickle.name}-${pickleStep.text}`.replace(/[^a-z0-9]+/gi, '_').slice(0, 120);
    const shot = await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    this.attach(shot, 'image/png');
    console.log(`   ✖ Step failed - screenshot saved: screenshots/${name}.png`);
  }
});

// ---------- After: runs after EVERY scenario ----------
// Closes the browser
After(async function () {
  await this.context?.close();
  await this.browser?.close();
});
