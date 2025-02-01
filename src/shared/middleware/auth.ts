import { Request, Response, NextFunction } from "express";
import { parseToken } from "../utils/jwt";
import { UnauthorizedError, ValidationError } from "../";
import { AError } from "../../base/AError";
import { env } from "process";

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new UnauthorizedError("Unauthorized: Missing Token");
        }

        const secret = env.SECRET_KEY;
        if (!secret) {
            console.error("Secret key is not defined in .env file");
            res.status(500).json({ message: "An unexpected error occurred" });
            return
        }
        const tokenData = parseToken(secret, token);

        req.body.userId = tokenData.userId;
        req.body.isAdmin = tokenData.isAdmin;
        next();
    } catch (err) {
        if (err instanceof AError) {
            res.status(err.statusCode).json({ message: err.message });
        } else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
}
