const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;
    // ---------- Locators ----------
    this.productName    = page.locator('[data-test="product-name"]');
    this.unitPrice      = page.locator('[data-test="unit-price"]');
    this.quantityInput  = page.locator('[data-test="quantity"]');
    this.increaseQty    = page.locator('[data-test="increase-quantity"]');
    this.addToCartBtn   = page.locator('[data-test="add-to-cart"]');
    this.toastMessage   = page.locator('#toast-container');
    this.cartQuantity   = page.locator('[data-test="cart-quantity"]');
    this.cartIcon       = page.locator('[data-test="nav-cart"]');
  }

  // ---------- Actions ----------
  async verifyProductName(name) {
    await expect(this.productName).toHaveText(name);
  }

  async getUnitPrice() {
    return parseFloat(await this.unitPrice.textContent());
  }

  // Quantity input is read-only, so we use the + button
  async setQuantity(qty) {
    for (let i = 1; i < qty; i++) await this.increaseQty.click();
    await expect(this.quantityInput).toHaveValue(String(qty));
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }

  async verifyToast(message) {
    await expect(this.toastMessage).toContainText(message);
  }

  async verifyCartCount(count) {
    await expect(this.cartQuantity).toHaveText(String(count));
  }

  async openCart() {
    await this.cartIcon.click();
  }
}
module.exports = { ProductPage };
