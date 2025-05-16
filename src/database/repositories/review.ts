import { UUID } from "crypto";
import { ARepository } from "../../core";
import { ReviewData, ReviewEntry } from "../models/review";

export class ReviewRepository extends ARepository<ReviewEntry> {
    protected readonly tableName: string = "reviews";

    /**
    * Method that will get all the review corresponding to a game
    * 
    * @param gameId id to get
    * @returns all entries that are get
    */
    public async getAllReview(): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `SELECT r.*, COUNT(rl.review_id) as like_count
             FROM reviews r
             LEFT JOIN reviews_likes rl ON r.id = rl.review_id
             GROUP BY r.id;`
        );

        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to a game
    * 
    * @param gameId id to get
    * @returns all entries that are get
    */
    public async getReviewsByGame(gameId: bigint): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `SELECT r.*, COUNT(rl.review_id) as like_count
             FROM reviews r
             LEFT JOIN reviews_likes rl ON r.id = rl.review_id
             WHERE r.game_id = $1
             GROUP BY r.id;`,
            [gameId]
        );

        return result.rows;
    }

    /**
* Method that will get all the review corresponding to an user
* 
* @param id id to get
* @returns all entries that are get
*/
    public async getReviewsById(id: UUID): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `SELECT r.*, COUNT(rl.review_id) as like_count
             FROM reviews r
             LEFT JOIN reviews_likes rl ON r.id = rl.review_id
             WHERE r.id = $1
             GROUP BY r.id;`,
            [id]
        );

        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to an user
    * 
    * @param userId id to get
    * @returns all entries that are get
    */
    public async getReviewsByUser(userId: UUID): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `SELECT r.*, COUNT(rl.review_id) as like_count
             FROM reviews r
             LEFT JOIN reviews_likes rl ON r.id = rl.review_id
             WHERE r.user_id = $1
             GROUP BY r.id;`,
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
    public async getReviewsByUserAndGame(userId: UUID, game_id: number): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `SELECT r.*, COUNT(rl.review_id) as like_count
             FROM reviews r
             LEFT JOIN reviews_likes rl ON r.id = rl.review_id
             WHERE r.user_id = $1 AND r.game_id = $2
             GROUP BY r.id;`,
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
    public async findGameReviewByUser(userId: UUID, gameId: number): Promise<ReviewData | null> {
        const result = await this.query<ReviewData>(
            `SELECT r.*, COUNT(rl.review_id) as like_count
             FROM reviews r
             LEFT JOIN reviews_likes rl ON r.id = rl.review_id
             WHERE r.user_id = $1 AND r.game_id = $2
             GROUP BY r.id
             LIMIT 1;`,
            [userId, gameId]
        );

        if (result.rowCount === 0) {
            return null;
        }
        return result.rows[0];
    }


    public async getPopularReviews(): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `SELECT r.id, r.game_id, r.user_id, r.rating, r.review, r.created_at, r.updated_at, COUNT(rl.review_id) as like_count
         FROM reviews r
         LEFT JOIN reviews_likes rl ON r.id = rl.review_id
         GROUP BY r.id
         ORDER BY like_count DESC
         LIMIT 10;`
        );

        return result.rows;
    }
}