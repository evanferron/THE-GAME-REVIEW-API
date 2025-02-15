import { Config, AController } from "../../core";
import { Request, Response } from "express";


export class UserController extends AController {

    public getAllUsers = async (req: Request, res: Response) => {
        // const users = this.getUserRepository().GetAll();
    }

    public getUserById = async (req: Request, res: Response) => {
        // const user = this.getUserRepository().GetById(req.params.id);
    }

    public createUser = async (req: Request, res: Response) => {
        // const user = this.getUserRepository().Create(req.body);
    }

    public updateUser = async (req: Request, res: Response) => {
        // ! check if user is authorized to update
        // const user = this.getUserRepository().Update(req.body);
    }

    public deleteUser = async (req: Request, res: Response) => {
        // ! check if user is authorized to update
        // const user = this.getUserRepository().Delete(req.body);
    }
}