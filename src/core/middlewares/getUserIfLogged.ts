import { AuthenticatedRequest } from "@base/IAuthentificateRequest";
import { env } from "process";
import { Response, NextFunction } from "express";
import { parseToken } from "../";

/**
 * Permet de récupérer l'utilisateur si il est connecté et de le mettre dans la requête
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getUserIfLogged = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        next()
        return
    }

    const secret = env.JWT_SECRET;
    if (!secret) {
        console.error("Secret key is not defined in .env file");
        res.status(500).json({ message: "An unexpected error occurred" });
        return
    }
    const tokenData = parseToken(token);

    req.user = {
        userId: tokenData.userId,
        isAdmin: tokenData.isAdmin
    };

    next();
}