import { Router } from "express";
import { GameController } from "./controller";
import { getUserIfLogged } from "../../core";

export function createGameRoutes(): Router {
    const router = Router();
    const gameController = new GameController();

    router.get("/top", getUserIfLogged, gameController.getTendanceGames);
    router.get("/preview/:ids", getUserIfLogged, gameController.getGamesByIds);
    router.get("/:id", getUserIfLogged, gameController.getGameDetails);

    return router;
}