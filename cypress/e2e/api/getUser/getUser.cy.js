import { UserService } from "../services/user.service";
import { userId } from "../../../data/users";
import { getUserByIdSchema, getUsersListSchema } from "../fixtures/schemas";

const userService = new UserService();

describe("Tests listing users[GET]", () => {
  const user = userId.user;

  it("should be able to get user by ID", () => {
    cy.authToken().then((authToken) => {

      userService.getUserById(user, authToken).then((response) => {

        expect(response.status).to.eq(200);
        const parsed = getUserByIdSchema.safeParse(response.body);
        expect(parsed.success).to.be.true;
      });
    });
  });

  it("should be able to list all users", () => {
    cy.authToken().then((authToken) => {
      userService.listAllUsers(authToken).then((response) => {
        expect(response.status).to.eq(200);
        const parsed = getUsersListSchema.safeParse(response.body);
        expect(parsed.success).to.be.true;
      });
    });
  });
});
