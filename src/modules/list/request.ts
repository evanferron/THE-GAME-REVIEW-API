import { z } from "zod";

// L'id de lutilisateur est contenu dans le jwt dans pas besoin de l'avoir dans la requête
export const CreateListSchema = z.object({
    gameId: z.bigint(),
});

export type CreateListRequest = z.infer<typeof CreateListSchema>;
