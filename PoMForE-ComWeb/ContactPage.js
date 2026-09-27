const { expect } = require('@playwright/test');

class ContactPage {
  constructor(page) {
    this.page = page;
    // ---------- Locators ----------
    this.subject     = page.locator('[data-test="subject"]');
    this.message     = page.locator('[data-test="message"]');
    this.submitBtn   = page.locator('[data-test="contact-submit"]');
    this.successMsg  = page.locator('.alert-success');
    this.errors      = page.locator('.alert-danger, .invalid-feedback');
  }

  // ---------- Actions ----------
  async sendMessage(subject, message) {
    if (subject) await this.subject.selectOption({ label: subject });
    await this.message.fill(message);
    await this.submitBtn.click();
  }

  async verifySuccess(text) {
    await expect(this.successMsg).toContainText(text);
  }

  async verifyError(text) {
    await expect(this.errors.filter({ hasText: text }).first()).toBeVisible();
  }
}
module.exports = { ContactPage };
