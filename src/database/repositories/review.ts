import { UUID } from "crypto";
import { ARepository } from "../../core";
import { ReviewEntry } from "../models/review";

export class ReviewRepository extends ARepository<ReviewEntry> {
    protected readonly tableName: string = "reviews";

    /**
    * Method that will get all the review corresponding to a game
    * 
    * @param gameId id to get
    * @returns all entries that are get
    */
    public async getReviewsByGame (gameId: bigint): Promise<ReviewEntry[]> {

        const result = await this.query<ReviewEntry>(
            `SELECT * FROM reviews WHERE game_id  = $1;`, 
            [gameId]
        );

        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to an user
    * 
    * @param userId id to get
    * @returns all entries that are get
    */
     public async getReviewsByUser (userId: UUID): Promise<ReviewEntry[]> {

        const result = await this.query<ReviewEntry>(
            `SELECT * FROM reviews WHERE user_id  = $1;`, 
            [userId]
        );

        return result.rows;
    }
}