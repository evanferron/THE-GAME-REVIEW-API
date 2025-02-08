import { Config } from "../";
import { ReviewRepository } from "../../database/repositories/review";
import { UserRepository } from "../../database/repositories/user";


export abstract class AController {
    protected readonly getUserRepository: () => UserRepository;
    protected readonly getReviewRepository: () => ReviewRepository;


    constructor(config: Config) {
        this.getUserRepository = config.getUserRepository;
        this.getReviewRepository = config.getReviewRepository;
    }
}