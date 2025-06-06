import { Router } from "express";
import { GameController } from "./controller";
import { GetGamesPreview } from "./request";
import { validateRequest, getUserIfLogged } from "../../core";

export function createGameRoutes(): Router {
    const router = Router();
    const gameController = new GameController();

    router.get("/cards", validateRequest(GetGamesPreview), getUserIfLogged, gameController.getGamesPreview);
    router.get("/top", getUserIfLogged, gameController.getTendanceGames);

    router.get("/:id", getUserIfLogged, gameController.getGameDetails);

    return router;
}