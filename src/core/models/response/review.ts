import { z } from "zod";
import { SuccessResponseSchema } from "../../";

// Modèle d'une critique
export const ReviewResponseSchema = z.object({
    id: z.string().uuid(),
    gameId: z.bigint(),
    userId: z.string().uuid(),
    rating: z.number().int().min(1).max(10),
    review: z.string().nullable(),
    createdAt: z.string().datetime(),
});

// Modèle de réponse contenant une seule critique
export const SingleReviewResponseSchema = SuccessResponseSchema.extend({
    data: ReviewResponseSchema,
});

// Modèle de réponse contenant plusieurs critiques
export const MultipleReviewsResponseSchema = SuccessResponseSchema.extend({
    data: z.array(ReviewResponseSchema),
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type SingleReviewResponse = z.infer<typeof SingleReviewResponseSchema>;
export type MultipleReviewsResponse = z.infer<typeof MultipleReviewsResponseSchema>;
