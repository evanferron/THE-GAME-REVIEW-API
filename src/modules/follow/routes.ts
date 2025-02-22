import { Router } from "express";
import { validateRequest } from "../../core";
import { authMiddleware } from "../../core";
import { FollowController } from "./controller";
import { CreateFollowSchema } from "./request";

export function createFollowRoutes(): Router {
    const router = Router();
    const followController = new FollowController();

    router.post("/", authMiddleware, validateRequest(CreateFollowSchema), followController.createFollow);
    router.get("/", authMiddleware, followController.getFollowerById);
    router.get("/", authMiddleware, followController.getFollowedById);
    router.delete("/", authMiddleware, validateRequest(CreateFollowSchema), followController.deleteFollow);

    return router;
}      