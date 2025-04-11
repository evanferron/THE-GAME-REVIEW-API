import { Config, getUserFromRequest, AController, ValidationError, getResponse } from "../../core";
import { NextFunction, Request, Response } from "express";
import { ReviewEntry } from "../../database/models/review";
import { MultipleReviewsResponse, ReviewResponse, SingleReviewResponse } from "./response";


export class ReviewController extends AController {

    public getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
        try {
           
            const foundReviews = await this.config.reviewRepository.getAll();

            if (foundReviews.length === 0) {
                throw new ValidationError("No follow found");
            }

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
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

            const foundReviews = await this.config.reviewRepository.findByColumn("id", review.id);

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
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

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
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
           
            const review = {
                user_id: req.body.user_id,
            } as ReviewEntry;

            const foundReviews = await this.config.reviewRepository.getReviewsByUser(review.user_id);

            const reviews: ReviewResponse[] = foundReviews.map(review => ({
                id: review.id,
                gameId: review.game_id,
                userId: review.user_id,
                rating: review.rating,
                review: review.review,
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
                throw new ValidationError("No follow found");
            }

            res.status(200).json(getResponse<ReviewResponse>({
                id: deletedReview[0].id,
                gameId: deletedReview[0].game_id,
                userId: deletedReview[0].user_id,
                rating: deletedReview[0].rating,
                review: deletedReview[0].review,
                createdAt: new Date(deletedReview[0].created_at).toISOString(),
                updatedAt: new Date(deletedReview[0].updated_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }
}