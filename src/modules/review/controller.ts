import { getUserFromRequest, AController, ValidationError, getResponse, SuccessResponse } from "../../core";
import { NextFunction, Request, Response } from "express";
import { ReviewEntry } from "../../database/models/review";
import { MultipleReviewsResponse, ReviewResponse, SingleReviewResponse } from "./response";
import { UUID } from "crypto";


export class ReviewController extends AController {

    public getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const foundReviews = await this.config.reviewRepository.getAllReview();

            if (foundReviews.length === 0) {
                throw new ValidationError("No follow found");
            }


            if (foundReviews.length === 0) {
                res.status(200).json(
                    {
                        success: true,
                        data: null,
                        message: "No review found"
                    } as SuccessResponse<any>
                )
            }

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
                likes: review.likes,
                createdAt: new Date(review.created_at).toISOString(),
                updatedAt: new Date(review.updated_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleReviewsResponse>({
                success: true,
                data: reviews
            }));

        } catch (err) {
            next(err);
        }
    }

    public getReviewById = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const review = {
                id: req.body.id,
            } as ReviewEntry;

            const foundReviews = await this.config.reviewRepository.getReviewsById(review.id);


            if (foundReviews.length === 0) {
                res.status(200).json(
                    {
                        success: true,
                        data: null,
                        message: "No review found"
                    } as SuccessResponse<any>
                )
            }

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
                likes: review.likes,
                createdAt: new Date(review.created_at).toISOString(),
                updatedAt: new Date(review.updated_at).toISOString(),
            }));

            res.status(201).json(getResponse<SingleReviewResponse>({
                success: true,
                data: reviews[0]
            }));

        } catch (err) {
            next(err);
        }
    }

    public getReviewsByGameId = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const review = {
                game_id: req.body.game_id,
            } as ReviewEntry;

            const foundReviews = await this.config.reviewRepository.getReviewsByGame(review.game_id);

            if (foundReviews.length === 0) {
                res.status(200).json(
                    {
                        success: true,
                        data: null,
                        message: "No review found"
                    } as SuccessResponse<any>
                )
            }

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
                likes: review.likes,
                createdAt: new Date(review.created_at).toISOString(),
                updatedAt: new Date(review.updated_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleReviewsResponse>({
                success: true,
                data: reviews
            }));

        } catch (err) {
            next(err);
        }
    }

    public getReviewsByUserId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user_id: UUID;

            if (!req.params.id || req.params.id === "") {
                throw new ValidationError('user_id is required');
            } else {
                user_id = req.params.id as UUID
            }

            const foundReviews = await this.config.reviewRepository.getReviewsByUser(user_id);


            if (foundReviews.length === 0) {
                res.status(200).json(
                    {
                        success: true,
                        data: null,
                        message: "No review found"
                    } as SuccessResponse<any>
                )
            }

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
                likes: review.likes,
                createdAt: new Date(review.created_at).toISOString(),
                updatedAt: new Date(review.updated_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleReviewsResponse>({
                success: true,
                data: reviews
            }));

        } catch (err) {
            next(err);
        }
    }

    public getReviewsByPopularity = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const foundReviews = await this.config.reviewRepository.getPopularReviews();


            if (foundReviews.length === 0) {
                res.status(200).json(
                    {
                        success: true,
                        data: null,
                        message: "No review found"
                    } as SuccessResponse<any>
                )
                return;
            }

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
                likes: review.likes,
                createdAt: new Date(review.created_at).toISOString(),
                updatedAt: new Date(review.updated_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleReviewsResponse>({
                success: true,
                data: reviews
            }));

        } catch (err) {
            next(err);
        }
    }

    public getMyReviews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = getUserFromRequest(req).userId as UUID;

            req.params.id = user_id;

            await this.getReviewsByUserId(req, res, next);
        } catch (err) {
            next(err);
        }

    }

    public getReviewsByUserIdAndGameId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user_id: UUID;

            if (!req.params.user_id || req.params.user_id === "") {
                throw new ValidationError('user_id is required');
            } else {
                user_id = req.params.user_id as UUID
            }

            let game_id: number;

            if (!req.params.game_id || isNaN(Number(req.params.game_id))) {
                throw new ValidationError('user_id is required');
            } else {
                game_id = Number(req.params.game_id)
            }

            const foundReviews = await this.config.reviewRepository.getReviewsByUserAndGame(user_id, game_id);

            if (foundReviews.length === 0) {
                res.status(200).json(
                    {
                        success: true,
                        data: null,
                        message: "No review found"
                    } as SuccessResponse<any>
                )
            }

            const review: ReviewResponse = {
                id: foundReviews[0].id,
                gameId: foundReviews[0].game_id,
                userId: foundReviews[0].user_id,
                rating: foundReviews[0].rating,
                review: foundReviews[0].review,
                likes: foundReviews[0].likes,
                createdAt: new Date(foundReviews[0].created_at).toISOString(),
                updatedAt: new Date(foundReviews[0].updated_at).toISOString(),
            };

            res.status(201).json(getResponse<SingleReviewResponse>({
                success: true,
                data: review
            }));

        } catch (err) {
            next(err);
        }
    }




    public getMyReviewForAGame = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = getUserFromRequest(req).userId as UUID;

            req.params.id = user_id;

            await this.getReviewsByUserIdAndGameId(req, res, next);
        } catch (err) {
            next(err);
        }
    }



    public createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const review = {
                game_id: req.body.game_id,
                user_id: getUserFromRequest(req).userId,
                rating: req.body.rating,
                review: req.body.review,
                created_at: new Date(),
                updated_at: new Date(),
            } as ReviewEntry;

            const createdReview = await this.config.reviewRepository.create(review);

            res.status(201).json(getResponse<ReviewResponse>({
                id: createdReview.id,
                gameId: createdReview.game_id,
                userId: createdReview.user_id,
                rating: createdReview.rating,
                review: createdReview.review,
                likes: 0,
                createdAt: new Date(createdReview.created_at).toISOString(),
                updatedAt: new Date(createdReview.updated_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }

    public updateReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const review = {
                id: req.body.id,
                rating: req.body.rating,
                review: req.body.review,
                updated_at: new Date(),
            } as ReviewEntry;

            const updatedReview = await this.config.reviewRepository.update(review.id, review);

            if (updatedReview == null) {
                throw new ValidationError("No Review found");
            }
            res.status(201).json(getResponse<ReviewResponse>({
                id: updatedReview.id,
                gameId: updatedReview.game_id,
                userId: updatedReview.user_id,
                rating: updatedReview.rating,
                review: updatedReview.review,
                likes: 0,
                createdAt: new Date(updatedReview.created_at).toISOString(),
                updatedAt: new Date(updatedReview.updated_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }

    public deleteReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const review = {
                id: req.body.id,
            } as ReviewEntry;

            // Créer un tableau pour delete
            const idsToDelete = [review.id];

            const deletedReview = await this.config.reviewRepository.deleteByIds(idsToDelete);

            if (deletedReview.length === 0) {
                throw new ValidationError("No Review found");
            }

            res.status(200).json(getResponse<ReviewResponse>({
                id: deletedReview[0].id,
                gameId: deletedReview[0].game_id,
                userId: deletedReview[0].user_id,
                rating: deletedReview[0].rating,
                review: deletedReview[0].review,
                likes: 0,
                createdAt: new Date(deletedReview[0].created_at).toISOString(),
                updatedAt: new Date(deletedReview[0].updated_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }
}