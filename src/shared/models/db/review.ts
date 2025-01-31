import { UUID } from "crypto";
import { IEntry } from "../../../base";

export interface ReviewEntry extends IEntry {
    game_id: number;
    user_id: UUID;
    rating: number;
    review: string | null;
}