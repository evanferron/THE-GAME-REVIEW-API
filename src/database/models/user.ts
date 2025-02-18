import { UUID } from "crypto";
import { IEntry } from "../../core";

export interface UserEntry extends IEntry {
    id: UUID
    pseudo: string;
    email: string;
    password: string;
    is_admin: boolean;
}