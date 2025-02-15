import { Config, AController, generateToken } from "../../core";
import { NextFunction, Request, Response } from "express";
import { UserEntry } from "../../database/models/user";
import { getResponse } from "../../core/utils/response";
import { AuthResponse } from "./response";


export class AuthController extends AController {

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.send("Login");
        } catch (err) {
            next(err);
        }
    };

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = {
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: req.body.password,
                isAdmin: false
            } as UserEntry;

            const createdUser = await this.config.userRepository.create(user);

            res.status(201).json(getResponse<AuthResponse>({
                pseudo: createdUser.pseudo,
                token: generateToken(createdUser.id)
            }));
        } catch (err) {
            next(err);
        }
    };
} 