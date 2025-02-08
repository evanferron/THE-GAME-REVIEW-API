import { Router } from "express";
import { Config, validateRequest, CreateUserSchema } from "../../core";
import { AuthController } from "./controller";

export function createAuthRoutes(config: Config): Router {
    const router = Router();
    const authController = new AuthController(config);

    router.post("/login", validateRequest(CreateUserSchema), authController.login);
    router.post("/register", authController.register);

    return router;
}