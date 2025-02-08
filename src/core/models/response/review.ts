import { SuccessResponse } from "../..";

export interface ReviewResponse {
    id: string;
    gameId: bigint;
    userId: string;
    rating: number;
    review: string | null;
    createdAt: string;
}

export type SingleReviewResponse = SuccessResponse<ReviewResponse>;
export type MultipleReviewsResponse = SuccessResponse<ReviewResponse[]>;
