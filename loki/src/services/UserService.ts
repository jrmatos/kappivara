import { inject, injectable } from "tsyringe";
import * as bcrypt from "bcrypt";
import { UpdateResult } from "typeorm";
import { UserUpdateDTO } from "../dto/UserCreate";
import { User } from "../entity/User";
import DuplicateEntityError from "../errors/DuplicateEntityError";
import EntityNotFoundError from "../errors/EntityNotFoundError";
import { UserRepository } from "../repositories/UserRepository";
import { ConfigsManager } from "../configs";

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(ConfigsManager) private configsManager: ConfigsManager
  ) {
    this.userRepository = userRepository;
    this.configsManager = configsManager;
  }

  list(): Promise<User[]> {
    return this.userRepository.list();
  }

  async create(user: User): Promise<User | DuplicateEntityError> {
    const userExists: boolean = await this.userExists(user);

    if (!userExists) {
      const hashedPassword = await bcrypt.hash(
        user.password,
        this.configsManager.getSaultRounds()
      );

      user.password = hashedPassword;

      const createResult = await this.userRepository.create(user);

      delete createResult.password;

      return createResult;
    }

    throw new DuplicateEntityError("User already exists.");
  }

  updateById(userId: string, resource: UserUpdateDTO): Promise<UpdateResult> {
    return this.userRepository.updateById(parseInt(userId), resource);
  }

  async userExists(user: User): Promise<boolean> {
    const result = await this.userRepository.findOne(user);

    return Boolean(result);
  }

  async getUserByEmail(userEmail: string): Promise<User> {
    const userToFind = new User();
    userToFind.email = userEmail;

    const result = await this.userRepository.findOneWithPassword(userToFind);

    if (!result) throw new EntityNotFoundError("User does not exist.");

    return result;
  }
}
