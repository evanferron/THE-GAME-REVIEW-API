import { z } from "zod";

export const SuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.any(),
    message: z.string().optional(),
});

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
});

export type SuccessResponse<T> = {
    success: true;
    data: T;
    message?: string;
};

export type ErrorResponse = {
    success: false;
    error: string;
};
