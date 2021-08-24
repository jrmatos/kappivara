import "reflect-metadata";
import * as request from "supertest";
import * as jwt from "jsonwebtoken";
import { container } from "tsyringe";
import { App } from "../src/app";
import { AuthService } from "../src/services/AuthService";
import UserNotFoundError from "../src/errors/UserNotFoundError";


describe("/auth", () => {
  test("Authenticate user", async () => {
    const authService = container.resolve(AuthService);
    
    const userLoginDTO = {
      email: "lucas.silva@gmail.com",
      password: "manaus123"
    };

    const mockedUser = {
      id: 1,
      email: "lucas.silva@gmail.com",
      password: "$2b$06$bXy5ENF2m6RnrID/eTNe8.ICzaSPe1bvIE.tOwzJzKJJRNxmqCu7i"
    }

    // mock fetch external service call
    authService.fetchUser = jest.fn().mockReturnValue(mockedUser); 

    const result = await authService.login(userLoginDTO);

    expect(typeof result).toBe('string');
    expect(result.split('.').length).toBe(3);
  });

  test("Authenticate not existing user", async () => {
    const authService = container.resolve(AuthService);
    
    const userLoginDTO = {
      email: "lucas.silva@gmail.com",
      password: "manaus123"
    };

    const mockedUser = null;

    // mock fetch external service call
    authService.fetchUser = jest.fn().mockReturnValue(mockedUser); 

    try {
      await authService.login(userLoginDTO)
    } catch (e) {
      expect(e.message).toBe("User not found.");
    }
  });

  test("Authenticate user with wrong password", async () => {
    const authService = container.resolve(AuthService);
    
    const userLoginDTO = {
      email: "lucas.silva@gmail.com",
      password: "wrong_password"
    };

    const mockedUser = {
      id: 1,
      email: "lucas.silva@gmail.com",
      password: "$2b$06$bXy5ENF2m6RnrID/eTNe8.ICzaSPe1bvIE.tOwzJzKJJRNxmqCu7i"
    }

    // mock fetch external service call
    authService.fetchUser = jest.fn().mockReturnValue(mockedUser); 

    try {
      await authService.login(userLoginDTO)
    } catch (e) {
      expect(e.message).toBe("Wrong password.");
    }
  });

  test("JWT payload should contain id and email", async () => {
    const authService = container.resolve(AuthService);
    
    const userLoginDTO = {
      email: "lucas.silva@gmail.com",
      password: "manaus123"
    };

    const mockedUser = {
      id: 1,
      email: "lucas.silva@gmail.com",
      password: "$2b$06$bXy5ENF2m6RnrID/eTNe8.ICzaSPe1bvIE.tOwzJzKJJRNxmqCu7i"
    }

    // mock fetch external service call
    authService.fetchUser = jest.fn().mockReturnValue(mockedUser); 

    const result = await authService.login(userLoginDTO);
    const { id, email }: any = jwt.decode(result);

    expect(id).toBe(1);
    expect(email).toBe("lucas.silva@gmail.com");
  });

  test("Validate valid JWT", async () => {
    const authService = container.resolve(AuthService);

    const jwtPayload = {
      id: 1,
      email: "lucas.silva@gmail.com",
      password: ''
    }

    const generatedJWT = authService.generateJWT(jwtPayload);
    expect(generatedJWT).not.toBeNull();

    const isValid = await authService.verify(generatedJWT);

    expect(isValid).toBe(true);
  });

  test("Validate invalid JWT", async () => {
    const authService = container.resolve(AuthService);
    const invalidJWT = "$2b$06$bXy5ENF2m6RnrID/eTNe8.ICzaSPe1bvIE.blablablabla";

    const isValid = authService.verify(invalidJWT);

    expect(isValid).toBe(false);
  });
});
