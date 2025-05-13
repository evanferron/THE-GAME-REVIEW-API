import { Router } from "express";
import { authMiddleware } from "../../core";
import { UserController } from "./controller";

export function createUserRoutes(): Router {
    const router = Router();
    const userController = new UserController();

    router.get("/", authMiddleware, userController.getUserById);
    router.put("/", authMiddleware, userController.updateUser);
    router.put("/info", authMiddleware, userController.updateUserInfo);
     router.put("/password", authMiddleware, userController.updateUserPassword);
    router.delete("/", authMiddleware, userController.deleteUser);

    return router;
}