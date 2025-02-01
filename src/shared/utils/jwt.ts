import { UUID } from "crypto";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";
import { UnauthorizedError } from "../error/ApiError";


export function generateToken(secret: string, userId: UUID, isAdmin: boolean = false, expiresIn: string = "2h"): string {
    const payload = { userId, isAdmin };
    const options: SignOptions = { expiresIn: expiresIn as StringValue };
    return jwt.sign(payload, secret, options);
}

export function parseToken(secret: string, token: string): TokenData {
    try {
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        return new TokenData(decoded.userId, decoded.isAdmin);
    } catch (error) {
        throw new UnauthorizedError("Invalid token");
    }
}

class TokenData {
    userId: UUID;
    isAdmin: boolean;

    constructor(userId: UUID, isAdmin = false) {
        this.userId = userId;
        this.isAdmin = isAdmin;
    }
}