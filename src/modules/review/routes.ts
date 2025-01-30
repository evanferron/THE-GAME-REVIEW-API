import { Router } from "express";
import { Config } from "../../config/config";
import { ReviewController } from "./controller";
import { authMiddleware } from "../../shared/middleware/auth";

export function Routes(config: Config): Router {
    const router = Router();
    const reviewController = new ReviewController(config);

    router.post("/", authMiddleware, reviewController.createReview);
    router.get("/", reviewController.getAllReviews);
    router.get("/:id", reviewController.getReviewById);
    router.put("/", authMiddleware, reviewController.updateReview);
    router.delete("/", authMiddleware, reviewController.deleteReview);

    return router;
}      