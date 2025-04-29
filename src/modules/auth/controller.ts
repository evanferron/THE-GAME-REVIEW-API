import { AController, generateRefreshToken, generateToken, parseRefreshToken, UnauthorizedError, ValidationError } from "../../core";
import { NextFunction, Request, Response } from "express";
import { UserEntry } from "../../database/models/user";
import { getResponse } from "../../core/utils/response";
import { AuthResponse } from "./response";
import bcrypt from "bcrypt";
import { randomInt } from "crypto";


export class AuthController extends AController {

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = {
                email: req.body.email,
                password: req.body.password,
            } as UserEntry;

            const foundUsers = await this.config.userRepository.findByColumn("email", user.email);

            if (foundUsers.length === 0) {
                throw new UnauthorizedError("Email or password is incorrect");
            }

            const passwordMatch = await bcrypt.compare(user.password, foundUsers[0].password);

            if (!passwordMatch) {
                throw new UnauthorizedError("Email or password is incorrect");
            }

            res.status(201).json(getResponse<AuthResponse>({
                pseudo: foundUsers[0].pseudo,
                token: generateToken(foundUsers[0].id),
                refreshToken: generateRefreshToken(foundUsers[0].id, "7d")
            }));
        } catch (err) {
            next(err);
        }
    };

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = {
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: hashedPassword,
                is_admin: false
            } as UserEntry;

            //choix aléatoire d'une image de profil et d'une bannière
            user.banner_picture_id = randomInt(1, 5);
            user.profil_picture_id = randomInt(1, 5);

            const createdUser = await this.config.userRepository.create(user);

            res.status(201).json(getResponse<AuthResponse>({
                pseudo: createdUser.pseudo,
                token: generateToken(createdUser.id),
                refreshToken: generateRefreshToken(createdUser.id)
            }));
        } catch (err) {
            next(err);
        }
    };

    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new ValidationError("Refresh token is required");
            }

            const tokenData = parseRefreshToken(refreshToken);

            res.status(201).json(getResponse<AuthResponse>({
                pseudo: tokenData.userId,
                token: generateToken(tokenData.userId),
                refreshToken: refreshToken
            }));

        } catch (err) {
            next(err);
        }

    };
} 