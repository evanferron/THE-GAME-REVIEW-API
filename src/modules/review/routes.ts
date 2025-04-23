import { Router } from "express";
import { authMiddleware } from "../../core";
import { ReviewController } from "./controller";

export function createReviewRoutes(): Router {
    const router = Router();
    const reviewController = new ReviewController();

    router.post("/", authMiddleware, reviewController.createReview);
    router.get("/", reviewController.getAllReviews);
    router.get("/get_by_id", reviewController.getReviewById);
    router.get("/get_by_game_id", reviewController.getReviewsByGameId);
    router.get("/get_by_user_id/:id", reviewController.getReviewsByUserId);
    router.get("/get_by_user_id_and_game_id/:user_id&game_id", reviewController.getReviewsByUserId);
    router.put("/", authMiddleware, reviewController.updateReview);
    router.delete("/", authMiddleware, reviewController.deleteReview);

    return router;
}      