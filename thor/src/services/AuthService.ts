import { inject, injectable } from "tsyringe";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import fetch from "node-fetch";
import AuthenticationError from "../errors/AuthenticationError";
import UserNotFoundError from "../errors/UserNotFoundError";
import { ConfigsManager } from "../configs";
import { UserLoginDTO } from "../dto/userLoginDTO";
import { UserDTO } from "../dto/userDTO";

@injectable()
export class AuthService {
  constructor(@inject(ConfigsManager) private configsManager: ConfigsManager
  ) {}

  public async login(userLoginData: UserLoginDTO): Promise<string> {
    const user: UserDTO = await this.findUser(userLoginData);
    
    await this.comparePasswords(userLoginData.password, user.password);

    return this.generateJWT(user);
  }

  public verify(jwtToVerify: string): boolean {
    try {
      return !!jwt.verify(jwtToVerify, this.configsManager.getJwtSecret());
    } catch (e) {
      return false;
    }
  }

  public async findUser(userLoginData: UserLoginDTO): Promise<UserDTO> {
    const findUserUrl = this.makeFindUserUrl(userLoginData.email);
    const user = await this.fetchUser(findUserUrl);

    if (!user) throw new UserNotFoundError("User not found.")

    return user;
  }

  public async fetchUser(findUserUrl: string): Promise<UserDTO> {
    const response = await fetch(findUserUrl);
    if (response.status === 404) return null;
    const user = await response.json();

    return user;
  }

  public makeFindUserUrl(email: string): string {
    return `${this.configsManager.getLokiGetUserByEmailUrl()}/${email}`;
  }

  public async comparePasswords(decrypted: string, encrypted: string): Promise<void> {
    const isIdenticalPasswords = await bcrypt.compare(decrypted, encrypted);

    if (!isIdenticalPasswords) throw new AuthenticationError("Wrong password.");
  }

  public generateJWT({ id, email }: UserDTO): string {
    return jwt.sign({
      id, email
    },
    this.configsManager.getJwtSecret(),
    {
      expiresIn: this.configsManager.getJwtExpiration()
    });
  }
}
