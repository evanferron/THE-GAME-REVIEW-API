import { Router } from "express";
import { GameController } from "./controller";
import { validateRequest } from "../../core";
import { GetGamesPreview } from "./request";

export function createGameRoutes(): Router {
    const router = Router();
    const gameController = new GameController();

    router.get("/cards", validateRequest(GetGamesPreview), gameController.getGamesPreview);
    router.get("/top", gameController.getTendanceGames);

    router.get("/:id", gameController.getGameDetails);

    return router;
}