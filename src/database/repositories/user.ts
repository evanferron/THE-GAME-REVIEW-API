import { SuccessResponse } from "../../base";
import { ARepository } from "../../base/ARepository";
import { UserEntry } from "../../shared/models/db/user";
import { UserResponse } from "../../shared/models/response/user";

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
