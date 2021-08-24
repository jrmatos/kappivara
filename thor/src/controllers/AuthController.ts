import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { AuthService } from "../services/AuthService";

@injectable()
export class AuthController {
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const jwt: string = await container.resolve(AuthService).login(req.body);

      return res.json({ jwt });
    } catch (e) {
      res.status(401).json({
        details: e.name,
        message: e.message,
      });
    }
  }

  public async verify(req: Request, res: Response): Promise<Response> {
    try {
      const isValid: boolean = container.resolve(AuthService).verify(req.body.jwt);

      return res.json({ isValid });
    } catch (e) {
      res.status(401).json({
        details: "UnknownError",
        message: "Could not verify JWT.",
      });
    }
  }
}
