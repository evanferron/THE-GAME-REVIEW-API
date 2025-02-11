import { IResponse, SuccessResponse } from "../../core";

export interface UserResponse extends IResponse {
    id: string;
    pseudo: string;
    email: string;
    isAdmin: boolean;
}

export type SingleUserResponse = SuccessResponse<UserResponse>;
export type MultipleUsersResponse = SuccessResponse<UserResponse[]>;
