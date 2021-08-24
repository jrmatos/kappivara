import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import * as swaggerUi from "swagger-ui-express";
import * as YAML from "yamljs";
import { Router } from "express";
import { injectable } from "tsyringe";
import routes from "./routes";

@injectable()
export class App {
  private expressApplication: express.Application;

  public constructor() {
    this.expressApplication = express();

    this.loadMiddlewares();
    this.loadApiRoutes();
    this.loadSwagger();
  }

  public getExpressApplication(): express.Application {
    return this.expressApplication;
  }

  public listen(port: string, callback: () => void) {
    this.expressApplication.listen(parseInt(port), callback);
  }

  private loadMiddlewares(): void {
    this.expressApplication.use(express.json());
    this.expressApplication.use(cors());
  }

  private loadSwagger() {
    const swaggerDocument = YAML.load(path.join(__dirname, "/swagger.yaml"));

    this.expressApplication.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  private loadApiRoutes() {
    const apiRouter: express.Router = this.makeApiRouter();
    this.expressApplication.use("/api", apiRouter);
  }

  private makeApiRouter(): express.Router  {
    const apiRouter = Router();

    Object.entries(routes).forEach((route) => {
      const [name, router] = route;
      apiRouter.use(name, router);
    });

    return apiRouter;
  }
}
