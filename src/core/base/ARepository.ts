import { Pool, QueryResult, QueryResultRow } from "pg";
import { IEntry } from "./IEntry";
import { SuccessResponse } from "../";

export abstract class ARepository<MyEntry extends IEntry, ResponseModel extends SuccessResponse<any>> {
    protected readonly pool: Pool;
    protected abstract readonly tableName: string;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    /**
     * Method that will convert a database entry to a response model
     * 
     * This method wil convert an entry to a response model
     * If you want to convert a list of entries to a response model you can use this method in a map function
     *  
     * @param entry
     */
    abstract toModel(entry: MyEntry): ResponseModel;

    /**
     * method that will interact directly to the database
     * 
     * @param sql | slq query
     * @param params | parameters to pass to the query
     * @returns | QueryResult object
     */
    protected async query<R extends QueryResultRow>(sql: string, params?: any[]): Promise<QueryResult<R>> {
        return await this.pool.query<R>(sql, params);
    }


    /**
     * Method that will create an entry in the database
     * 
     * @param entry Entry to create | the field id will be ignored
     * @returns the created entry
     */
    public async create(entry: Omit<MyEntry, "id">): Promise<MyEntry> {
        const keys = Object.keys(entry).join(", ");
        const values = Object.values(entry);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const result = await this.query<MyEntry>(
            `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders}) RETURNING *`,
            values
        );

        return result.rows[0];
    }

    /**
     * Method that will update an entry using its id
     * 
     * @param id id of the entry to update
     * @param entry the entry can be partial, only the fields that you want to update
     * @returns the updated entry or null if the entry does not exist
     */
    public async update(id: MyEntry["id"], entry: Partial<MyEntry>): Promise<MyEntry | null> {
        const keys = Object.keys(entry);
        if (keys.length === 0) return null;

        const values = Object.values(entry);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

        const result = await this.query<MyEntry>(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
            [...values, id]
        );

        return result.rows[0] || null;
    }

    /**
     * Method that will find all the entries that match the column and value
     * 
     * @param column column to check
     * @param value value to match
     * @returns all the entries that match the column and value
     */
    public async findByColumn<T extends keyof MyEntry>(column: T, value: MyEntry[T]): Promise<MyEntry[]> {
        const result = await this.query<MyEntry>(
            `SELECT * FROM ${this.tableName} WHERE ${String(column)} = $1`,
            [value]
        );
        return result.rows;
    }

    /**
     * Method that will check if an entry exists in the database using a column and a value
     * 
     * @param column column to check
     * @param value value to match
     * @returns true if the entry exists, false otherwise
     */
    public async exists<T extends keyof MyEntry>(column: T, value: MyEntry[T]): Promise<boolean> {
        const result = await this.query<{ exists: boolean }>(
            `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE ${String(column)} = $1) AS exists`,
            [value]
        );
        return result.rows[0]?.exists ?? false;
    }

    /**
     * Method that will return all the entries in the database for a table
     * 
     * @returns all entries in the database for a table
     */
    public async getAll(): Promise<MyEntry[]> {
        //todo : add pagination and other param to make this method more generic
        // check also the query                                     
        const result = await this.query<MyEntry>(`SELECT * FROM ${this.tableName}`);
        return result.rows;
    }

    /**
     * Method that will delete all the entries corresponding to the ids
     * 
     * @param ids ids to delete
     * @returns all entries that are deleted
     */
    public async deleteByIds(ids: MyEntry["id"][]): Promise<MyEntry[]> {
        if (ids.length === 0) return [];

        const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
        const result = await this.query<MyEntry>(
            `DELETE FROM ${this.tableName} WHERE id IN (${placeholders}) RETURNING *`,
            ids
        );

        return result.rows;
    }
}
