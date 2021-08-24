import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { UpdateResult } from "typeorm";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";

@injectable()
export class UserController {
  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const allUsers = await container.resolve(UserService).list();

      return res.json(allUsers);
    } catch (e) {
      res.json({
        name: "Could not list",
        message: e.message,
      });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const userSaveResult = await container
        .resolve(UserService)
        .create(req.body);

      return res.json(userSaveResult);
    } catch (e) {
      res.json({
        name: e.name,
        message: e.message,
      });
    }
  }

  public async updateById(req: Request, res: Response): Promise<Response> {
    try {
      const userUpdateResult: UpdateResult = await container
        .resolve(UserService)
        .updateById(req.params.userId, req.body);
      return res.json(userUpdateResult);
    } catch (e) {
      console.log(e);
    }
  }

  public async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { userEmail } = req.params;
      const user: User = await container.resolve(UserService).getUserByEmail(userEmail);

      return res.json(user);
    } catch (e) {
      res.status(404).json({
        name: e.name,
        message: e.message,
      });
    }
  }
}
