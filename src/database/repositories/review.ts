import { Pool } from "pg";
import { SuccessResponse } from "../../base";
import { ARepository } from "../../base/ARepository";
import { ReviewEntry } from "../../shared/models/db/review";
import { ReviewResponse } from "../../shared/models/response/review";

export class ReviewRepository extends ARepository<ReviewEntry, SuccessResponse<ReviewResponse>> {
    protected readonly tableName: string = "review";

    toModel(entry: ReviewEntry): SuccessResponse<ReviewResponse> {
        return {
            success: true,
            data: {
                id: entry.id,
                gameId: entry.game_id,
                userId: entry.user_id,
                rating: entry.rating,
                review: entry.review,
                createdAt: entry.created_at.getTime().toString(),
            }
        }
    }

}