import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
