import { UUID } from "crypto";
import { IResponse, SuccessResponse } from "../../core";

export interface GameListResponse extends IResponse {
    gameId: bigint;
    listId: UUID;
    addedAt: string;
    name?: string;
    cover?: string;
    aggregated_rating?: number;
}

export type SingleGameListResponse = SuccessResponse<GameListResponse>;
export type MultipleGamesListsResponse = SuccessResponse<GameListResponse[]>;
