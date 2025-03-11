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
    public async deleteUser(userId: UUID): Promise<UserEntry[]> {

        const result = await this.query<UserEntry>(
            `UPDATE user SET deleted_at = NOW() WHERE id = $1;`,
            [userId]
        );

        return result.rows;
    }

}
