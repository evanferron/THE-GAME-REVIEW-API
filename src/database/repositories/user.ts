import { ARepository } from "../../core";
import { UserEntry } from "../models/user";

export class UserRepository extends ARepository<UserEntry> {
    protected readonly tableName: string = "users";

}
