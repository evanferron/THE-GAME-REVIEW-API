import { Pool } from "pg";
import { UserRepository } from "../database/dbmodel/user";
import { ReviewRepository } from "../database/dbmodel/review";

export class Config {
    
    public reviewRepository: ReviewRepository;
    public userRepository: UserRepository;
    private pool: Pool;

    constructor() {
        // TODO : Edit those variables to match your database configuration
        this.pool = new Pool({
            user: "your_db_user",
            host: "localhost",
            database: "your_db_name",
            password: "your_db_password",
            port: 5432,
        })
        
        // TODO : Initialize repositories here
        this.reviewRepository = new ReviewRepository(this.pool); 
        this.userRepository = new UserRepository(this.pool);
    }

}