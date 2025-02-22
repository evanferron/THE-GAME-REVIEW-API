import { AController, ValidationError, getUserFromRequest, getResponse } from "../../core";
import { NextFunction, Request, Response } from "express";
import { FollowResponse, MultipleFollowsResponse } from "./response";
import { FollowEntry } from "../../database/models/follow";


export class FollowController extends AController {

    public getFollowersById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = {
                follower_id: getUserFromRequest(req).userId,
            } as FollowEntry;

            const foundFollowed = await this.config.followRepository.findByColumn("follower_id", user.follower_id);

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

    public getFollowingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const follow = {
                followed_id: getUserFromRequest(req).userId,
            } as FollowEntry;

            const foundFollowed = await this.config.followRepository.findByColumn("followed_id", follow.followed_id);

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
                follower_id: getUserFromRequest(req).userId,
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
                follower_id: getUserFromRequest(req).userId,
            } as FollowEntry;

            const deletedData = await this.config.followRepository.unfollow(follow.follower_id, follow.followed_id);

            if (deletedData.length === 0) {
                throw new ValidationError("No follow found");
            }

            res.status(200).json(getResponse<FollowResponse>({
                followedId: deletedData[0].followed_id,
                followerId: deletedData[0].follower_id,
            }));
        } catch (err) {
            next(err);
        }
    }
}