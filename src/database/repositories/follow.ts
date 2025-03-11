import { UUID } from "crypto";
import { ARepository } from "../../core";
import { FollowEntry } from "../models/follow";
import { UserEntry } from "../models/user";

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

    /**
    * Method that will get all the user corresponding to the ids
    * 
    * @param ids ids to get
    * @returns all entries that are get
    */
    public async getFollowers (id: UUID): Promise<UserEntry[]> {

        const result = await this.query<UserEntry>(
            `SELECT * FROM users WHERE id IN (
                SELECT id FROM follows WHERE follower_id = $1
            );`, 
            [id]
        );

        return result.rows;
    }

    /**
    * Method that will get all the user corresponding to the ids
    * 
    * @param ids ids to get
    * @returns all entries that are get
    */
    public async getFollowing (id: UUID): Promise<UserEntry[]> {

        const result = await this.query<UserEntry>(
            `SELECT * FROM users WHERE id IN (
                SELECT id FROM follows WHERE followed_id = $1
            );`, 
            [id]
        );

        return result.rows;
    }
}