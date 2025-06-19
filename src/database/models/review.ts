import { UUID } from "crypto";
import { IEntry } from "../../core";

export interface ReviewEntry extends IEntry {
    id: UUID;
    game_id: bigint;
    user_id: UUID;
    rating: number;
    review: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface ReviewData extends ReviewEntry {
    likes: number;
    owner_pseudo: string;
    owner_picture: number;
    has_liked: boolean;
}