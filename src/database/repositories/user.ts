import { ARepository } from "../../base/ARepository";
import { UserEntry } from "../../shared/models/db/user";
import { IResponseModel } from "../../base/IResponse";
export class UserRepository extends ARepository<UserEntry> {

    ToModel(): IResponseModel {
        throw new Error("Method not implemented.");
    }
    GetAll(): UserEntry[] {
        throw new Error("Method not implemented.");
    }
    GetById(id: number): UserEntry {
        throw new Error("Method not implemented.");
    }
    Create(entry: UserEntry): UserEntry {
        throw new Error("Method not implemented.");
    }
    Update(entry: UserEntry): UserEntry {
        throw new Error("Method not implemented.");
    }
    Delete(entry: UserEntry): UserEntry {
        throw new Error("Method not implemented.");
    }

}
