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

            if (foundUsers[0].deleted_at != null) {
                throw new UnauthorizedError("User is deleted");
            }

            res.status(200).json(getResponse<AuthResponse>({
                pseudo: foundUsers[0].pseudo,
                token: generateToken(foundUsers[0].id),
                refreshToken: generateRefreshToken(foundUsers[0].id, "7d"),
                profile_picture_id: foundUsers[0].profil_picture_id,
            }));
        } catch (err) {
            next(err);
        }
    };

    /**
     * Registers a new user account.
     *
     * This method hashes the user's password, creates a new user entry with default profile and banner pictures,
     * and initializes default lists ("Like" and "Favorite") for the user. If the user already exists, a
     * ValidationError is thrown. On success, returns a JSON response containing the user's pseudo, authentication
     * token, refresh token, and profile picture ID.
     *
     * @param req - Express request object containing user registration data (pseudo, email, password).
     * @param res - Express response object used to send the registration result.
     * @param next - Express next function for error handling.
     * @returns A Promise that resolves to a JSON response with authentication details or passes errors to the next middleware.
     */
    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = {
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: hashedPassword,
                is_admin: false
            } as UserEntry;

            // random profile and banner pictures
            user.banner_picture_id = randomInt(1, 5);
            user.profil_picture_id = randomInt(1, 5);

            const createdUser = await this.config.userRepository.create(user);
            if (createdUser == null) {
                throw new ValidationError("User already exists");
            }

            // create default lists
            await this.config.listRepository.create({
                user_id: createdUser.id,
                name: "Like",
                description: "Les jeux que j'aime",
                is_private: false,
            })
            await this.config.listRepository.create({
                user_id: createdUser.id,
                name: "Favorite",
                description: "Mes jeux préférés",
                is_private: false,
            })

            res.status(201).json(getResponse<AuthResponse>({
                pseudo: createdUser.pseudo,
                token: generateToken(createdUser.id),
                refreshToken: generateRefreshToken(createdUser.id),
                profile_picture_id: createdUser.profil_picture_id,
            }));
        } catch (err) {
            next(err);
        }
    };

    /**
     * Handles the refresh token process for authentication.
     *
     * Expects a `refreshToken` in the request body, validates its presence,
     * parses the token to extract user data, and responds with a new access token,
     * the same refresh token, and user information.
     *
     * @param req - Express request object containing the refresh token in the body.
     * @param res - Express response object used to send the new authentication data.
     * @param next - Express next function for error handling.
     *
     * @throws {ValidationError} If the refresh token is not provided in the request body.
     */
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
                refreshToken: refreshToken,
                profile_picture_id: tokenData.profilePictureId ?? null,
            }));

        } catch (err) {
            next(err);
        }

    };
} 