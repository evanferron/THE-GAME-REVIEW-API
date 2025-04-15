import { z } from "zod";

// L'id de lutilisateur est contenu dans le jwt dans pas besoin de l'avoir dans la requête
export const CreateGameListSchema = z.object({
    gameId: z.bigint(),
});

export type CreateGameListRequest = z.infer<typeof CreateGameListSchema>;
