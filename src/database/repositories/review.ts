import { UUID } from "crypto";
import { ARepository } from "../../core";
import { ReviewData, ReviewEntry } from "../models/review";

export class ReviewRepository extends ARepository<ReviewEntry> {
    protected readonly tableName: string = "reviews";

    private readonly DEFAULT_SELECT: string = `
            SELECT r.*, COUNT(rl.review_id) as like_count, u.pseudo as owner_pseudo, u.profil_picture_id as owner_picture 
            FROM reviews r
            LEFT JOIN reviews_likes rl ON r.id = rl.review_id
            Left JOIN users u ON r.user_id = u.id`

    /**
    * Method that will get all the review corresponding to a game
    * 
    * @param gameId id to get
    * @returns all entries that are get
    */
    public async getAllReview(loggedUser?: UUID): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `${this.DEFAULT_SELECT}
             GROUP BY r.id, u.pseudo, u.profil_picture_id;`
        );
        if (loggedUser)
            await this.currentUserHasLikedReview(result.rows, loggedUser);
        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to a game
    * 
    * @param gameId id to get
    * @returns all entries that are get
    */
    public async getReviewsByGame(gameId: bigint, loggedUser?: UUID): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `${this.DEFAULT_SELECT}
             WHERE r.game_id = $1
             GROUP BY r.id, u.pseudo, u.profil_picture_id;`,
            [gameId]
        );
        if (loggedUser)
            await this.currentUserHasLikedReview(result.rows, loggedUser);
        return result.rows;
    }

    /**
* Method that will get all the review corresponding to an user
* 
* @param id id to get
* @returns all entries that are get
*/
    public async getReviewsById(id: UUID, loggedUser?: UUID): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `${this.DEFAULT_SELECT}
             WHERE r.id = $1
             GROUP BY r.id, u.pseudo, u.profil_picture_id;`,
            [id]
        );
        if (loggedUser)
            await this.currentUserHasLikedReview(result.rows, loggedUser);
        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to an user
    * 
    * @param userId id to get
    * @returns all entries that are get
    */
    public async getReviewsByUser(userId: UUID, loggedUser?: UUID): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `${this.DEFAULT_SELECT}
             WHERE r.user_id = $1
             GROUP BY r.id, u.pseudo, u.profil_picture_id;`,
            [userId]
        );
        if (loggedUser)
            await this.currentUserHasLikedReview(result.rows, loggedUser);
        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to an user
    * 
    * @param userId id to get
    * @returns all entries that are get
    */
    public async getReviewsByUserAndGame(userId: UUID, game_id: number, loggedUser?: UUID): Promise<ReviewData[]> {
        const result = await this.query<ReviewData>(
            `${this.DEFAULT_SELECT}
             WHERE r.user_id = $1 AND r.game_id = $2
             GROUP BY r.id, u.pseudo, u.profil_picture_id;`,
            [userId, game_id]
        );
        if (loggedUser)
            await this.currentUserHasLikedReview(result.rows, loggedUser);
        return result.rows;
    }

    /**
 * Récupère la review d'un jeu pour un utilisateur donné
 * 
 * @param userId ID de l'utilisateur
 * @param gameId ID du jeu
 * @returns La review correspondante, s’il y en a une
 */
    public async findGameReviewByUser(userId: UUID, gameId: number, loggedUser?: UUID): Promise<ReviewData | null> {
        const result = await this.query<ReviewData>(
            `${this.DEFAULT_SELECT}
             WHERE r.user_id = $1 AND r.game_id = $2
             GROUP BY r.id , u.pseudo, u.profil_picture_id
             LIMIT 1;`,
            [userId, gameId]
        );

        if (result.rowCount === 0) {
            return null;
        }

        if (loggedUser) {
            await this.currentUserHasLikedReview(result.rows, loggedUser);
        }

        return result.rows[0];
    }


    public async getPopularReviews(userId?: UUID): Promise<ReviewData[]> {
        const baseQuery = `
            ${this.DEFAULT_SELECT}
            GROUP BY r.id, u.pseudo, u.profil_picture_id
            ORDER BY like_count DESC
            LIMIT 10;
        `;

        const result = await this.query<ReviewData>(baseQuery);

        if (userId) {
            await this.currentUserHasLikedReview(result.rows, userId);
        }

        return result.rows;
    }

    public async handleLikeReview(reviewId: UUID, userId: UUID): Promise<void> {
        const check = await this.query(
            `SELECT 1 FROM reviews_likes WHERE review_id = $1 AND user_id = $2;`,
            [reviewId, userId]
        );

        if ((check.rowCount ?? 0) > 0) {
            console.log("User already liked this review, removing like.");
            await this.query(
                `DELETE FROM reviews_likes WHERE review_id = $1 AND user_id = $2;`,
                [reviewId, userId]
            );
        } else {
            console.log("User has not liked this review, adding like.");
            await this.query(
                `INSERT INTO reviews_likes (review_id, user_id) VALUES ($1, $2);`,
                [reviewId, userId]
            );
        }
    }

    private async currentUserHasLikedReview(reviews: ReviewData[], userId: UUID): Promise<void> {
        if (reviews.length === 0) return;

        const reviewIds = reviews.map(r => r.id);
        const placeholders = reviewIds.map((_, i) => `$${i + 2}`).join(", ");
        const query = `
            SELECT review_id FROM reviews_likes
            WHERE user_id = $1 AND review_id IN (${placeholders});
        `;
        const result = await this.query<{ review_id: UUID }>(
            query,
            [userId, ...reviewIds]
        );
        for (const review of reviews) {
            review.has_liked = result.rows.filter(r => r.review_id === review.id).length > 0
        }
    }

    //  public async handleLikeReview(reviewId: UUID, userId: UUID): Promise<void> {
    //     const result = await this.query(
    //         `INSERT INTO reviews_likes (review_id, user_id) VALUES ($1, $2)
    //          ON CONFLICT (review_id, user_id) DO NOTHING;`,
    //         [reviewId, userId]
    //     );

    //     if (result.rowCount === 0) {
    //         await this.query(
    //             `DELETE FROM reviews_likes WHERE review_id = $1 AND user_id = $2;`,
    //             [reviewId, userId]
    //         );
    //     }
    // }


}