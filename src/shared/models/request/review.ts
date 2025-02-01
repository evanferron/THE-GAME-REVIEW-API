import { z } from "zod";

// L'id de lutilisateur est contenu dans le jwt dans pas besoin de l'avoir dans la requête
export const CreateReviewSchema = z.object({
    gameId: z.bigint(),
    rating: z.number().int().min(1, "La note doit être comprise entre 1 et 5").max(10, "La note doit être comprise entre 1 et 5"),
    review: z.string().min(10, "La critique doit contenir au moins 10 caractères").nullable()
});

export type CreateReviewRequest = z.infer<typeof CreateReviewSchema>;
