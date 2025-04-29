import { AController, ValidationError, getUserFromRequest, getResponse } from "../../core";
import { NextFunction, Request, Response } from "express";
import { FollowerUserResponse, FollowingUserResponse, FollowResponse, MultipleFollowerUserResponse, MultipleFollowingUserResponse } from "./response";
import { FollowEntry } from "../../database/models/follow";


export class FollowController extends AController {

    public getFollowersById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = {
                follower_id: getUserFromRequest(req).userId,
            } as FollowEntry;

            const foundFollower = await this.config.followRepository.getFollowers(user.follower_id);

            if (foundFollower.length === 0) {
                throw new ValidationError("No follow found");
            }

            const followers: FollowerUserResponse[] = foundFollower.map(follow => ({
                followerId: user.follower_id,
                following: {
                    id : follow.id,
                    pseudo: follow.pseudo,
                    email: follow.email,
                    isAdmin: follow.is_admin,
                    createdAt: follow.created_at,
                    deletedAt: follow.deleted_at,
                    profilePictureId: follow.profil_picture_id,
                    bannerId: follow.banner_picture_id,
                }
            }));

            res.status(201).json(getResponse<MultipleFollowerUserResponse>({
                success: true,
                data: followers
            }));

        } catch (err) {
            next(err);
        }
    }

    public getFollowingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = {
                follower_id: getUserFromRequest(req).userId,
            } as FollowEntry;

            const foundFollower = await this.config.followRepository.getFollowing(user.follower_id);

            if (foundFollower.length === 0) {
                throw new ValidationError("No follow found");
            }

            const followers: FollowingUserResponse[] = foundFollower.map(follow => ({
                followingId: user.follower_id,
                follower : {
                    id : follow.id,
                    pseudo: follow.pseudo,
                    email: follow.email,
                    isAdmin: follow.is_admin,
                    createdAt: follow.created_at,
                    deletedAt: follow.deleted_at,
                    profilePictureId: follow.profil_picture_id,
                    bannerId: follow.banner_picture_id,
                }
            }));

            res.status(201).json(getResponse<MultipleFollowingUserResponse>({
                success: true,
                data: followers
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