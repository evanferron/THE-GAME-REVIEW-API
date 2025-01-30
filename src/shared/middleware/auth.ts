import { Request, Response, NextFunction } from "express";
import { parseToken } from "../utils/jwt";
import { ValidationError } from "../";
import { AError } from "../../base/AError";

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
            throw new ValidationError("Unauthorized: Missing Token");
        }
        // TODO: Move secret key to env
        const secret = "secret_key";
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
