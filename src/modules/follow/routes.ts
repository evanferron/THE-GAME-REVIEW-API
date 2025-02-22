import { Router } from "express";
import { authMiddleware } from "../../core";
import { FollowController } from "./controller";

export function createFollowRoutes(): Router {
    const router = Router();
    const followController = new FollowController();

    router.post("/", authMiddleware, followController.createFollow);
    router.get("/", followController.getAllFollow);
    router.get("/:id", followController.getFollowById);
    router.put("/", authMiddleware, followController.updateFollow);
    router.delete("/", authMiddleware, followController.deleteFollow);

    return router;
}      