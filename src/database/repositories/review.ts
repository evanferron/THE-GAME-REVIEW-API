import { ARepository } from "../../core";
import { ReviewEntry } from "../models/review";

export class ReviewRepository extends ARepository<ReviewEntry> {
    protected readonly tableName: string = "review";

}