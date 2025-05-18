import { Router } from "express";
import { authMiddleware } from "../../core";
import { ReviewController } from "./controller";

export function createReviewRoutes(): Router {
    const router = Router();
    const reviewController = new ReviewController();

    router.post("/", authMiddleware, reviewController.createReview);
    router.get("/", reviewController.getAllReviews);
    router.get("/top", reviewController.getReviewsByPopularity);

    router.get("/:id", reviewController.getReviewById);
    router.get("/get_by_game_id", reviewController.getReviewsByGameId);
    router.get("/get_by_user_id/:id", reviewController.getReviewsByUserId);
    router.get("/:user_id&game_id", reviewController.getReviewsByUserIdAndGameId);
    router.get("/my_reviews", authMiddleware, reviewController.getMyReviews);
    router.get("/my_review_for_game/:game_id", authMiddleware, reviewController.getMyReviewForAGame);
    router.put("/", authMiddleware, reviewController.updateReview);
    router.post("/like", authMiddleware, reviewController.likeReview);
    router.delete("/", authMiddleware, reviewController.deleteReview);

    return router;
}      