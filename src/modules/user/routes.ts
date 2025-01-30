import { Router } from "express";
import { Config } from "../../config/config";
import { UserController } from "./controller";
import { authMiddleware } from "../../shared/middleware/auth";

export function createUserRoutes(config: Config): Router {
    const router = Router();
    const userController = new UserController(config);

    router.get("/", userController.getAllUsers);
    router.get("/:id", userController.getUserById);
    router.put("/", authMiddleware, userController.updateUser);
    router.delete("/", authMiddleware, userController.deleteUser);

    return router;
}