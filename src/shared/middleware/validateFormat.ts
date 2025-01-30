import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: "Validation Error", details: result.error.format() });
            return
        }
        req.body = result.data;
        next();
    };
};
