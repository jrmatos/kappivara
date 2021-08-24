import * as dotenv from "dotenv";
import { injectable } from "tsyringe";

dotenv.config();

@injectable()
export class ConfigsManager {
  private APPLICATION_PORT = process.env.APPLICATION_PORT;
  private TEST_DATABASE_NAME = process.env.TEST_DATABASE_NAME;
  private SALT_ROUNDS = process.env.SALT_ROUNDS;

  isTest() {
    return !!process.env.TESTING
  }

  getApplicationPort() {
    return this.APPLICATION_PORT;
  }

  getTestDatabaseName() {
    return this.TEST_DATABASE_NAME;
  }

  getSaultRounds() {
    return parseInt(this.SALT_ROUNDS, 10);
  }
}
