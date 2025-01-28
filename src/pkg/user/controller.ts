import { Config } from "../../config/config";
import { AController } from "../AController";
import { Request, Response} from "express";


export class UserController extends AController {
    constructor(config: Config){
        super(config);
    }

    public getAllUsers(req: Request,res: Response){
        // const users = this.getUserRepository().GetAll();
    }

    public getUserById(req: Request,res: Response){
        // const user = this.getUserRepository().GetById(req.params.id);
    }

    public createUser(req: Request,res: Response){
        // const user = this.getUserRepository().Create(req.body);
    }

    public updateUser(req: Request,res: Response){
        // ! check if user is authorized to update
        // const user = this.getUserRepository().Update(req.body);
    }

    public deleteUser(req: Request,res: Response){
        // ! check if user is authorized to update
        // const user = this.getUserRepository().Delete(req.body);
    }
}