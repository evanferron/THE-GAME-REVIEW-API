import { IResponse, SuccessResponse } from "../../core";

export interface ListResponse extends IResponse {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    isPrivate: boolean;
    createdAt: string;
}

export type SingleListResponse = SuccessResponse<ListResponse>;
export type MultipleListsResponse = SuccessResponse<ListResponse[]>;
