import { UUID } from "crypto";
import { IEntry } from "../../core";

export interface ListEntry extends IEntry {
    id: UUID;
    user_id: UUID;
    name: string;
    description: string | null;
    is_private: boolean;
    created_at: Date;
}