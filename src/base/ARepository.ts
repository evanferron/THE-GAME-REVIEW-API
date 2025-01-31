import { Pool, QueryResult, QueryResultRow } from "pg";
import { IEntry } from "./IEntry";
import { IResponseModel } from "./IResponse";

export abstract class ARepository<MyEntry extends IEntry> {
    protected readonly pool: Pool;
    protected readonly tableName: string;

    constructor(pool: Pool, tableName: string) {
        this.pool = pool;
        this.tableName = tableName;
    }

    abstract ToModel(entry: MyEntry): IResponseModel;

    // CRUD operations
    abstract Create(entry: MyEntry): MyEntry;
    abstract Update(entry: MyEntry): MyEntry;
    abstract Delete(entry: MyEntry): MyEntry;

    // method that will interact with database
    protected async query<R extends QueryResultRow>(sql: string, params?: any[]): Promise<QueryResult<R>> {
        return await this.pool.query<R>(sql, params);
    }

    public async getById(id: MyEntry["id"]): Promise<MyEntry | null> {
        const result = await this.query<MyEntry>(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows[0] || null;
    }

    public async getAll(): Promise<MyEntry[]> {
        const result = await this.query<MyEntry>(`SELECT * FROM ${this.tableName}`);
        return result.rows;
    }

    public async deleteById(id: MyEntry["id"]): Promise<MyEntry | null> {
        const result = await this.query<MyEntry>(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows[0] || null;
    }
}
