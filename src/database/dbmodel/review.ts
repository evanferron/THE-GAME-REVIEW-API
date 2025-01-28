class ReviewRepository extends ARepository<ReviewEntry>{
    ToModel(): IResponseModel {
        throw new Error("Method not implemented.");
    }
    GetAll(): ReviewEntry[] {
        throw new Error("Method not implemented.");
    }
    GetById(id: number): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    Create(entry: ReviewEntry): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    Update(entry: ReviewEntry): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    Delete(entry: ReviewEntry): ReviewEntry {
        throw new Error("Method not implemented.");
    }
    
}

class ReviewEntry extends AEntry{
    
}