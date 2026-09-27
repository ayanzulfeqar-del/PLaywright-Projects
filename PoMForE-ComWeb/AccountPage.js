const { expect } = require('@playwright/test');

class AccountPage {
  constructor(page) {
    this.page = page;
    // ---------- Locators ----------
    this.pageTitle   = page.locator('[data-test="page-title"]');
    this.userMenu    = page.locator('[data-test="nav-menu"]');
    this.signOutLink = page.locator('[data-test="nav-sign-out"]');
    this.homeLink    = page.locator('[data-test="nav-home"]');
    this.contactLink = page.locator('[data-test="nav-contact"]');
    this.profileLink = page.locator('[data-test="nav-my-profile"]');
  }

  // ---------- Actions ----------
  async verifyAccountPage(title, userName) {
    await expect(this.page).toHaveURL(/\/account$/);
    await expect(this.pageTitle).toHaveText(title);
    await expect(this.userMenu).toContainText(userName);
  }

  async goToHome()    { await this.homeLink.click(); }
  async goToContact() { await this.contactLink.click(); }

  async goToProfile() {
    await this.userMenu.click();
    await this.profileLink.click();
  }

  async logout() {
    await this.userMenu.click();
    await this.signOutLink.click();
  }
}
module.exports = { AccountPage };
