import { Login } from "../pages/Login";
import { Navigation } from "../pages/Navigation";

//Data
import { validUser } from "../../../data/users";

describe("Tests related to the app home ", () => {
  const loginPage = new Login();
  const navigation = new Navigation();

  beforeEach(() => {
    loginPage.navigate();
    loginPage.login(validUser.username, validUser.password);
  });

  it("should be able to visualize items from home page", () => {
    cy.get(navigation.selectors.appTitle).should("be.visible");
    cy.get(navigation.selectors.productsTitle).should("be.visible");
    cy.get(navigation.selectors.sortContainerBtn).should("be.visible");
    cy.contains(navigation.selectors.copyrightText).should("be.visible");
  });

  it("should be able to filter items from A - Z to Z - A ", () => {
    cy.get(navigation.selectors.sortContainerBtn).select("za");

    cy.get(navigation.selectors.sortContainerBtn).should("have.value", "za");
  });

  it("should be able to filter items from low to high ", () => {
    cy.get(navigation.selectors.sortContainerBtn).select("lohi");

    cy.get(navigation.selectors.sortContainerBtn).should("have.value", "lohi");
  });

  it("should be able to open burger menu and see items", () => {
    cy.get(loginPage.selectors.burgerBtn).click();

    cy.contains("All Items").should("be.visible");
    cy.contains("About").should("be.visible");
    cy.contains("Logout").should("be.visible");
    cy.contains("Reset App State").should("be.visible");
  });

  it("should be able to navigate to SauceLabs twitter page", () => {
    cy.get('[data-test="social-twitter"]')
      .invoke("removeAttr", "target")
      .click();

    cy.url().should("include", "saucelabs");
  });
});
