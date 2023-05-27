import { ObjectId } from "mongodb";

export default class Equipment {
  constructor(
    public nome: string,
    public usos: number,
    public id?: ObjectId
  ) {}
}
