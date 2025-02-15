import { IResponse, SuccessResponse } from "../base/BaseResponse";

export function getResponse<DataResponse extends IResponse>(data: DataResponse, message = ""): SuccessResponse<DataResponse> {
    return {
        success: true,
        data,
        message,
    };
}