import { UUID } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";
import { UnauthorizedError } from "../";

const secret = process.env.JWT_SECRET ?? "secret_key";
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "refresh_secret_key";

export function generateToken(userId: UUID, isAdmin: boolean = false, expiresIn: string = "15m"): string {
    return jwt.sign({ userId, isAdmin }, secret, { expiresIn: expiresIn as StringValue });
}

export function generateRefreshToken(userId: UUID, expiresIn: string = "7d"): string {
    return jwt.sign({ userId }, refreshSecret, { expiresIn: expiresIn as StringValue });

}

export function parseToken(token: string): TokenData {
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

export function parseRefreshToken(token: string): TokenData {
    try {
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }
        const decoded = jwt.verify(token, refreshSecret) as JwtPayload;
        return new TokenData(decoded.userId);

    } catch (error) {

        throw new UnauthorizedError("Invalid refresh token");

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