import { z } from "zod";

// L'id de l'utilisateur est contenu dans le jwt donc pas besoin de l'avoir dans la requête
export const CreateUserSchema = z.object({
    userdId: z.string().uuid(),
});

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;
