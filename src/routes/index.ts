import { Router } from "express";
import { createAuthRoutes } from "../modules/auth/routes";
import { createUserRoutes } from "../modules/user/routes";
import { createReviewRoutes } from "../modules/review/routes";
import { createFollowRoutes } from "../modules/follow/routes";


export function createAppRoutes(): Router {
    const router = Router();

    router.use("/auth", createAuthRoutes());
    router.use("/user", createUserRoutes());
    router.use("/review", createReviewRoutes());
    router.use("/review", createFollowRoutes());

    return router;
}
