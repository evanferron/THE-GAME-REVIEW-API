import { Request, Response, NextFunction } from "express";

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

export const checkOrigin = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    if (!origin || allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin || "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
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