import "reflect-metadata";
import * as request from "supertest";
import { container } from "tsyringe";
import { App } from "../src/app";
import { User } from "../src/entity/User";
import { TestHelper } from "../src/utils/tests";


describe("/users", () => {
  const testHelper = container.resolve(TestHelper);

  beforeAll(() => {
    return testHelper.setup();
  });

  afterAll(() => {
    return testHelper.tearDown();
  });

  afterEach(() => {
    return testHelper.clearEntity(User);
  });

  test("List all users empty", async () => {
    const expressApp = container.resolve(App).getExpressApplication();

    const response = await request(expressApp).get("/api/users");

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);
    expect(body.length).toBe(0);
  });

  test("Insert and list users", async () => {
    const expressApp = container.resolve(App).getExpressApplication();

    const insertResponse = await request(expressApp).post("/api/users").send({
      firstName: "Paulo",
      lastName: "Matos",
      email: "paulojomatos@gmail.com",
      password: "hello123",
    });

    expect(insertResponse.statusCode).toBe(200);
    expect(insertResponse.body.firstName).toBe("Paulo");
    expect(insertResponse.body.lastName).toBe("Matos");
    expect(insertResponse.body.email).toBe("paulojomatos@gmail.com");
    expect(insertResponse.body.password).toBeUndefined();

    const listResponse = await request(expressApp).get("/api/users");
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.length).toBe(1);

    const insertedUser = listResponse.body[0];
    expect(insertedUser.firstName).toBe("Paulo");
    expect(insertedUser.lastName).toBe("Matos");
    expect(insertedUser.email).toBe("paulojomatos@gmail.com");
    expect(insertedUser.password).toBeUndefined();
  });

  test("Insert duplicate user", async () => {
    const expressApp = container.resolve(App).getExpressApplication();

    await request(expressApp).post("/api/users").send({
      firstName: "Paulo",
      lastName: "Matos",
      email: "paulojomatos@gmail.com",
      password: "hello123",
    });

    const insertResponse = await request(expressApp).post("/api/users").send({
      firstName: "Paulo",
      lastName: "Matos",
      email: "paulojomatos@gmail.com",
      password: "hello123",
    });

    expect(insertResponse.body.name).toBe("DuplicateEntityError");
    expect(insertResponse.body.message).toBe("User already exists.");
  });

  test("Update a user", async () => {
    const expressApp = container.resolve(App).getExpressApplication();

    const insertedUserResponse = await request(expressApp)
      .post("/api/users")
      .send({
        firstName: "Paulo",
        lastName: "Matos",
        email: "paulojomatos@gmail.com",
        password: "hello123",
      });

    await request(expressApp)
      .put(`/api/users/${insertedUserResponse.body.id}`)
      .send({
        lastName: "Oliveira",
      });

    const response = await request(expressApp).get("/api/users");

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);
    expect(body.length).toBe(1);
    expect(body[0].firstName).toBe("Paulo");
    expect(body[0].lastName).toBe("Oliveira");
    expect(body[0].email).toBe("paulojomatos@gmail.com");
    expect(body[0].password).toBeUndefined();
  });

  test("List non existent user", async () => {
    const expressApp = container.resolve(App).getExpressApplication();

    const response = await request(expressApp).get("/api/users/paulojomatos@gmail.com");

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    expect(body.name).toBe("EntityNotFoundError");
    expect(body.message).toBe("User does not exist.");
  });

  test("List existent user", async () => {
    const expressApp = container.resolve(App).getExpressApplication();

    await request(expressApp).post("/api/users").send({
      firstName: "Paulo",
      lastName: "Matos",
      email: "paulojomatos@gmail.com",
      password: "hello123",
    });

    const response = await request(expressApp).get("/api/users/paulojomatos@gmail.com");

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body.id).toBe(1);
    expect(body.email).toBe("paulojomatos@gmail.com");
    expect(body.password).not.toBeUndefined();
  });
});
