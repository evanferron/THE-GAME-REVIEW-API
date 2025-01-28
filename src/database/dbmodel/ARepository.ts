abstract class ARepository<T extends AEntry>{
    // todo : add a static variable that allow to access the database
    static db: any;

    abstract ToModel(): IResponseModel;

    // CRUD operations
    abstract GetAll(): AEntry[];
    abstract GetById(id: number): AEntry;
    abstract Create(entry: AEntry): AEntry;
    abstract Update(entry: AEntry): AEntry;
    abstract Delete(entry: AEntry): AEntry;

}

abstract class AEntry{     
}