import { UpdateResult } from "typeorm";

export interface CRUDRepository<T> {
  findOne: (data: T) => Promise<T | undefined>;
  list: () => Promise<T[]>;
  create: (entity: any) => Promise<T>;
  updateById: (id: number, resource: any) => Promise<UpdateResult>
}
