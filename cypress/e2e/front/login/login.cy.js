import { Login } from "../../front/pages/Login";

//Data
import { invalidUser, validUser } from "../../../data/users";

describe("Login", () => {
  const loginPage = new Login();

  beforeEach(() => {
    loginPage.navigate();
  });

  it("should be able to navigate to page", () => {
    cy.contains("Swag Labs").should("be.visible");
    cy.get('[data-test="username').should("be.visible");
    cy.get('[data-test="password"]').should("be.visible");
    cy.get('[data-test="login-button"]').should("be.visible");
  });

  it("should be able to login succesfully", () => {
    loginPage.login(validUser.username, validUser.password);

    cy.url().should("include", "inventory");
  });

  it("should not be able to login without userName", () => {
    loginPage.invalidLogin(validUser.password);

    cy.contains("Epic sadface: Username is required").should("be.visible");
  });

  it("should not be able to login with invalid username", () => {
    loginPage.login(invalidUser.username, validUser.password);

    cy.contains(
      "Epic sadface: Username and password do not match any user in this service",
    ).should("be.visible");
  });

  it("should not be able to login without password", () => {
    loginPage.loginWithoutPassword(validUser.username);

    cy.contains("Epic sadface: Password is required").should("be.visible");
  });

  it("should not be able to login with invalid password", () => {
    loginPage.login(validUser.username, invalidUser.password);

    cy.contains(
      "Epic sadface: Username and password do not match any user in this service",
    ).should("be.visible");
  });

  it("should be able to logout", () => {
    loginPage.login(validUser.username, validUser.password);

    cy.get(loginPage.selectors.burgerBtn).click();
    cy.get(loginPage.selectors.logoutBtn).click();

    cy.contains("Swag Labs").should("be.visible");
    cy.get('[data-test="username').should("be.visible");
    cy.get('[data-test="password"]').should("be.visible");
    cy.get('[data-test="login-button"]').should("be.visible");
  });
});
