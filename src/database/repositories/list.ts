import { UUID } from "crypto";
import { ARepository } from "../../core";
import { ListEntry } from "../models/list";

export class ListRepository extends ARepository<ListEntry> {
    protected readonly tableName: string = "lists";

     /**
    * Method that will delete all the entries corresponding to the ids
    * 
    * @param id id to delete
    * @returns entrie that are deleted
    */
    public async deleteList(listId: UUID): Promise<ListEntry[]> {

        // Detelete all the games in the list
        await this.query(`DELETE FROM games_lists WHERE list_id = $1`, [listId]);

        // Delete the list 
        const result = await this.query<ListEntry>(
            `DELETE FROM lists WHERE id = $1 RETURNING * ;`,
            [listId]
        );

        return result.rows;
    }

    /**
    * Method that will get all the review corresponding to an user
    * 
    * @param userId id to get
    * @returns all entries that are get
    */
        public async getListsByUser (userId: UUID): Promise<ListEntry[]> {

        const result = await this.query<ListEntry>(
            `SELECT * FROM lists WHERE user_id  = $1;`, 
            [userId]
        );

        return result.rows;
    }

}
