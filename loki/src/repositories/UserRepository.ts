import { injectable } from "tsyringe";
import { getRepository, Repository, UpdateResult } from "typeorm";
import { User } from "../entity/User";
import { CRUDRepository } from "../interfaces/CrudRepository";

@injectable()
export class UserRepository implements CRUDRepository<User> {
  private userRepositoryORM: Repository<User> = getRepository(User);

  public findOne({ email }: User): Promise<User | undefined> {
    return this.userRepositoryORM.findOne({ where: { email } });
  }

  public findOneWithPassword({ email }: User): Promise<User | undefined> {
    return this.userRepositoryORM.findOne({ where: { email }, select: ['id', 'email', 'password'] });
  }

  public list(): Promise<User[]> {
    return this.userRepositoryORM.find();
  }

  public create(entity: User): Promise<User> {
    return this.userRepositoryORM.save(entity);
  }

  public updateById(id: number, resource: any): Promise<UpdateResult> {
    return this.userRepositoryORM.update(id, resource);
  }
}
