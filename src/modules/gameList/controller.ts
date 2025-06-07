import { Config, getUserFromRequest, AController, ValidationError, getResponse } from "../../core";
import { NextFunction, Request, Response } from "express";
import { GameListEntry } from "../../database/models/gameList";
import { MultipleGamesListsResponse, GameListResponse, SingleGameListResponse } from "./response";
import { GameDetailsResponse } from "modules/game/response";


export class GameListController extends AController {

    public getAllGamesLists = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const foundGamesLists = await this.config.gameListRepository.getAll();

            if (foundGamesLists.length === 0) {
                throw new ValidationError("No games lists found");
            }

            const gamesLists: GameListResponse[] = foundGamesLists.map(gameList => ({
                gameId: gameList.game_id,
                listId: gameList.list_id,
                addedAt: new Date(gameList.added_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleGamesListsResponse>({
                success: true,
                data: gamesLists
            }));

        } catch (err) {
            next(err);
        }
    }

    public getGamesListsByListId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const gameList = {
                list_id: req.body.list_id,
            } as GameListEntry;

            const foundLists = await this.config.gameListRepository.GetGamesListsByListId(gameList.list_id);

            const gameslists: GameListResponse[] = foundLists.map(gameList => ({
                gameId: gameList.game_id,
                listId: gameList.list_id,
                addedAt: new Date(gameList.added_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleGamesListsResponse>({
                success: true,
                data: gameslists
            }));

        } catch (err) {
            next(err);
        }
    }

    public getGamesListsByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const gameList = {
                name: req.body.name,
                user_id: getUserFromRequest(req)?.userId,
            } as any;

            const foundLists = await this.config.gameListRepository.GetGamesListByName(gameList.name, gameList.user_id);
            // Extrait les game_id sous forme de number
            const list_ids = foundLists.map(gameList => Number(gameList.game_id));

            if (list_ids.length === 0) {
                res.status(200).json(getResponse<MultipleGamesListsResponse>({
                    success: true,
                    data: []
                }));
            }
            // Récupérer les infos des jeux
            const games = await this.config.twitchService.getGamesPreview(list_ids);

            // Créer un map avoir les infos des jeux
            const gamesMap = new Map<number, typeof games[0]>();
            for (const game of games) {
                gamesMap.set(game.id, game);
            }

            const gameslists: GameListResponse[] = foundLists.map(gameList => {
                const gameInfo = gamesMap.get(Number(gameList.game_id));
                return {
                    gameId: gameList.game_id,
                    listId: gameList.list_id,
                    name: gameInfo?.name,
                    cover: gameInfo?.cover?.url,
                    aggregated_rating: gameInfo?.aggregated_rating,
                    developper: gameInfo?.involved_companies?.[0]?.company?.name,
                };
            });

            res.status(200).json(getResponse<MultipleGamesListsResponse>({
                success: true,
                data: gameslists
            }));

        } catch (err) {
            next(err);
        }
    }

    public createGameList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const gameList = {
                game_id: req.body.game_id,
                list_id: req.body.list_id,
                added_at: new Date(),
            } as GameListEntry;

            const createdGameList = await this.config.gameListRepository.create(gameList);

            res.status(201).json(getResponse<GameListResponse>({
                gameId: createdGameList.game_id,
                listId: createdGameList.list_id,
                addedAt: new Date(createdGameList.added_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }

    public deleteGameList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const gameList = {
                game_id: req.body.game_id,
                list_id: req.body.list_id,
            } as GameListEntry;

            const deletedGameList = await this.config.gameListRepository.deleteGameList(gameList.game_id, gameList.list_id);

            if (deletedGameList.length === 0) {
                throw new ValidationError("No Game List found");
            }

            res.status(200).json(getResponse<GameListResponse>({
                gameId: deletedGameList[0].game_id,
                listId: deletedGameList[0].list_id,
                addedAt: new Date(deletedGameList[0].added_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }
}