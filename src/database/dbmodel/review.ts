import { Pool } from "pg";
import { AEntry, ARepository } from "./ARepository";

export class ReviewRepository extends ARepository<ReviewEntry>{

    public constructor(db : Pool) {
        super(db);
    }

    ToModel(): IResponseModel {
        throw new Error("Method not implemented.");
    }
    GetAll(): ReviewEntry[] {
        throw new Error("Method not implemented.");
    }
    GetById(id: number): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    Create(entry: ReviewEntry): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    Update(entry: ReviewEntry): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    Delete(entry: ReviewEntry): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    
}

class ReviewEntry extends AEntry{
    
}