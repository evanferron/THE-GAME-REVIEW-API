import { ARepository } from "../../base/ARepository";
import { IResponseModel } from "../../base/IResponse";
import { ReviewEntry } from "../../shared/models/db/review";

export class ReviewRepository extends ARepository<ReviewEntry> {

    ToModel(): IResponseModel {
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