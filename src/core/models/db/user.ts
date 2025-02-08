import { UUID } from "crypto";
import { IEntry } from "../../";

export interface UserEntry extends IEntry {
    id: UUID
    pseudo: string;
    email: string;
    password: string;
    isAdmin: boolean;
}