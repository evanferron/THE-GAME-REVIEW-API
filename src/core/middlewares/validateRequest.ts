import { NextFunction, Request, Response } from "express";
import { ZodIssue, ZodSchema } from "zod";

function sanitizeString(str: string): string {
    // XSS: échappe < et >
    let sanitized = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // SQLi: supprime ', ", ;, \
    sanitized = sanitized.replace(/['";\\]/g, "");
    // SQLi: supprime les séquences --
    sanitized = sanitized.replace(/--/g, "");
    return sanitized;
}

function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
            sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
    }
    return obj;
}

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
            return;
        }
        req.body = sanitizeObject(result.data); // sanitize input data
        next();
    };
};
