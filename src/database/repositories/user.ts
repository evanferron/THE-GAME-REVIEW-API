import { UUID } from "crypto";
import { ARepository } from "../../core";
import { UserEntry } from "../models/user";

export class UserRepository extends ARepository<UserEntry> {
    protected readonly tableName: string = "users";

     /**
    * Method that will delete all the entries corresponding to the ids
    * 
    * @param id id to delete
    * @returns entrie that are deleted
    */
    public async deleteUser(userId: UUID, userDeletedAt : Date): Promise<UserEntry[]> {

        const result = await this.query<UserEntry>(
            `UPDATE users SET deleted_at = $1 WHERE id = $2 RETURNING * ;`,
            [userDeletedAt, userId]
        );

        return result.rows;
    }

}
