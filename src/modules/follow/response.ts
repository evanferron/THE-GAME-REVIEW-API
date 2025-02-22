import { IResponse, SuccessResponse } from "../../core";

export interface ReviewResponse extends IResponse {
    followerId: bigint;
    followedId: bigint;
}

export type SingleReviewResponse = SuccessResponse<ReviewResponse>;
export type MultipleReviewsResponse = SuccessResponse<ReviewResponse[]>;
