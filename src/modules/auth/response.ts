import { IResponse, SuccessResponse } from "../../core";

export interface AuthResponse extends IResponse {
    pseudo: string;
    token: string;
}

export type SuccessAuthResponse = SuccessResponse<AuthResponse>;
