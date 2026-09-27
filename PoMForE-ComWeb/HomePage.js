const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    // ---------- Locators ----------
    this.searchInput    = page.locator('[data-test="search-query"]');
    this.searchButton   = page.locator('[data-test="search-submit"]');
    this.sortDropdown   = page.locator('[data-test="sort"]');
    this.productCards   = page.locator('a.card');
    this.productNames   = page.locator('[data-test="product-name"]');
    this.productPrices  = page.locator('[data-test="product-price"]');
    this.noResults      = page.locator('[data-test="no-results"]');
  }

  // ---------- Actions ----------
  async verifyProductsVisible() {
    await expect(this.productNames.first()).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.sortDropdown).toBeVisible();
  }

  async searchProduct(productName) {
    await this.searchInput.fill(productName);
    await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/products')),
      this.searchButton.click(),
    ]);
    await this.page.waitForTimeout(500);
  }

  async verifyAllProductsContain(text) {
    const names = await this.productNames.allTextContents();
    expect(names.length).toBeGreaterThan(0);
    for (const n of names) expect(n.toLowerCase()).toContain(text.toLowerCase());
  }

  async verifyNoResults(message) {
    await expect(this.noResults).toContainText(message);
  }

  async sortBy(option) {
    await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/products')),
      this.sortDropdown.selectOption({ label: option }),
    ]);
    await this.page.waitForTimeout(500);
  }

  async getPrices() {
    const prices = await this.productPrices.allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async getNames() {
    return (await this.productNames.allTextContents()).map(n => n.trim());
  }

  async filterByCategory(category) {
    await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/products')),
      this.page.getByLabel(category, { exact: true }).check(),
    ]);
    await this.page.waitForTimeout(500);
  }

  async openProduct(productName) {
    await this.productCards.filter({ hasText: productName }).first().click();
  }
}
module.exports = { HomePage };
