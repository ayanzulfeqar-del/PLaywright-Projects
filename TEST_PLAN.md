# Test Plan – Practice Software Testing (Toolshop)
**Application:** https://practicesoftwaretesting.com (v2.5, Angular 20)
**Tool:** Playwright (JavaScript) · **Test user:** user@gmail.com / User12@? (Test User)
**Prepared:** 27-Sep-2026

---

## 1. Objective
Check that the main features of the Toolshop e-commerce demo work correctly: authentication, product browsing, search/filter/sort, product details, cart, checkout, account management, contact, rentals, and localization. The plan covers both functional and non-functional (UI, cross-browser, accessibility, basic security) testing.

## 2. Scope
### In scope
| # | Module | URL / Area |
|---|--------|-----------|
| 1 | Registration | `/auth/register` |
| 2 | Login / Logout / Forgot password | `/auth/login`, `/auth/forgot-password` |
| 3 | Home – product listing | `/` |
| 4 | Search, Sort, Price range, Filters (category, brand, eco-friendly) | Home sidebar |
| 5 | Categories navigation | `/category/hand-tools`, `power-tools`, `other`, `special-tools` |
| 6 | Product detail | `/product/{id}` |
| 7 | Compare products | `compare-btn`, `add-to-compare` |
| 8 | Favorites | `/account/favorites` |
| 9 | Cart + 4-step Checkout | `/checkout` |
| 10 | My Account – Profile, Password change, 2FA (TOTP) | `/account/profile` |
| 11 | Invoices | `/account/invoices` |
| 12 | Messages + Contact form | `/account/messages`, `/contact` |
| 13 | Rentals | `/rentals` |
| 14 | Language switch (EN, DE, EL, ES, FR, NL, TR) | Header |
| 15 | Pagination | Home |

### Out of scope
- "Sign in with Google" (third-party OAuth)
- Real payment processing
- Load/stress testing on the shared public demo (please don't overload it)
- Chat widget & live-activity widget (only a smoke check)

## 3. Test approach
| Type | Description |
|------|-------------|
| Smoke | Login → Home → Add to cart → Checkout page loads |
| Functional (positive/negative) | Every form and feature below |
| Boundary / Equivalence | Quantity, price slider, password rules, file upload size |
| E2E | Full purchase journey, placing an order that creates an invoice |
| Regression | Full Playwright suite runs on every build (CI) |
| Cross-browser | Chromium, Firefox, WebKit + mobile viewport (Pixel 7, iPhone 14) |
| UI / Visual | Screenshot comparison of key pages |
| Accessibility | `@axe-core/playwright` scan on key pages |
| API | Backend REST API (`api.practicesoftwaretesting.com`) through Playwright `request` for setup and checks |
| Security (basic) | Access control on protected routes, XSS in inputs, session after logout |

## 4. Environment & tools
- Node 20, `@playwright/test` latest; selectors use the **`data-test`** attribute (`testIdAttribute: 'data-test'` → `page.getByTestId()`)
- Reports: Playwright HTML report, traces and screenshots on failure
- CI: GitHub Actions (optional)

## 5. Selectors found during exploration (`data-test`)
| Area | Selectors |
|------|-----------|
| Login | `email`, `password`, `login-submit`, `login-error` |
| Register | `first-name`, `last-name`, `dob`, `country`, `postal_code`, `house_number`, `street`, `city`, `state`, `phone`, `email`, `password`, `register-submit` |
| Nav | `nav-home`, `nav-categories`, `nav-hand-tools`, `nav-power-tools`, `nav-other`, `nav-special-tools`, `nav-rentals`, `nav-contact`, `nav-sign-in`, `nav-menu`, `nav-my-account`, `nav-my-favorites`, `nav-my-profile`, `nav-my-invoices`, `nav-my-messages`, `nav-sign-out`, `nav-cart`, `cart-quantity`, `language-select`, `lang-xx` |
| Listing | `search-query`, `search-submit`, `search-reset`, `sort`, `category-{id}`, `brand-{id}`, `eco-friendly-filter`, `product-{id}`, `product-name`, `product-price`, `co2-rating-badge`, `out-of-stock`, `compare-btn`, `pagination-prev/next` |
| Product | `product-name`, `unit-price`, `product-description`, `decrease-quantity`, `quantity`, `increase-quantity`, `add-to-cart`, `add-to-favorites`, `add-to-compare`, `product-specs` |
| Checkout | `product-title`, `product-quantity`, `line-price`, `cart-total`, `continue-shopping`, `proceed-1`, `proceed-2`, `proceed-3`, `payment-method`, `finish` |
| Profile | `first-name`…`country`, `update-profile-submit`, `current-password`, `new-password`, `new-password-confirm`, `change-password-submit`, `totp-code`, `verify-totp` |
| Contact | `subject`, `message`, `attachment`, `contact-submit` |

---

## 6. Test cases

**Priority:** P1 = critical, P2 = high, P3 = medium

### 6.1 Registration (REG)
| ID | Scenario | Steps / Data | Expected | P |
|----|----------|-------------|----------|---|
| REG-01 | Valid registration | Fill all required fields with a unique email | Redirects to `/auth/login` | P1 |
| REG-02 | Email already registered | Use user@gmail.com | "email already exists" error | P1 |
| REG-03 | Required fields empty | Submit a blank form | Error shown for each field | P2 |
| REG-04 | Invalid email format | `abc@` | Email validation error | P2 |
| REG-05 | Weak password | `abc` / no uppercase / no symbol | Password rule errors | P2 |
| REG-06 | DOB: under 18 / future date / invalid | e.g. 2020-01-01 | Validation error | P3 |
| REG-07 | Phone with letters | `abc123` | Error | P3 |
| REG-08 | Postcode lookup hint | Select country and enter postcode | Street/city get filled (if supported) | P3 |

### 6.2 Login / Logout (AUTH)
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| AUTH-01 ✅ | Valid login (user@gmail.com / User12@?) | Redirects to `/account`, header shows "Test User" | P1 |
| AUTH-02 ✅ | Wrong password | "Invalid email or password" | P1 |
| AUTH-03 | Unregistered email | Same generic error (no user enumeration) | P1 |
| AUTH-04 | Empty email / password | "Email is required", "Password is required" | P2 |
| AUTH-05 | Invalid email format | Format error | P2 |
| AUTH-06 | Account lock after repeated failed logins (e.g. 3+) | Account locked message | P2 |
| AUTH-07 | Logout via `nav-sign-out` | Redirects to login, `/account` not reachable | P1 |
| AUTH-08 | Open `/account` without logging in | Redirects to login | P1 |
| AUTH-09 | Password field is masked | `type=password` | P3 |
| AUTH-10 | Forgot password with a valid email | Success message | P2 |
| AUTH-11 | Session survives a page refresh | Still logged in | P2 |
| AUTH-12 | Links to Register and Forgot password | Correct pages open | P3 |

### 6.3 Home / Product listing (HOME)
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| HOME-01 ✅ | Login → click Home | Product grid, search box, and sort are visible | P1 |
| HOME-02 | Each card shows name, price, CO₂ badge, image | All present | P2 |
| HOME-03 | Out-of-stock badge (e.g. Long Nose Pliers) | "Out of stock" shown | P2 |
| HOME-04 | Pagination: next / prev / page 2 | Product list changes, active page highlighted | P2 |
| HOME-05 | Click a product card | Product detail page opens | P1 |
| HOME-06 | Header links (Documentation, Testing Guide, Bug Hunting), footer links | Correct targets | P3 |

### 6.4 Search / Sort / Filter (SRCH)
| ID | Scenario | Data | Expected | P |
|----|----------|------|----------|---|
| SRCH-01 | Search for an existing product | `Pliers` | Only matching products shown | P1 |
| SRCH-02 | Search with no results | `xyz123` | "No products found" message | P2 |
| SRCH-03 | Search is case-insensitive | `HAMMER` | Results same as for `hammer` | P3 |
| SRCH-04 | Reset search (X) | – | Full list comes back | P2 |
| SRCH-05 | Special characters / XSS | `<script>alert(1)</script>` | No script runs, input is safely escaped | P2 |
| SRCH-06 | Sort Name A–Z / Z–A | – | Names in correct order | P1 |
| SRCH-07 | Sort Price High–Low / Low–High | – | Prices in correct order (compare numbers) | P1 |
| SRCH-08 | Sort CO₂ A–E / E–A | – | Ratings in correct order | P3 |
| SRCH-09 | Price range slider (0–200) | Set 1–20 | All prices within range | P2 |
| SRCH-10 | Category filter (Hammer) | – | Only hammers shown | P1 |
| SRCH-11 | Multiple categories | Hammer + Pliers | Combined results | P2 |
| SRCH-12 | Brand filter (ForgeFlex / MightyCraft) | – | Only that brand shown | P2 |
| SRCH-13 | Eco-friendly only | – | Only eco products shown | P3 |
| SRCH-14 | Filter + sort + search combined | – | All conditions applied | P2 |
| SRCH-15 | Categories menu items (Hand/Power/Other/Special Tools) | – | Category page title correct, products match | P2 |

### 6.5 Product detail (PDP)
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| PDP-01 | Name, price, description, specs, CO₂ badge, image | Match the listing card | P1 |
| PDP-02 | Increase / decrease quantity | Value changes, never goes below 1 | P2 |
| PDP-03 | Quantity boundary values: 0, -1, 1, 9999, text | Blocked or validated | P2 |
| PDP-04 | Add to cart | Toast "Product added to shopping cart.", cart badge count goes up | P1 |
| PDP-05 | Add same product twice | Quantity adds up, no duplicate line | P2 |
| PDP-06 | Add out-of-stock product | Add to cart disabled | P1 |
| PDP-07 | Add to favorites (logged in) | Success toast, product appears in Favorites | P2 |
| PDP-08 | Add to favorites twice | "Already in favorites" message | P3 |
| PDP-09 | Related products section | Links work | P3 |
| PDP-10 | Add to compare / Compare button | Comparison view shows selected products | P3 |

### 6.6 Cart & Checkout (CHK) – 4 steps: Cart → Sign in → Billing → Payment
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| CHK-01 | Cart shows product, qty, unit price, line price, total | Math is correct (line = qty × price, total = sum of lines) | P1 |
| CHK-02 | Change quantity in cart | Line price and total update | P1 |
| CHK-03 | Remove an item | Item removed, total updated, empty-cart message when nothing left | P1 |
| CHK-04 | Continue shopping | Returns to listing, cart kept | P3 |
| CHK-05 | Step 2 when logged in | "Hello Test User, you are already logged in" → proceed | P1 |
| CHK-06 | Step 2 as guest | Can log in inside checkout | P2 |
| CHK-07 | Billing address: all fields required | `proceed-3` disabled until complete | P1 |
| CHK-08 | Payment options: Bank Transfer, Cash on Delivery, Credit Card, Buy Now Pay Later, Gift Card | Each one shows its own fields | P1 |
| CHK-09 | Credit card validation (number, expiry MM/YYYY, CVV, holder) | Invalid values rejected, expired date rejected | P1 |
| CHK-10 | Bank transfer (bank name, account name/number) | Validation works | P2 |
| CHK-11 | BNPL installments / Gift card number + code | Validation works | P2 |
| CHK-12 | Finish order | "Payment was successful" + invoice number | P1 |
| CHK-13 | Invoice created after order | Shows in `/account/invoices` with correct total and address | P1 |
| CHK-14 | Cart persists after refresh / after logout-login | Behaviour as designed | P3 |

### 6.7 My Account (ACC)
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| ACC-01 | Account dashboard tiles: Favorites, Profile, Invoices, Messages | Each opens the right page | P2 |
| ACC-02 | Profile pre-filled with registered data | Values match registration | P2 |
| ACC-03 | Update profile (phone, city) | Success message, values saved after reload | P1 |
| ACC-04 | Profile: clear a required field | Validation error | P2 |
| ACC-05 | Change password: wrong current password | Error | P1 |
| ACC-06 | New ≠ confirm password | Mismatch error | P2 |
| ACC-07 | Password strength meter (Weak → Strong) | Updates as rules are met | P3 |
| ACC-08 | Successful password change → log in with the new one | Works (**restore the old password after the test**) | P2 |
| ACC-09 | 2FA TOTP: invalid code | Error | P3 |
| ACC-10 | Favorites: empty state message; remove a favorite | Correct | P2 |
| ACC-11 | Invoices: list, open detail, download PDF | Data is correct | P2 |
| ACC-12 | Messages: empty state; message appears after sending the contact form | Correct | P3 |

### 6.8 Contact (CON)
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| CON-01 | Logged-in greeting "Hello Test User" | Shown, name/email fields hidden | P3 |
| CON-02 | Valid subject + message (≥ 50 chars) | "Thanks for your message!" | P1 |
| CON-03 | No subject / empty message / short message | Validation errors | P2 |
| CON-04 | Attachment: .txt 0 kB OK; .pdf or non-empty file rejected | Rule enforced | P2 |
| CON-05 | Subject dropdown contains all 6 options | Customer service, Webmaster, Return, Payments, Warranty, Status of my order | P3 |

### 6.9 Rentals (RENT)
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| RENT-01 | Rentals page lists items (Excavator, etc.) | 3 items with description | P2 |
| RENT-02 | Open a rental item → duration slider → add to cart | Price = rate × hours | P2 |

### 6.10 Localization (L10N)
| ID | Scenario | Expected | P |
|----|----------|----------|---|
| L10N-01 | Switch to DE / ES / FR / NL / TR / EL | Navigation and labels translated | P2 |
| L10N-02 | Language kept after reload / navigation | Stays in chosen language | P3 |
| L10N-03 | No untranslated keys or broken layout | – | P3 |

### 6.11 Non-functional
| ID | Type | Check | P |
|----|------|------|---|
| NF-01 | Cross-browser | Smoke + E2E on Chromium, Firefox, WebKit | P1 |
| NF-02 | Responsive | Hamburger menu, filters, checkout on mobile viewport | P2 |
| NF-03 | Accessibility | axe scan: no critical issues; labels, alt text, keyboard navigation for login and checkout | P2 |
| NF-04 | Performance | Home page loads in under 3 s (`performance.timing`), no console errors | P3 |
| NF-05 | Security | Protected routes, XSS in search/contact/profile, token removed after logout, IDOR on another user's invoice URL | P2 |
| NF-06 | Visual | `toHaveScreenshot()` for Home, PDP, Checkout | P3 |

---

## 7. Suggested Playwright project structure
```
pw/
├── playwright.config.js        # baseURL, testIdAttribute: 'data-test', 3 browsers
├── tests/
│   ├── auth.setup.js           # log in once → save storageState (reused by other tests)
│   ├── login-home.spec.js      # ✅ written and passing
│   ├── register.spec.js
│   ├── search-filter.spec.js
│   ├── product.spec.js
│   ├── cart-checkout.spec.js
│   ├── account.spec.js
│   └── contact.spec.js
├── pages/                      # Page Object Model
│   ├── LoginPage.js  HomePage.js  ProductPage.js  CheckoutPage.js  ProfilePage.js
└── test-data/users.json
```
**Best practices:** POM, `storageState` so tests don't log in every time, `getByTestId`, web-first assertions (`expect(...).toBeVisible()`) instead of `waitForTimeout`, unique emails (`user+${Date.now()}@gmail.com`) for registration tests, and API setup (add a cart item via API) to make tests faster.

## 8. Entry / Exit criteria
- **Entry:** site reachable, test account works, Playwright set up
- **Exit:** 100% of P1 tests pass, 95% or more of P2 tests pass, no open Critical/High bugs, report shared

## 9. Risks
| Risk | Mitigation |
|------|-----------|
| Shared public demo: data gets reset or other users change it | Create your own data in each test, avoid hard-coded product IDs |
| Account locks after failed logins | Run lockout tests with a separate throwaway user |
| Site may have deliberate bugs ("Bug Hunting" mode) | Log them as findings |
| Flaky network | `retries: 1`, trace on retry |

## 10. Deliverables
Test plan (this file) · Playwright suite · HTML report · bug reports (ID, steps, expected vs actual, screenshot, severity)

## 11. Exploration notes (27-Sep-2026)
- `user@gmail.com` **did not exist** at first, so login gave "Invalid email or password". I registered the account (Test User, Gujranwala, PK), and after that login works → redirects to `/account`.
- Home: 9 products per page, 5+ pages, 3 brands, 4 top-level categories.
- Checkout has a 4-step wizard; the Billing step blocks `proceed-3` until the address is complete.
- 5 payment methods confirmed.
