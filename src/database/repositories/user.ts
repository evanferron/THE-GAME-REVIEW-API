import { SuccessResponse, ARepository, UserEntry, UserResponse } from "../../core";

export class UserRepository extends ARepository<UserEntry, SuccessResponse<UserResponse>> {
    protected readonly tableName: string = "user";

}
