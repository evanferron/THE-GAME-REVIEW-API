import { Pool } from "pg";
import { UserRepository } from "../../database/repositories/user";
import { ReviewRepository } from "../../database/repositories/review";

export class Config {
    private static instance: Config;

    private readonly pool: Pool;

    public readonly reviewRepository: ReviewRepository;
    public readonly userRepository: UserRepository;

    private constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

        // TODO : Initialize repositories here
        this.reviewRepository = new ReviewRepository(this.pool);
        this.userRepository = new UserRepository(this.pool);
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
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