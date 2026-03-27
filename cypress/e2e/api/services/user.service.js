export class UserService {
  createUser(payload) {
    return cy.request({
      method: "POST",
      url: "/api/users/register",
      body: payload,
      failOnStatusCode: false,
    });
  }

  loginUser(userEmail, userPassword) {
    return cy.request({
      method: "POST",
      url: "/api/users/login",
      body: {
        email: userEmail,
        password: userPassword,
      },
      failOnStatusCode: false,
    });
  }

  getUserById(userId, auth) {
    return cy.request({
      method: "GET",
      url: `/api/users/${userId}`,
      headers: {
        Authorization: `Bearer ${auth}`,
      },
      failOnStatusCode: false,
    });
  }

  listAllUsers(auth) {
    return cy.request({
      method: "GET",
      url: "/api/users/all",
      headers: {
        Authorization: `Bearer ${auth}`,
      },
      failOnStatusCode: false,
    });
  }

  updateUser(auth, payload) {
    return cy.request({
      method: "PUT",
      url: "/api/users",
      headers: {
        Authorization: auth,
      },
      body: payload,
    });
  }

  deleteUser(userId, auth) {
    return cy.request({
      method: "DELETE",
      url: `/api/users/${userId}`,
      headers: {
        Authorization: auth,
      },
    });
  }
}
