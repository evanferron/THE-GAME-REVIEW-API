import { Config, AController, getResponse, getUserFromRequest, ValidationError } from "../../core";
import { NextFunction, Request, Response } from "express";
import { UserEntry } from "../../database/models/user";
import bcrypt from "bcrypt";
import { SingleUserResponse, UserResponse } from "../user/response";


export class UserController extends AController {

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const user = {
                id: getUserFromRequest(req).userId,
            } as UserEntry;

            const foundUser = await this.config.userRepository.findByColumn("id", user.id);

            const users: UserResponse[] = foundUser.map(user => ({
                id: user.id,
                pseudo: user.pseudo,
                email: user.email,
                isAdmin: user.is_admin,
                createdAt: user.created_at,
                deletedAt: user.deleted_at,
                profilePictureId: user.profil_picture_id,
                bannerId: user.banner_picture_id,
            }));

            res.status(200).json(getResponse<SingleUserResponse>({
                success: true,
                data: users[0]
            }));

        } catch (err) {
            next(err);
        }
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const user = {
                id: getUserFromRequest(req).userId,
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: req.body.password,
                is_admin: req.body.isAdmin,
                created_at: req.body.createdAt,
                profil_picture_id: req.body.profilePictureId,
                banner_picture_id: req.body.bannerId,
            } as UserEntry;

            const createdUser = await this.config.userRepository.update(user.id, user);
            if (createdUser == null) {
                throw new ValidationError("No User found");
            }
            res.status(201).json(getResponse<UserResponse>({
                id: createdUser.id,
                pseudo: createdUser.pseudo,
                email: createdUser.email,
                isAdmin: createdUser.is_admin,
                createdAt: createdUser.created_at,
                deletedAt: createdUser.deleted_at,
                profilePictureId: createdUser.profil_picture_id,
                bannerId: createdUser.banner_picture_id,
            }));
        } catch (err) {
            next(err);
        }

    }

    public updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const user = {
                id: getUserFromRequest(req).userId,
                pseudo: req.body.pseudo,
                email: req.body.email,
            } as UserEntry;

            const createdUser = await this.config.userRepository.update(user.id, user);
            if (createdUser == null) {
                throw new ValidationError("No User found");
            }
            res.status(201).json(getResponse<UserResponse>({
                id: createdUser.id,
                pseudo: createdUser.pseudo,
                email: createdUser.email,
                isAdmin: createdUser.is_admin,
                createdAt: createdUser.created_at,
                deletedAt: createdUser.deleted_at,
                profilePictureId: createdUser.profil_picture_id,
                bannerId: createdUser.banner_picture_id,
            }));
        } catch (err) {
            next(err);
        }

    }

    public updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = {
                id: getUserFromRequest(req).userId,
                password: hashedPassword,
            } as UserEntry;

            const createdUser = await this.config.userRepository.update(user.id, user);
            if (createdUser == null) {
                throw new ValidationError("No User found");
            }
            res.status(201).json(getResponse<UserResponse>({
                id: createdUser.id,
                pseudo: createdUser.pseudo,
                email: createdUser.email,
                isAdmin: createdUser.is_admin,
                createdAt: createdUser.created_at,
                deletedAt: createdUser.deleted_at,
                profilePictureId: createdUser.profil_picture_id,
                bannerId: createdUser.banner_picture_id,
            }));
            console.log("User password updated");
        } catch (err) {
            next(err);
        }

    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        // ! check if user is authorized to update
        try {
            const user = {
                id: getUserFromRequest(req).userId,
            } as UserEntry;

            const deletedUser = await this.config.userRepository.deleteUser(user.id);

            if (deletedUser.length === 0) {
                throw new ValidationError("No User found");
            }

            res.status(200).json(getResponse<UserResponse>({
                id: deletedUser[0].id,
                pseudo: deletedUser[0].pseudo,
                email: deletedUser[0].email,
                isAdmin: deletedUser[0].is_admin,
                createdAt: deletedUser[0].created_at,
                deletedAt: deletedUser[0].deleted_at,
                profilePictureId: deletedUser[0].profil_picture_id,
                bannerId: deletedUser[0].banner_picture_id,
            }));
        } catch (err) {
            next(err);
        }
    }
}
