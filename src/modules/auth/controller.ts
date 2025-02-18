import { Config, AController, generateToken, ValidationError } from "../../core";
import { NextFunction, Request, Response } from "express";
import { UserEntry } from "../../database/models/user";
import { getResponse } from "../../core/utils/response";
import { AuthResponse } from "./response";
import bcrypt from "bcrypt";


export class AuthController extends AController {

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = {
                email: req.body.email,
                password: req.body.password,
            } as UserEntry;

            const foundUsers = await this.config.userRepository.findByColumn("email", user.email);

            if (foundUsers.length === 0) {
                throw new ValidationError("Email or password is incorrect");
            }

            const passwordMatch = await bcrypt.compare(user.password, foundUsers[0].password);

            if (!passwordMatch) {
                throw new ValidationError("Email or password is incorrect");
            }

            res.status(201).json(getResponse<AuthResponse>({
                pseudo: foundUsers[0].pseudo,
                token: generateToken(foundUsers[0].id)
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