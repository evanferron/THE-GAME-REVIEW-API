import { IResponse, SuccessResponse } from "../../core";

export interface GameDetailsResponse extends IResponse {
    id: string;
    name: string;
    aggregated_rating: number;
    genres: string[];
    platforms: string[];
    summary: string;
    cover_url: string;
    franchises: string[];
    first_release_date: Date;
    involved_companies: string[];
    userRate?: number;
}

export interface GamePreview {
    id: number;
    name: string;
    cover: { url: string };
    aggregated_rating: number;
}

export type SingleGameDetailResponse = SuccessResponse<GameDetailsResponse>;
export type GamesPreviewResponse = SuccessResponse<GamePreview[]>;
