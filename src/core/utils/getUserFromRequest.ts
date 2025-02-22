import { AuthenticatedRequest, UnauthorizedError } from '../';

export const getUserFromRequest = (req: AuthenticatedRequest): { userId: string, isAdmin: Boolean } => {
    if (!req.user) {
        throw new UnauthorizedError("Unauthorized: Missing user info in request");
    }

    return req.user;
}