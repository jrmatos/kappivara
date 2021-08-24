import "reflect-metadata";
import { container } from "tsyringe";
import { createConnection } from "typeorm";
import { App } from "./app";
import { ConfigsManager } from "./configs";

createConnection()
  .then(() => {
    const app = container.resolve(App);
    const configsManager = container.resolve(ConfigsManager);
    const applicationPort = configsManager.getApplicationPort();

    app.listen(applicationPort, () => {
      console.log("Running at", applicationPort);
    });
  })
  .catch((error) => console.log(error));
