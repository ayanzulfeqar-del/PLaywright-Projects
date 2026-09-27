const { expect } = require('@playwright/test');

class ProfilePage {
  constructor(page) {
    this.page = page;
    // ---------- Locators ----------
    this.firstName   = page.locator('[data-test="first-name"]');
    this.lastName    = page.locator('[data-test="last-name"]');
    this.email       = page.locator('[data-test="email"]');
    this.phone       = page.locator('[data-test="phone"]');
    this.city        = page.locator('[data-test="city"]');
    this.updateBtn   = page.locator('[data-test="update-profile-submit"]');
    this.alert       = page.locator('.alert-success');
  }

  // ---------- Actions ----------
  async verifyProfileData(first, last, email) {
    await expect(this.firstName).toHaveValue(first);
    await expect(this.lastName).toHaveValue(last);
    await expect(this.email).toHaveValue(email);
  }

  async updatePhone(phone) {
    await this.phone.fill(phone);
    await this.updateBtn.click();
  }

  async verifySuccess(message) {
    await expect(this.alert).toContainText(message);
  }
}
module.exports = { ProfilePage };
