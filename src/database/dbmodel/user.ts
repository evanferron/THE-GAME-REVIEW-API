class UserRepository extends ARepository<UserEntry>{
    ToModel(): IResponseModel {
        throw new Error("Method not implemented.");
    }
    GetAll(): UserEntry[] {
        throw new Error("Method not implemented.");
    }
    GetById(id: number): UserEntry {
        throw new Error("Method not implemented.");
    }
    Create(entry: UserEntry): UserEntry {
        throw new Error("Method not implemented.");
    }
    Update(entry: UserEntry): UserEntry {
        throw new Error("Method not implemented.");
    }
    Delete(entry: UserEntry): UserEntry {
        throw new Error("Method not implemented.");
    }
    
}

class UserEntry extends AEntry{
    
}