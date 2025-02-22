import { AController, ValidationError } from "../../core";
import { NextFunction, Request, Response } from "express";
import { getResponse } from "../../core/utils/response";
import { FollowResponse, MultipleFollowsResponse } from "./response";
import { FollowEntry } from "../../database/models/follow";


export class FollowController extends AController {

    // Avoir la liste des abonnements de l'utilisateur
    public getFollowerById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = {
                follower_id: req.body.userId,
            } as FollowEntry;

            const foundFollowed = await this.config.followRepository.findByColumn("follower_id", user.follower_id);

            if (!foundFollowed || foundFollowed.length === 0) {
                throw new ValidationError("No follow found");
            }
    
            // Construire la réponse sous forme de tableau FollowResponse[]
            const followers: FollowResponse[] = foundFollowed.map(follow => ({
                followerId: follow.follower_id, 
                followedId: follow.followed_id
            }));

            res.status(201).json(getResponse<MultipleFollowsResponse>({ 
                success: true,
                data: followers
            }));

        } catch (err) {
            next(err);
        }
    }

    // Avoir la liste des abonnés de l'utilisateur
    public getFollowedById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const follow = {
                followed_id: req.body.userId,
            } as FollowEntry;

            const foundFollowed = await this.config.followRepository.findByColumn("followed_id", follow.followed_id);

            if (!foundFollowed || foundFollowed.length === 0) {
                throw new ValidationError("No follow found");
            }
    
            // Construire la réponse sous forme de tableau FollowResponse[]
            const follows: FollowResponse[] = foundFollowed.map(follow => ({
                followerId: follow.follower_id, 
                followedId: follow.followed_id
            }));

            res.status(201).json(getResponse<MultipleFollowsResponse>({ 
                success: true,
                data: follows
            }));

        } catch (err) {
            next(err);
        }
    }

    public createFollow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const follow = {
                followed_id: req.body.followedId,
                follower_id: req.body.userId
            } as FollowEntry;

            const createdFollow = await this.config.followRepository.create(follow);

            res.status(201).json(getResponse<FollowResponse>({
                followedId: createdFollow.followed_id,
                followerId: createdFollow.follower_id,
            }));
        } catch (err) {
            next(err);
        }
    }

    public deleteFollow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const follow = {
                followed_id: req.body.followedId,
                follower_id: req.body.userId
            } as FollowEntry;

            const { followedId, userId } = req.body;

            const createdFollow = await this.config.followRepository.unfollow(follow.follower_id, follow.followed_id);

            // Réponse réussie
            res.status(200).json({ success: true, message: "Follow relationship deleted successfully" });

        } catch (err) {
            next(err);
        }
    }
}