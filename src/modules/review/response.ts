import { IResponse, SuccessResponse } from "../../core";

export interface ReviewResponse extends IResponse {
    id: string;
    gameId: bigint;
    userId: string;
    owner_pseudo: string;
    owner_picture: number;
    rating: number;
    review: string | null;
    likes: number;
    createdAt: string;
    updatedAt: string;
    has_liked: boolean | null;
}

export type SingleReviewResponse = SuccessResponse<ReviewResponse>;
export type MultipleReviewsResponse = SuccessResponse<ReviewResponse[]>;
