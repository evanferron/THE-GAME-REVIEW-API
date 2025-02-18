import { NextFunction, Request, Response } from "express";
import { ZodIssue, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((issue: ZodIssue) => ({
                field: issue.path.join("."),
                message: issue.message,
                code: issue.code,
            }));

            res.status(400).json({
                status: "error",
                message: "Erreur de validation des données",
                errors,
            });
        }
        req.body = result.data;
        next();
    };
};
