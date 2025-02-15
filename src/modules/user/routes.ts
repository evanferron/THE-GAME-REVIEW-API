import { Router } from "express";
import { authMiddleware } from "../../core";
import { UserController } from "./controller";

export function createUserRoutes(): Router {
    const router = Router();
    const userController = new UserController();

    router.get("/", userController.getAllUsers);
    router.get("/:id", userController.getUserById);
    router.put("/", authMiddleware, userController.updateUser);
    router.delete("/", authMiddleware, userController.deleteUser);

    return router;
}