import { ObjectId } from "mongodb";

export default class Usuario {
  constructor(
    public nome: string,
    public email: string,
    public id?: ObjectId,
  ) {}
}
