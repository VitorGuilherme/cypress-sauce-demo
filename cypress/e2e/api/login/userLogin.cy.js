import { apiUser } from "../../../data/users";
import { errorSchema, registerSuccessSchema } from "../fixtures/schemas";
import { UserService } from "../services/user.service";

const userService = new UserService();

describe("User Login", () => {
  before(() => {});

  it("Should be able to login successfully", () => {
    userService.loginUser(apiUser.email, apiUser.password).then((response) => {
      expect(response.status).to.eq(201);

      const parsed = registerSuccessSchema.safeParse(response.body);

      expect(parsed.success).to.be.true;
    });
  });

  it("should not be able to login with invalid email", () => {
    userService
      .loginUser("invalidEmailcom", apiUser.password)
      .then((response) => {
        expect(response.status).to.eq(422);

        expect(response.body.errors).to.contain("Insira um e-mail válido");

        const parsed = errorSchema.safeParse(response.body);

        expect(parsed.success).to.be.true;
      });
  });

  it("should not be able to login with invalid password", () => {
    userService.loginUser(apiUser.email, "").then((response) => {
      expect(response.status).to.eq(422);

      expect(response.body.errors).to.contain("Senha inválida.");

      const parsed = errorSchema.safeParse(response.body);

      expect(parsed.success).to.be.true;
    });
  });
});
