import { Router } from "express";
import { authMiddleware, getUserIfLogged } from "../../core";
import { ReviewController } from "./controller";

export function createReviewRoutes(): Router {
    const router = Router();
    const reviewController = new ReviewController();

    router.get("/", getUserIfLogged, reviewController.getAllReviews);
    router.get("/top", getUserIfLogged, reviewController.getReviewsByPopularity);
    router.get("/my_reviews", authMiddleware, reviewController.getMyReviews);

    router.get("/:id", getUserIfLogged, reviewController.getReviewById);
    router.get("/:user_id&game_id", getUserIfLogged, reviewController.getReviewsByUserIdAndGameId);
    router.get("/get_by_game_id/:game_id", getUserIfLogged, reviewController.getReviewsByGameId);
    router.get("/get_by_user_id/:id", getUserIfLogged, reviewController.getReviewsByUserId);
    router.get("/my_review_for_game/:game_id", authMiddleware, reviewController.getMyReviewForAGame);
    router.put("/", authMiddleware, reviewController.updateReview);
    router.post("/", authMiddleware, reviewController.createReview);
    router.post("/like", authMiddleware, reviewController.likeReview);
    router.delete("/", authMiddleware, reviewController.deleteReview);

    return router;
}      