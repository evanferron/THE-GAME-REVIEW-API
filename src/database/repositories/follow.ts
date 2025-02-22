import { UUID } from "crypto";
import { ARepository } from "../../core";
import { FollowEntry } from "../models/follow";

export class FollowRepository extends ARepository<FollowEntry> {
    protected readonly tableName: string = "follows";

    /**
    * Method that will delete all the entries corresponding to the ids
    * 
    * @param ids ids to delete
    * @returns all entries that are deleted
    */
    public async unfollow(followerId: UUID, followedId: UUID): Promise<FollowEntry[]> {

        const result = await this.query<FollowEntry>(
            `DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2 RETURNING *`,
            [followerId, followedId]
        );

        return result.rows;
    }
}