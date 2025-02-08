import { SuccessResponse, ARepository, ReviewEntry, ReviewResponse } from "../../core";

export class ReviewRepository extends ARepository<ReviewEntry, SuccessResponse<ReviewResponse>> {
    protected readonly tableName: string = "review";

}