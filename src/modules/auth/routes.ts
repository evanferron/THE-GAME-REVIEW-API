import { Router } from "express";
import { Config } from "../../config/config";
import { AuthController } from "./controller";
import { validateRequest } from "../../shared/middleware/validateFormat";
import { CreateUserSchema } from "../../shared";

export function createAuthRoutes(config: Config): Router {
    const router = Router();
    const authController = new AuthController(config);

    router.post("/login", validateRequest(CreateUserSchema), authController.login);
    router.post("/register", authController.register);

    return router;
}