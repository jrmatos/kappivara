import { Router } from 'express'
import { container } from 'tsyringe';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router()
const authController = container.resolve(AuthController)

authRouter.post("/login", authController.login);
authRouter.post("/verify", authController.verify);

export default authRouter
