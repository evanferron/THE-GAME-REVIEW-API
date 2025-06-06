import { Request, Response, NextFunction } from "express";

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];


/**
 * Middleware to check the request's origin and API key for CORS and authentication.
 *
 * - Verifies the presence of an `x-api-key` header; responds with 401 if missing.
 * - Checks if the request's origin is allowed (or missing); sets appropriate CORS headers.
 * - Handles preflight `OPTIONS` requests by responding with 200.
 * - Calls `next()` for valid requests; otherwise responds with 403 for unauthorized origins.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export const checkOrigin = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

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