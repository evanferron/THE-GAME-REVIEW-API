import { Router } from "express";
import { validateRequest } from "../../core";
import { AuthController } from "./controller";
import { CreateUserSchema } from "../user/request";

export function createAuthRoutes(): Router {
    const router = Router();
    const authController = new AuthController();

    router.post("/login", validateRequest(CreateUserSchema), authController.login);
    router.post("/register", authController.register);

    return router;
}