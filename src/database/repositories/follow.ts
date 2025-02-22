import { ARepository } from "../../core";
import { FollowEntry } from "../models/follow";

export class FollowRepository extends ARepository<FollowEntry> {
    protected readonly tableName: string = "follows";

}