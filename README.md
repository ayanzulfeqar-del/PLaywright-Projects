# Playwright + Cucumber (BDD) + Page Object Model

End-to-end tests for https://practicesoftwaretesting.com, written in JavaScript.

## Tech stack
- Playwright (Google Chrome)
- Cucumber (Gherkin / BDD)
- Page Object Model + POManager

## Project structure
```
PoMForE-ComWeb/                     # Page objects (locators + actions for each page)
  LoginPage.js  AccountPage.js  HomePage.js  ProductPage.js
  CheckoutPage.js  ProfilePage.js  ContactPage.js  POManager.js
tests/features/
  EcommerceWebClient.feature        # Scenarios in plain English
  step_definations/step1.js         # Step code (uses POManager)
  support/hook1.js                  # BeforeAll, Before, BeforeStep, AfterStep (screenshot on fail), After
cucumber.js                         # Cucumber config + HTML report
TEST_PLAN.md                        # Detailed test plan
```

## Scenarios covered (15)
Login (valid / invalid), home page, search, no-results search, sort by price and name,
category filter, add to cart + full checkout, profile update, contact form, logout.

## How to run
```bash
npm install
npx playwright install chrome
npm test              # headless
npm run test:headed   # see the browser (slow motion)
npm run test:smoke    # only @smoke scenarios
```
Report: `cucumber-report.html` (screenshots of failed steps are attached).

> Note: practicesoftwaretesting.com is a public demo whose data resets.
> The `BeforeAll` hook re-registers the test user automatically if needed.
