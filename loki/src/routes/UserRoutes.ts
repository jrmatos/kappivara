import { Router } from 'express'
import { container } from 'tsyringe';
import { UserController } from '../controllers/UserController';

const userRouter = Router()
const userController = container.resolve(UserController)

userRouter.get("/", userController.list);
userRouter.post("/", userController.create);
userRouter.put("/:userId", userController.updateById);
userRouter.get("/:userEmail", userController.getUserByEmail);

export default userRouter