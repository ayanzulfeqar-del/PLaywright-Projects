const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    // ---------- Locators ----------
    this.emailInput    = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.signInButton  = page.locator('[data-test="login-submit"]');
    this.errorMessage  = page.locator('[data-test="login-error"]');
  }

  // ---------- Actions ----------
  async goTo() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
  }

  async validLogin(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async verifyErrorMessage(message) {
    await expect(this.errorMessage).toContainText(message);
  }
}
module.exports = { LoginPage };
