const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    // ---------- Locators ----------
    this.productTitle    = page.locator('[data-test="product-title"]');
    this.productQuantity = page.locator('[data-test="product-quantity"]');
    this.cartTotal       = page.locator('[data-test="cart-total"]');
    this.proceedCart     = page.locator('[data-test="proceed-1"]');
    this.proceedSignIn   = page.locator('[data-test="proceed-2"]');
    this.proceedBilling  = page.locator('[data-test="proceed-3"]');
    this.country         = page.locator('[data-test="country"]');
    this.postalCode      = page.locator('[data-test="postal_code"]');
    this.houseNumber     = page.locator('[data-test="house_number"]');
    this.street          = page.locator('[data-test="street"]');
    this.city            = page.locator('[data-test="city"]');
    this.state           = page.locator('[data-test="state"]');
    this.paymentMethod   = page.locator('[data-test="payment-method"]');
    this.finishButton    = page.locator('[data-test="finish"]');
    this.paymentSuccess  = page.locator('[data-test="payment-success-message"]');
    this.orderConfirm    = page.locator('#order-confirmation');
  }

  // ---------- Actions ----------
  async verifyProductInCart(productName, qty) {
    await expect(this.productTitle.first()).toContainText(productName);
    await expect(this.productQuantity.first()).toHaveValue(String(qty));
  }

  async verifyCartTotal(expectedTotal) {
    const total = parseFloat((await this.cartTotal.textContent()).replace('$', ''));
    expect(total).toBeCloseTo(expectedTotal, 2);
  }

  async proceedFromCart()   { await this.proceedCart.click(); }
  async proceedFromSignIn() { await this.proceedSignIn.click(); }

  async fillBillingAddress(a) {
    await this.country.selectOption({ label: a.country });
    await this.postalCode.fill(a.postcode);
    await this.houseNumber.fill(a.house);
    await this.street.fill(a.street);
    await this.city.fill(a.city);
    await this.state.fill(a.state);
    await expect(this.proceedBilling).toBeEnabled();
    await this.proceedBilling.click();
  }

  async selectPaymentAndFinish(method) {
    await this.paymentMethod.selectOption({ label: method });
    await this.finishButton.click();
  }

  async verifyPaymentSuccess(message) {
    await expect(this.paymentSuccess).toContainText(message);
  }

  async confirmOrder() {
    await this.finishButton.click();
  }

  async verifyOrderConfirmation(message) {
    await expect(this.orderConfirm).toContainText(message);
  }
}
module.exports = { CheckoutPage };
