import { UUID } from "crypto";
import { IEntry } from "../../";

export interface ReviewEntry extends IEntry {
    id: UUID;
    game_id: bigint;
    user_id: UUID;
    rating: number;
    review: string | null;
    created_at: Date;
}