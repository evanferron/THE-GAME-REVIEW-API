import { z } from "zod";

// L'id de lutilisateur est contenu dans le jwt dans pas besoin de l'avoir dans la requête
export const CreateFollowSchema = z.object({
    followedId: z.string().uuid(),
});

export type CreateFollowRequest = z.infer<typeof CreateFollowSchema>;
