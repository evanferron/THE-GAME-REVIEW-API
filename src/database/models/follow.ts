import { UUID } from "crypto";
import { IEntry } from "../../core";

export interface FollowEntry extends IEntry {
    follower_id: UUID;
    followed_id: UUID;
}