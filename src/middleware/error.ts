import { Request, Response, NextFunction } from "express";
import { ApiError } from "../error/ApiError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    } else {
        console.error("Unexpected error:", err);

        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
        });
    }
}
