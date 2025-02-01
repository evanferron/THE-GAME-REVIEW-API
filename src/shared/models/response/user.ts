import { z } from "zod";
import { SuccessResponseSchema } from "../../../base";

// Modèle d'un utilisateur retourné dans la réponse
export const UserResponseSchema = z.object({
    id: z.string().uuid(),
    pseudo: z.string(),
    email: z.string().email(),
    isAdmin: z.boolean(),
});

// Modèle de réponse contenant un utilisateur
export const SingleUserResponseSchema = SuccessResponseSchema.extend({
    data: UserResponseSchema,
});

// Modèle de réponse contenant une liste d'utilisateurs
export const MultipleUsersResponseSchema = SuccessResponseSchema.extend({
    data: z.array(UserResponseSchema),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type SingleUserResponse = z.infer<typeof SingleUserResponseSchema>;
export type MultipleUsersResponse = z.infer<typeof MultipleUsersResponseSchema>;
