import { Router } from "express";
import { authMiddleware } from "../../core";
import { ListController } from "./controller";

export function createListRoutes(): Router {
    const router = Router();
    const listController = new ListController();

    router.post("/", authMiddleware, listController.createList);
    router.get("/", authMiddleware, listController.getAllLists);
    router.get("/get_by_id", authMiddleware, listController.getListById);
    router.get("/get_by_user_id", authMiddleware, listController.getListsByUserId);
    router.put("/", authMiddleware, listController.updateList);
    router.delete("/", authMiddleware, listController.deleteList);

    return router;
}      