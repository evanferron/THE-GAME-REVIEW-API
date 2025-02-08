import { SuccessResponse, ARepository, UserEntry, UserResponse } from "../../core";

export class UserRepository extends ARepository<UserEntry, SuccessResponse<UserResponse>> {
    protected readonly tableName: string = "user";

    toModel(entry: UserEntry): SuccessResponse<UserResponse> {
        return {
            success: true,
            data: {
                id: entry.id,
                pseudo: entry.pseudo,
                email: entry.email,
                isAdmin: entry.isAdmin,
            },
        };
    }
}
