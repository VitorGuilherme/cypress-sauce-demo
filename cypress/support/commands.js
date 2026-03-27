import { apiUser } from "../data/users";

Cypress.Commands.add("authToken", () => {
  cy.request({
    method: "POST",
    url: "/api/users/login",
    body: {
      email: apiUser.email,
      password: apiUser.password,
    },
  }).then((res) => {
    return res.body.token;
  });
});
