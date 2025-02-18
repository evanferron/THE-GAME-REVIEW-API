import { Config } from "../";


export abstract class AController {
    protected readonly config: Config;


    constructor() {
        this.config = Config.getInstance();
    }
}