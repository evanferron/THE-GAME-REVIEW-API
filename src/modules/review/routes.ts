import { Router } from "express";
import { authMiddleware } from "../../core";
import { ReviewController } from "./controller";

export function createReviewRoutes(): Router {
    const router = Router();
    const reviewController = new ReviewController();

    router.post("/", authMiddleware, reviewController.createReview);
    router.get("/", reviewController.getAllReviews);
    router.get("/:id", reviewController.getReviewById);
    router.put("/", authMiddleware, reviewController.updateReview);
    router.delete("/", authMiddleware, reviewController.deleteReview);

    return router;
}      