import { NextFunction, Request, Response } from "express";

// TODO : | delete the localhost url when the project is deployed
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

export const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // allow request that doesn't have origin (postman) and allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
        next();
    } else {
        res.status(403).json({ error: "Forbidden: Unauthorized origin" });
    }

};
