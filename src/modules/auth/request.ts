import { z } from "zod";

export const RegisterUserSchema = z.object({
    pseudo: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
    email: z.string().email("Format de l'email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
});


export const LoginUserSchema = z.object({
    email: z.string().email("Format de l'email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
});

export type LoginUserRequest = z.infer<typeof LoginUserSchema>;
export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;
