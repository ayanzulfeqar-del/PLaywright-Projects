const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ---------------- Login ----------------
Given('the user is on the login page', async function () {
  this.loginPage = this.poManager.getLoginPage();
  await this.loginPage.goTo();
});

When('the user logs in with email {string} and password {string}', async function (email, password) {
  await this.loginPage.validLogin(email, password);
});

Then('the {string} page is shown for user {string}', async function (title, userName) {
  await this.poManager.getAccountPage().verifyAccountPage(title, userName);
});

Then('the error message {string} is shown', async function (message) {
  await this.loginPage.verifyErrorMessage(message);
});

// ---------------- Home / Search / Sort / Filter ----------------
When('the user clicks on Home', async function () {
  await this.poManager.getAccountPage().verifyAccountPage('My account', 'Test User');
  await this.poManager.getAccountPage().goToHome();
});

Then('the product list, search box and sort dropdown are visible', async function () {
  await this.poManager.getHomePage().verifyProductsVisible();
});

When('the user searches for {string}', async function (product) {
  await this.poManager.getHomePage().searchProduct(product);
});

Then('every product shown contains {string}', async function (text) {
  await this.poManager.getHomePage().verifyAllProductsContain(text);
});

Then('the message {string} is shown', async function (message) {
  await this.poManager.getHomePage().verifyNoResults(message);
});

When('the user sorts the products by {string}', async function (option) {
  await this.poManager.getHomePage().sortBy(option);
});

Then('the prices are in {string} order', async function (order) {
  const prices = await this.poManager.getHomePage().getPrices();
  const sorted = [...prices].sort((a, b) => order === 'ascending' ? a - b : b - a);
  expect(prices).toEqual(sorted);
});

Then('the product names are in alphabetical order', async function () {
  const names = await this.poManager.getHomePage().getNames();
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  expect(names).toEqual(sorted);
});

When('the user filters by category {string}', async function (category) {
  await this.poManager.getHomePage().filterByCategory(category);
});

// ---------------- Product / Cart / Checkout ----------------
When('the user opens the product {string}', async function (productName) {
  this.productName = productName;
  await this.poManager.getHomePage().openProduct(productName);
  await this.poManager.getProductPage().verifyProductName(productName);
});

When('the user sets quantity to {int} and adds it to the cart', async function (qty) {
  const productPage = this.poManager.getProductPage();
  this.quantity = qty;
  this.unitPrice = await productPage.getUnitPrice();
  await productPage.setQuantity(qty);
  await productPage.addToCart();
});

Then('the message {string} is shown in a popup', async function (message) {
  await this.poManager.getProductPage().verifyToast(message);
});

Then('the cart shows {int} items', async function (count) {
  await this.poManager.getProductPage().verifyCartCount(count);
});

When('the user opens the cart', async function () {
  await this.poManager.getProductPage().openCart();
});

Then('the cart has {string} with quantity {int} and the correct total', async function (productName, qty) {
  const checkout = this.poManager.getCheckoutPage();
  await checkout.verifyProductInCart(productName, qty);
  await checkout.verifyCartTotal(this.unitPrice * qty);
});

When('the user continues to the billing step', async function () {
  const checkout = this.poManager.getCheckoutPage();
  await checkout.proceedFromCart();
  await checkout.proceedFromSignIn();
});

When('the user enters this billing address', async function (dataTable) {
  const address = dataTable.hashes()[0];
  await this.poManager.getCheckoutPage().fillBillingAddress(address);
});

When('the user pays with {string}', async function (method) {
  await this.poManager.getCheckoutPage().selectPaymentAndFinish(method);
});

Then('the payment message {string} is shown', async function (message) {
  await this.poManager.getCheckoutPage().verifyPaymentSuccess(message);
});

// ---------------- Profile ----------------
When('the user opens My Profile', async function () {
  await this.poManager.getAccountPage().verifyAccountPage('My account', 'Test User');
  await this.poManager.getAccountPage().goToProfile();
});

Then('the profile shows first name {string}, last name {string} and email {string}', async function (first, last, email) {
  await this.poManager.getProfilePage().verifyProfileData(first, last, email);
});

When('the user changes the phone number to {string}', async function (phone) {
  await this.poManager.getProfilePage().updatePhone(phone);
});

Then('the profile message {string} is shown', async function (message) {
  await this.poManager.getProfilePage().verifySuccess(message);
});

// ---------------- Contact ----------------
When('the user opens the Contact page', async function () {
  await this.poManager.getAccountPage().verifyAccountPage('My account', 'Test User');
  await this.poManager.getAccountPage().goToContact();
});

When('the user sends a message with subject {string} and text {string}', async function (subject, text) {
  await this.poManager.getContactPage().sendMessage(subject, text);
});

Then('the contact message {string} is shown', async function (message) {
  await this.poManager.getContactPage().verifySuccess(message);
});

Then('the contact error {string} is shown', async function (message) {
  await this.poManager.getContactPage().verifyError(message);
});

// ---------------- Logout ----------------
When('the user logs out', async function () {
  await this.poManager.getAccountPage().verifyAccountPage('My account', 'Test User');
  await this.poManager.getAccountPage().logout();
});

Then('the user is back on the login page', async function () {
  await expect(this.page).toHaveURL(/\/auth\/login/);
});
