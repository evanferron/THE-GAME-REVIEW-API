import { UUID } from "crypto";
import { ARepository } from "../../core";
import { GameListEntry } from "../models/gameList";

export class GameListRepository extends ARepository<GameListEntry> {
    protected readonly tableName: string = "games_lists";

    /**
    * Method that will delete all the entries corresponding to the ids
    * 
    * @param id id to delete
    * @returns entrie that are deleted
    */
    public async deleteGameList(gameId: bigint, listId: UUID): Promise<GameListEntry[]> {

        const result = await this.query<GameListEntry>(
            `DELETE FROM games_lists WHERE game_id = $1 AND list_id = $2 RETURNING * ;`,
            [gameId, listId]
        );

        return result.rows;
    }

    /**
    * Method that will delete all the entries corresponding to the ids
    * 
    * @param id id to delete
    * @returns entrie that are deleted
    */
    public async GetGamesListsByListId(listId: UUID): Promise<GameListEntry[]> {

        const result = await this.query<GameListEntry>(
            `SELECT * FROM games_lists WHERE list_id = $1;`,
            [listId]
        );

        return result.rows;
    }

    /**
    * Method that will delete all the entries corresponding to the ids
    * 
    * @param id id to delete
    * @returns entrie that are deleted
    */
    public async GetLikedGamesList(listName: string, userId: UUID): Promise<GameListEntry[]> {

        const result = await this.query<GameListEntry>(
            `SELECT gl.game_id FROM games_lists gl
                JOIN lists l ON gl.list_id = l.id
                WHERE l.name = $1 AND l.user_id = $2;`,
            [listName, userId]
        );

        return result.rows;
    }

}
