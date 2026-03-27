import generators from "../fixtures/generators";
import { errorSchema, registerSuccessSchema } from "../fixtures/schemas";
import { UserService } from "../services/user.service";

const userService = new UserService();

describe("CRUD API", () => {
  // before(() => {
  //   const authToken = cy.authToken();
  //   console.log(authToken);
  // });

  it("should be able to create user with all properties", () => {
    const payload = generators.user();
    
    userService.createUser(payload).then((response) => {
      expect(response.status).to.eq(201);
    
      const parsed = registerSuccessSchema.safeParse(response.body);
      expect(parsed.success).to.be.true;
    });
  });

  it("should not be able to create user with invalid email", () => {
    const payload = generators.user({ email: "invalidEmail.com" });

    userService.createUser(payload).then((response) => {
      expect(response.status).to.eq(422);
      expect(response.body.errors).to.contain("Insira um e-mail válido!");

      const parsed = errorSchema.safeParse(response.body);
      expect(parsed.success).to.be.true;
    });
  });

  it("should not be able to create user with invalid password", () => {
    const payload = generators.user({ password: 123 });

    userService.createUser(payload).then((response) => {
      expect(response.status).to.eq(422);

      expect(response.body.errors).to.contain(
        "A senha precisa ter no mínimo 5 caracteres!",
      );

      const parsed = errorSchema.safeParse(response.body);
      expect(parsed.success).to.be.true;
    });
  });

  it("should not be able to create user without confirming password", () => {
    const payload = generators.user({ confirmPassword: null });

    userService.createUser(payload).then((response) => {
      expect(response.status).to.eq(422);
      expect(response.body.errors).to.contain(
        "A confirmação de senha é obrigatória!",
      );
      expect(response.body.errors).to.contain("As senhas devem ser iguais");

      const parsed = errorSchema.safeParse(response.body);
      expect(parsed.success).to.be.true;
    });
  });

  it("should not be able to create user with different passwords", () => {
    const payload = generators.user({
      password: 12345,
      confirmPassword: 223344,
    });

    userService.createUser(payload).then((response) => {
      expect(response.status).to.eq(422);

      expect(response.body.errors).to.contain("As senhas devem ser iguais");

      const parsed = errorSchema.safeParse(response.body);
      expect(parsed.success).to.be.true;
    });
  });
});
