import { Router } from "express";
import { authMiddleware } from "../../core";
import { ListController } from "./controller";

export function createListRoutes(): Router {
    const router = Router();
    const listController = new ListController();

    router.post("/", authMiddleware, listController.createList);
    router.get("/", authMiddleware, listController.getAllLists);
    router.get("/getById", authMiddleware, listController.getListById);
    router.get("/getByUserId", authMiddleware, listController.getListsByUserId);
    router.put("/", authMiddleware, listController.updateList);
    router.delete("/", authMiddleware, listController.deleteList);

    return router;
}      