import { AController, parseToken, getResponse, ValidationError, getUserFromRequest } from "../../core";
import { NextFunction, Request, Response } from "express";
import { GameDetailsResponse } from "./response";
import { UUID } from "crypto";


export class GameController extends AController {

    public getGameDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            let gameId: number;

            if (!req.params.id || isNaN(Number(req.params.id))) {
                throw new ValidationError('GameId is required');
            } else {
                gameId = Number(req.params.id);
            }

            const game = await this.config.twitchService.getGameDetails(gameId);

            const response = <GameDetailsResponse>{
                id: game.id,
                name: game.name,
                aggregated_rating: game.aggregated_rating,
                genres: game.genres ? game.genres.map((genre: { name: string }) => { return genre["name"] }) : null,
                platforms: game.platforms ? game.platforms.map((platform: { name: string }) => { return platform["name"] }) : null,
                summary: game.summary,
                cover_url: game.cover ? game.cover["url" as any] : null,
                franchises: game.franchises ? game.franchises.map((franchise: { name: string }) => { return franchise["name"] }) : null,
                first_release_date: game.first_release_date,
                involved_companies: game.involved_companies ? game.involved_companies.map((company: { company: { name: string } }) => { return company["company"]["name"] }) : null,
            };
            if (token) {
                const tokenData = parseToken(token);
                const review = await this.config.reviewRepository.findGameReviewByUser(tokenData.userId, gameId);
                response.userRate = review ? review.rating : undefined;
                res.status(200).json(getResponse<GameDetailsResponse>(response));
            } else {
                res.status(200).json(getResponse<GameDetailsResponse>(response));
            }
        } catch (err) {
            next(err);
        }
    };

    public getGamesPreview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const games = await this.config.twitchService.getGamesPreview(req.body.gamesId);
            const response = games.map((game) => {
                return {
                    id: game.id,
                    name: game.name,
                    cover: game.cover.url,
                    aggregated_rating: game.aggregated_rating
                };
            });
            res.status(200).json(getResponse(response));
        } catch (err) {
            next(err);
        }
    }

    public getTendanceGames = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = getUserFromRequest(req)?.userId as UUID;

            const games = await this.config.twitchService.getTopGames();
            const response = games.map((game) => {
                return {
                    id: game.id,
                    name: game.name,
                    cover: game.cover.url,
                    aggregated_rating: game.total_rating_count,
                    involved_companies: game.involved_companies,
                };
            });
            res.status(200).json(getResponse(response));
        } catch (err) {
            next(err);
        }
    }

    public getGamesByIds = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ids = req.params.ids.split(",");
            const games = await this.config.twitchService.getGamesPreview(ids);
            const response = games.map((game) => {
                return {
                    id: game.id,
                    name: game.name,
                    cover: game.cover.url,
                    aggregated_rating: game.total_rating_count,
                    involved_companies: game.involved_companies,
                };
            });
            res.status(200).json(getResponse(response));
        } catch (err) {
            next(err);
        }
    }
}