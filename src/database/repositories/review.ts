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
    public async getReviewsByGame(gameId: bigint): Promise<ReviewEntry[]> {

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
    public async getReviewsByUser(userId: UUID): Promise<ReviewEntry[]> {

        const result = await this.query<ReviewEntry>(
            `SELECT * FROM reviews WHERE user_id  = $1;`,
            [userId]
        );

        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to an user
    * 
    * @param userId id to get
    * @returns all entries that are get
    */
    public async getReviewsByUserAndGame(userId: UUID, game_id: number): Promise<ReviewEntry[]> {

        const result = await this.query<ReviewEntry>(
            `SELECT * FROM reviews WHERE user_id  = $1 AND game_id = $2;`,
            [userId, game_id]
        );

        return result.rows;
    }

    /**
 * Récupère la review d'un jeu pour un utilisateur donné
 * 
 * @param userId ID de l'utilisateur
 * @param gameId ID du jeu
 * @returns La review correspondante, s’il y en a une
 */
    public async findGameReviewByUser(userId: UUID, gameId: number): Promise<ReviewEntry[] | null> {
        const result = await this.query<ReviewEntry>(
            `SELECT * FROM reviews WHERE user_id = $1 AND game_id = $2 LIMIT 1;`,
            [userId, gameId]
        );
        if (result.rowCount === 0) {
            return null;
        }
        return result.rows;
    }

}