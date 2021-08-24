import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
  getConnectionOptions,
} from "typeorm";
import * as dotenv from "dotenv";
import { inject, injectable } from "tsyringe";
import { ConfigsManager } from "../configs";

dotenv.config();

@injectable()
export class TestHelper {
  constructor(@inject(ConfigsManager) private configsManager: ConfigsManager) {
    this.configsManager = configsManager;
  }

  async createTestConnection() {
    const options: ConnectionOptions = await getConnectionOptions();

    const newOptions: ConnectionOptions = Object.assign(options, {
      database: this.configsManager.getTestDatabaseName(),
    });

    return createConnection(newOptions);
  }

  setup(): Promise<Connection> {
    return this.createTestConnection();
  }

  tearDown() {
    return getConnection().close();
  }

  clearEntity(clazz: any) {
    return getConnection().getRepository(clazz).clear();
  }
}
