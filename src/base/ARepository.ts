import { Pool } from "pg";
import { IResponseModel } from "../shared/models/IModels";

export abstract class ARepository<MyEntry extends AEntry> {
    protected db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    abstract ToModel(): IResponseModel;

    // CRUD operations
    abstract GetAll(): MyEntry[];
    abstract GetById(id: number): MyEntry;
    abstract Create(entry: MyEntry): MyEntry;
    abstract Update(entry: MyEntry): MyEntry;
    abstract Delete(entry: MyEntry): MyEntry;

}

export abstract class AEntry {
}