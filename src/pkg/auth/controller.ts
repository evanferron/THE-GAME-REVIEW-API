import { Config } from "../../config/config";
import { AController } from "../AController";
import { Request, Response} from "express";


export class AuthController extends AController {
    constructor(config: Config){
        super(config);
    }

    public login(req: Request,res: Response){
        // TODO: Implement login    
    }

    public register(req: Request,res: Response){
        // TODO: Implement register    
    }
} 