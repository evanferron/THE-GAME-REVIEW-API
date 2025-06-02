import { IResponse, SuccessResponse } from "../../core";

export interface AuthResponse extends IResponse {
    pseudo: string;
    token: string;
    refreshToken: string;
    profile_picture_id: number | null;
}

export type SuccessAuthResponse = SuccessResponse<AuthResponse>;
