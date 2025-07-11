import { Pool } from "pg";
import { UserRepository } from "../../database/repositories/user";
import { ReviewRepository } from "../../database/repositories/review";
import { FollowRepository } from "../../database/repositories/follow";
import { ListRepository } from "../../database/repositories/list";
import { GameListRepository } from "../../database/repositories/gameList";
import { TwitchService } from "..";

export class Config {
    private static instance: Config;

    private readonly pool: Pool;

    public readonly reviewRepository: ReviewRepository;
    public readonly userRepository: UserRepository;
    public readonly followRepository: FollowRepository;
    public readonly listRepository: ListRepository;
    public readonly gameListRepository: GameListRepository;
    public readonly twitchService: TwitchService;

    private constructor() {
        this.pool = new Pool({
            connectionString: process.env.DB_HOST,
            // port: parseInt(process.env.DB_PORT || '5432'),
            // user: process.env.DB_USER,
            // password: process.env.DB_PASSWORD,
            // database: process.env.DB_NAME,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
            ssl: { rejectUnauthorized: false },
        })
        this.pool.on("error", (err) => {
            console.error("Unexpected database error:", err);
        });

        this.reviewRepository = new ReviewRepository(this.pool);
        this.userRepository = new UserRepository(this.pool);
        this.followRepository = new FollowRepository(this.pool);
        this.listRepository = new ListRepository(this.pool);
        this.gameListRepository = new GameListRepository(this.pool);

        this.twitchService = new TwitchService();
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    public async testConnection() {
        try {
            const connection = await this.pool.connect();
            console.log("Connected to PostgreSQL database!");
            connection.release();
        } catch (error) {
            console.error("Error connecting to PostgreSQL:", error);
        }
    }
}