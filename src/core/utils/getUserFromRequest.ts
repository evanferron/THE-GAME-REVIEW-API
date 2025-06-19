import { AuthenticatedRequest } from '../';

export const getUserFromRequest = (req: AuthenticatedRequest): { userId: string, isAdmin: boolean } | null => {
    if (!req.user) {
        return null
    }

    return req.user;
}