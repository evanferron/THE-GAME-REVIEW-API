import { Config } from "../config/config";
import { UserRepository } from "../database/repositories/user";


export abstract class AController {
    protected readonly getUserRepository: () => UserRepository;
    protected readonly getReviewRepository: () => UserRepository;


    constructor(config: Config) {
        this.getUserRepository = config.getUserRepository;
        this.getReviewRepository = config.getReviewRepository;
    }
}