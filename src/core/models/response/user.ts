import { SuccessResponse } from "../..";

export interface UserResponse {
    id: string;
    pseudo: string;
    email: string;
    isAdmin: boolean;
}

export type SingleUserResponse = SuccessResponse<UserResponse>;
export type MultipleUsersResponse = SuccessResponse<UserResponse[]>;
