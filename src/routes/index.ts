import { Router } from "express";
import { createAuthRoutes } from "../modules/auth/routes";
import { createUserRoutes } from "../modules/user/routes";
import { createReviewRoutes } from "../modules/review/routes";
import { createFollowRoutes } from "../modules/follow/routes";
import { createListRoutes } from "../modules/list/routes";
import { createGameListRoutes } from "../modules/gameList/routes";


export function createAppRoutes(): Router {
    const router = Router();

    router.use("/auth", createAuthRoutes());
    router.use("/user", createUserRoutes());
    router.use("/review", createReviewRoutes());
    router.use("/follow", createFollowRoutes());
    router.use("/list", createListRoutes());
    router.use("/game_list", createGameListRoutes());

    return router;
}
