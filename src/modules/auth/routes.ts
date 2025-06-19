import { Router } from "express";
import { validateRequest } from "../../core";
import { AuthController } from "./controller";
import { RegisterUserSchema, LoginUserSchema, RefreshTokenSchema } from "./request";

export function createAuthRoutes(): Router {
    const router = Router();
    const authController = new AuthController();

    router.post("/login", validateRequest(LoginUserSchema), authController.login);
    router.post("/register", validateRequest(RegisterUserSchema), authController.register);
    router.post("/refresh", validateRequest(RefreshTokenSchema), authController.refreshToken);

    return router;
}