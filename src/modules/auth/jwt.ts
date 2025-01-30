import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";


/**
 * Génère un token JWT
 * @param secret - Clé secrète pour signer le token
 * @param userId - Identifiant de l'utilisateur
 * @param expiresIn - Durée avant expiration du token (par défaut : "2h")
 * @returns Le token signé
 */
export function generateToken(secret: string, userId: number, expiresIn: string = "2h"): string {
    const payload = { userId };
    const options:SignOptions = { expiresIn : expiresIn as StringValue };
    return jwt.sign(payload, secret, options);
}

/**
 * Parse un token JWT et retourne l'ID utilisateur
 * @param secret - Clé secrète utilisée pour signer le token
 * @param token - Le token JWT
 * @returns L'ID utilisateur extrait du token ou null si le token est invalide
 */
export function parseToken(secret: string, token: string): TokenData {
    try {
        // Supprime le préfixe "Bearer " s'il est présent
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Retourne l'ID utilisateur s'il est présent dans le payload
        return new TokenData(decoded.userId);
    } catch (error) {
        throw new Error("Invalid token");
    }
}

class TokenData{
    userId: number;
    isAdmin: boolean;

    constructor(userId: number, isAdmin = false){
        this.userId = userId;
        this.isAdmin = isAdmin;
    }
}