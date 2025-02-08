import { Router } from "express";
import { Config } from "../core";
import { createAuthRoutes } from "../modules/auth/routes";
import { createUserRoutes } from "../modules/user/routes";
import { createReviewRoutes } from "../modules/review/routes";


export function createAppRoutes(config: Config): Router {
    const router = Router();

    router.use("/auth", createAuthRoutes(config));
    router.use("/user", createUserRoutes(config));
    router.use("/review", createReviewRoutes(config));

    return router;
}
