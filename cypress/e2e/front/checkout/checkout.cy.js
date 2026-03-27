import { Checkout } from "../pages/Checkout";
import { Login } from "../pages/Login";

// Data
import { checkoutData, validUser } from "../../../data/users";

describe("Checkout", () => {
  const checkoutPage = new Checkout();
  const loginPage = new Login();

  beforeEach(() => {
    checkoutPage.navigate();
    loginPage.login(validUser.username, validUser.password);
  });

  it("should navigate to cart page", () => {
    checkoutPage.openCart();

    cy.url().should("include", "cart");
    cy.contains("Your Cart").should("be.visible");
  });

  it("should complete checkout successfully", () => {
    checkoutPage.checkout("sauce-labs-backpack", checkoutData);

    cy.url().should("include", "checkout-complete");
    cy.contains("Thank you for your order").should("be.visible");
  });

  it("should complete checkout with multiple items", () => {
    checkoutPage.checkoutMultiple(
      ["sauce-labs-backpack", "sauce-labs-bike-light"],
      checkoutData,
    );

    cy.url().should("include", "checkout-complete");
    cy.contains("Thank you for your order").should("be.visible");
  });

  it("should not continue checkout without first name", () => {
    checkoutPage.addItem("sauce-labs-backpack");
    checkoutPage.openCart();
    checkoutPage.startCheckout();

    checkoutPage.fillForm({
      lastName: checkoutData.lastName,
      postalCode: checkoutData.postalCode,
    });

    checkoutPage.continue();

    checkoutPage.error().should("be.visible");
  });

  it("should not continue checkout without last name", () => {
    checkoutPage.addItem("sauce-labs-backpack");
    checkoutPage.openCart();
    checkoutPage.startCheckout();

    checkoutPage.fillForm({
      firstName: checkoutData.firstName,
      postalCode: checkoutData.postalCode,
    });

    checkoutPage.continue();

    checkoutPage.error().should("be.visible");
  });

  it("should not continue checkout without postal code", () => {
    checkoutPage.addItem("sauce-labs-backpack");
    checkoutPage.openCart();
    checkoutPage.startCheckout();

    checkoutPage.fillForm({
      firstName: checkoutData.firstName,
      lastName: checkoutData.lastName,
    });

    checkoutPage.continue();

    checkoutPage.error().should("be.visible");
  });

  it("should return to inventory after checkout", () => {
    checkoutPage.checkout("sauce-labs-backpack", checkoutData);

    checkoutPage.backHome();

    cy.url().should("include", "inventory");
    cy.contains("Products").should("be.visible");
  });
});
