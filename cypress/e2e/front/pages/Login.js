export class Login {
  selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    burgerBtn: "#react-burger-menu-btn",
    logoutBtn: '[data-test="logout-sidebar-link"]',
  };

  navigate() {
    cy.visit("https://www.saucedemo.com");
  }

  login(userName, password) {
    cy.get(this.selectors.usernameInput).type(userName);
    cy.get(this.selectors.passwordInput).type(password, { delay: 100 });
    cy.get(this.selectors.loginButton).click();
  }

  invalidLogin(password) {
    cy.get(this.selectors.passwordInput).type(password, { delay: 100 });
    cy.get(this.selectors.loginButton).click();
  }

  loginWithoutPassword(userName) {
    cy.get(this.selectors.usernameInput).type(userName);
    cy.get(this.selectors.loginButton).click();
  }
}
