import { UUID } from "crypto";
import { IResponse, SuccessResponse } from "../../core";

export interface FollowResponse extends IResponse {
    followerId: UUID;
    followedId: UUID;
}

export type SingleFollowResponse = SuccessResponse<FollowResponse>;
export type MultipleFollowsResponse = SuccessResponse<FollowResponse[]>;
