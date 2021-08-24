import * as dotenv from "dotenv";
import { injectable } from "tsyringe";

dotenv.config();

@injectable()
export class ConfigsManager {
  private APPLICATION_PORT = process.env.APPLICATION_PORT;
  private TEST_DATABASE_NAME = process.env.TEST_DATABASE_NAME;
  private JWT_SECRET = process.env.JWT_SECRET;
  private JWT_EXPIRATION = process.env.JWT_EXPIRATION;
  private LOKI_GET_USER_BY_EMAIL_URL = process.env.LOKI_GET_USER_BY_EMAIL_URL;

  isTest() {
    return !!process.env.TESTING
  }

  getApplicationPort() {
    return this.APPLICATION_PORT;
  }

  getTestDatabaseName() {
    return this.TEST_DATABASE_NAME;
  }

  getJwtSecret() {
    return this.JWT_SECRET;
  }
  
  getJwtExpiration() {
    return this.JWT_EXPIRATION;
  }
  
  getLokiGetUserByEmailUrl(): string {
    return this.LOKI_GET_USER_BY_EMAIL_URL;
  }
}
