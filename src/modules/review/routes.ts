import { Router } from "express";
import { Config, authMiddleware } from "../../core";
import { ReviewController } from "./controller";

export function createReviewRoutes(config: Config): Router {
    const router = Router();
    const reviewController = new ReviewController(config);

    router.post("/", authMiddleware, reviewController.createReview);
    router.get("/", reviewController.getAllReviews);
    router.get("/:id", reviewController.getReviewById);
    router.put("/", authMiddleware, reviewController.updateReview);
    router.delete("/", authMiddleware, reviewController.deleteReview);

    return router;
}      