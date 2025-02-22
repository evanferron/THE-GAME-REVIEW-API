import { z } from "zod";

// L'id de lutilisateur est contenu dans le jwt dans pas besoin de l'avoir dans la requête
export const CreateFollowSchema = z.object({
    followerId: z.bigint(),
    followedId: z.bigint(),
});

export type CreateFollowRequest = z.infer<typeof CreateFollowSchema>;
