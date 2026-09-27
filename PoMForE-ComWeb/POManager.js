const { LoginPage }    = require('./LoginPage');
const { AccountPage }  = require('./AccountPage');
const { HomePage }     = require('./HomePage');
const { ProductPage }  = require('./ProductPage');
const { CheckoutPage } = require('./CheckoutPage');
const { ProfilePage }  = require('./ProfilePage');
const { ContactPage }  = require('./ContactPage');

class POManager {
  constructor(page) {
    this.page         = page;
    this.loginPage    = new LoginPage(page);
    this.accountPage  = new AccountPage(page);
    this.homePage     = new HomePage(page);
    this.productPage  = new ProductPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.profilePage  = new ProfilePage(page);
    this.contactPage  = new ContactPage(page);
  }

  getLoginPage()    { return this.loginPage; }
  getAccountPage()  { return this.accountPage; }
  getHomePage()     { return this.homePage; }
  getProductPage()  { return this.productPage; }
  getCheckoutPage() { return this.checkoutPage; }
  getProfilePage()  { return this.profilePage; }
  getContactPage()  { return this.contactPage; }
}
module.exports = { POManager };
