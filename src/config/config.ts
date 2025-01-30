import { Pool } from "pg";
import { UserRepository } from "../database/repositories/user";
import { ReviewRepository } from "../database/repositories/review";

export class Config {
    // ! When you add a new repository, you need to add a getter for it and edit the AController class
    public reviewRepository: ReviewRepository;
    public userRepository: UserRepository;
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

        // TODO : Initialize repositories here
        this.reviewRepository = new ReviewRepository(this.pool, "review");
        this.userRepository = new UserRepository(this.pool, "user");
    }

    // Those repository getter allosw to simulates pointers to the repositories
    public getReviewRepository(): ReviewRepository {
        return this.reviewRepository;
    }

    public getUserRepository(): UserRepository {
        return this.userRepository;
    }

    public async testConnection() {
        try {
            const client = await this.pool.connect();
            console.log("Connected to PostgreSQL database!");
            client.release();  // Libération de la connexion après l'utilisation
        } catch (error) {
            console.error("Error connecting to PostgreSQL:", error);
        }
    }
}