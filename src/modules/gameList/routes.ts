import { Router } from "express";
import { authMiddleware } from "../../core";
import { GameListController } from "./controller";

export function createGameListRoutes(): Router {
    const router = Router();
    const gameListController = new GameListController();

    router.post("/", authMiddleware, gameListController.createGameList);
    router.get("/", authMiddleware, gameListController.getAllGamesLists);
    router.post("/get_by_list_id", authMiddleware, gameListController.getGamesListsByListId);
    router.post("/name", authMiddleware, gameListController.getGamesListsByName);
    router.delete("/", authMiddleware, gameListController.deleteGameList);

    return router;
}      