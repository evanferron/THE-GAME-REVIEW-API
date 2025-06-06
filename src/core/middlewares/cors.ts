import { Request, Response, NextFunction } from "express";

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

/**
 * Middleware to check the request's origin against a list of allowed origins and set appropriate CORS headers.
 *
 * - If the request's origin is allowed or not specified, sets CORS headers to allow the request.
 * - Handles preflight OPTIONS requests by responding with status 200.
 * - If the origin is not allowed, responds with a 403 Forbidden error.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const checkOrigin = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    // Vérification de la présence de la clé API dans l'en-tête
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        res.status(401).json({ error: "Unauthorized: API key missing" });
        return;
    }

    if (!origin || allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin ?? "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
        res.header("Access-Control-Allow-Credentials", "true");

        if (req.method === "OPTIONS") {
            res.sendStatus(200);
        } else {
            next();
        }
    } else {
        res.status(403).json({ error: "Forbidden: Unauthorized origin" });
    }
};