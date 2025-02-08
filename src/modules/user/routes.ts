import { Router } from "express";
import { Config, authMiddleware } from "../../core";
import { UserController } from "./controller";

export function createUserRoutes(config: Config): Router {
    const router = Router();
    const userController = new UserController(config);

    router.get("/", userController.getAllUsers);
    router.get("/:id", userController.getUserById);
    router.put("/", authMiddleware, userController.updateUser);
    router.delete("/", authMiddleware, userController.deleteUser);

    return router;
}