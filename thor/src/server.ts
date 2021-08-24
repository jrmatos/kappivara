import "reflect-metadata";
import { container } from "tsyringe";
import { App } from "./app";
import { ConfigsManager } from "./configs";

const app = container.resolve(App);
const configsManager = container.resolve(ConfigsManager);
const applicationPort = configsManager.getApplicationPort();

app.listen(applicationPort, () => {
  console.log("Running at", applicationPort);
});
