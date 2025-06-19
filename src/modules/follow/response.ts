import { UUID } from "crypto";
import { IResponse, SuccessResponse } from "../../core";
import { UserEntry } from "../../database/models/user";
import { UserResponse } from "../user/response";

export interface FollowResponse extends IResponse {
    followerId: UUID;
    followedId: UUID;
}

export interface FollowingUserResponse extends IResponse {
    follower: UserResponse;
    followingId: UUID;
}

export interface FollowerUserResponse extends IResponse {
    followerId: UUID;
    following: UserResponse;
}


export type SingleFollowResponse = SuccessResponse<FollowResponse>;
export type MultipleFollowsResponse = SuccessResponse<FollowResponse[]>;

export type SingleFollowingUserResponse = SuccessResponse<FollowingUserResponse>;
export type MultipleFollowingUserResponse = SuccessResponse<FollowingUserResponse[]>;

export type SingleFollowerUserResponse = SuccessResponse<FollowerUserResponse>;
export type MultipleFollowerUserResponse = SuccessResponse<FollowerUserResponse[]>;
