import { fakerPT_BR as faker } from "@faker-js/faker";

const user = (overrides = {}) => {
  const password = faker.internet.password({ length: 5 });

  const defaultUser = {
    name: faker.person.firstName(),
    email: faker.internet.email().toLowerCase(),
    password: password,
    confirmPassword: password,
  };

  return {
    ...defaultUser,
    ...overrides,
  };
};

export default { user };
