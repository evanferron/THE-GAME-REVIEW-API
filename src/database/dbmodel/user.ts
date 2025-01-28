import { Pool } from "pg";
import { AEntry, ARepository } from "./ARepository";
import { IResponseModel } from "../../pkg/model/IModels";

export class UserRepository extends ARepository<UserEntry>{

    public constructor(db : Pool) {
        super(db);
    }

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

class UserEntry extends AEntry{
    
}