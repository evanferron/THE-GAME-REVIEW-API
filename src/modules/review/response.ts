import { IResponse, SuccessResponse } from "../../core";

export interface ReviewResponse extends IResponse {
    id: string;
    gameId: bigint;
    userId: string;
    rating: number;
    review: string | null;
    createdAt: string;
}

export type SingleReviewResponse = SuccessResponse<ReviewResponse>;
export type MultipleReviewsResponse = SuccessResponse<ReviewResponse[]>;
