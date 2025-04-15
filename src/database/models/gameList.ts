import { UUID } from "crypto";
import { IEntry } from "../../core";

export interface GameListEntry extends IEntry {
    game_id: bigint;
    list_id: UUID;
    added_at: Date;
}