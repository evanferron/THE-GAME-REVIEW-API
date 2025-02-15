import { IResponse, SuccessResponse } from "../";

export function getResponse<DataResponse extends IResponse>(data: DataResponse, message = ""): SuccessResponse<DataResponse> {
    return {
        success: true,
        data,
        message,
    };
}