import { UUID } from "crypto";
import { IResponse, SuccessResponse } from "../../core";

export interface UserResponse extends IResponse {
    id: UUID;
    pseudo: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
    deletedAt: string;
    profilePictureId: number;
    bannerId: number;
}

export type SingleUserResponse = SuccessResponse<UserResponse>;
export type MultipleUsersResponse = SuccessResponse<UserResponse[]>;
