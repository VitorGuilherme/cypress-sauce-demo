export class Checkout {
  el = {
    cartLink: '[data-test="shopping-cart-link"]',
    checkoutButton: '[data-test="checkout"]',

    firstName: '[data-test="firstName"]',
    lastName: '[data-test="lastName"]',
    postalCode: '[data-test="postalCode"]',
    continue: '[data-test="continue"]',

    finish: '[data-test="finish"]',

    error: '[data-test="error"]',
    completeHeader: ".complete-header",
    backHome: '[data-test="back-to-products"]'
  };

  navigate() {
    cy.visit("https://www.saucedemo.com");
  }

  addItem(productId) {
    cy.get(`[data-test="add-to-cart-${productId}"]`).click();
  }

  addItems(productIds) {
    productIds.forEach(id => this.addItem(id));
  }

  openCart() {
    cy.get(this.el.cartLink).click();
  }

  startCheckout() {
    cy.get(this.el.checkoutButton).click();
  }

  fillForm({ firstName, lastName, postalCode }) {
    if (firstName) cy.get(this.el.firstName).type(firstName);
    if (lastName) cy.get(this.el.lastName).type(lastName);
    if (postalCode) cy.get(this.el.postalCode).type(postalCode);
  }

  continue() {
    cy.get(this.el.continue).click();
  }

  finish() {
    cy.get(this.el.finish).click();
  }

  backHome() {
    cy.get(this.el.backHome).click();
  }

  error() {
    return cy.get(this.el.error);
  }

  completeHeader() {
    return cy.get(this.el.completeHeader);
  }

  checkout(productId, userData) {
    this.addItem(productId);
    this.openCart();
    this.startCheckout();
    this.fillForm(userData);
    this.continue();
    this.finish();
  }

  checkoutMultiple(productIds, userData) {
    this.addItems(productIds);
    this.openCart();
    this.startCheckout();
    this.fillForm(userData);
    this.continue();
    this.finish();
  }
}