import { Router } from "express";
import { Config } from "../../config/config";
import { AuthController } from "./controller";

export function Routes(config:Config):Router{
    const router = Router();
    const authController = new AuthController(config);

    router.post("/login", authController.login);
    router.post("/register", authController.register);

    return router;
}