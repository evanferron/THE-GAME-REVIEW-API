export interface SuccessResponse<T extends IResponse> {
    success: true;
    data: T;
    message?: string;
};

export interface ErrorResponse {
    success: false;
    error: string;
};

export interface IResponse {
}