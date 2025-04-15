import { Config, getUserFromRequest, AController, ValidationError, getResponse } from "../../core";
import { NextFunction, Request, Response } from "express";
import { ListEntry } from "../../database/models/list";
import { MultipleListsResponse, ListResponse, SingleListResponse } from "./response";


export class ListController extends AController {

    public getAllLists = async (req: Request, res: Response, next: NextFunction) => {
        try {
           
            const foundLists = await this.config.listRepository.getAll();

            if (foundLists.length === 0) {
                throw new ValidationError("No lists found");
            }

            const lists: ListResponse[] = foundLists.map(list => ({
                id: list.id,
                userId: list.user_id,
                name: list.name,
                description: list.description,
                isPrivate: list.is_private,
                createdAt: new Date(list.created_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleListsResponse>({
                success: true,
                data: lists
            }));

        } catch (err) {
            next(err);
        }
    }

    public getListById = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const list = {
               id: req.body.id,
           } as ListEntry;

           const foundLists = await this.config.listRepository.findByColumn("id", list.id);

           const lists: ListResponse[] = foundLists.map(list => ({
                id: list.id,
                userId: list.user_id,
                name: list.name,
                description: list.description,
                isPrivate: list.is_private,
                createdAt: new Date(list.created_at).toISOString(),
           }));

           res.status(201).json(getResponse<SingleListResponse>({
               success: true,
               data: lists[0]
           }));

       } catch (err) {
           next(err);
       } 
   }

   public getListsByUserId = async (req: Request, res: Response, next: NextFunction) => {
        try {
        
            const list = {
                user_id: req.body.user_id,
            } as ListEntry;

            const foundLists = await this.config.listRepository.getListsByUser(list.user_id);

            const lists: ListResponse[] = foundLists.map(list => ({
                id: list.id,
                userId: list.user_id,
                name: list.name,
                description: list.description,
                isPrivate: list.is_private,
                createdAt: new Date(list.created_at).toISOString(),
            }));

            res.status(201).json(getResponse<MultipleListsResponse>({
                success: true,
                data: lists
            }));

        } catch (err) {
            next(err);
        }
    }

    public createList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const list = {
                user_id: getUserFromRequest(req).userId,
                name: req.body.name,
                description: req.body.description,
                is_private: req.body.is_private,
                created_at: new Date(),
            } as ListEntry;

            const createdList = await this.config.listRepository.create(list);

            res.status(201).json(getResponse<ListResponse>({
                id: createdList.id,
                userId: createdList.user_id,
                name: createdList.name,
                description: createdList.description,
                isPrivate: createdList.is_private,
                createdAt: new Date(createdList.created_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }

    public updateList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const list = {
                id: req.body.id,
                name: req.body.name,
                description: req.body.description,
                is_private: req.body.is_private,
            } as ListEntry;

            const updatedList = await this.config.listRepository.update(list.id, list);

            if (updatedList == null) {
                throw new ValidationError("No List found");
            }
            res.status(201).json(getResponse<ListResponse>({
                id: updatedList.id,
                userId: updatedList.user_id,
                name: updatedList.name,
                description: updatedList.description,
                isPrivate: updatedList.is_private,
                createdAt: new Date(updatedList.created_at).toISOString(),
            }));
        } catch (err) {
            next(err);
        }
    }

    public deleteList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const list = {
                id: req.body.id,
            } as ListEntry;

            const deletedList = await this.config.listRepository.deleteList(list.id);

            if (deletedList.length === 0) {
                throw new ValidationError("No List found");
            }

            res.status(200).json(getResponse<ListResponse>({
                id: deletedList[0].id,
                userId: deletedList[0].user_id,
                name: deletedList[0].name,
                description: deletedList[0].description,
                isPrivate: deletedList[0].is_private,
                createdAt: new Date(deletedList[0].created_at).toISOString(),
            }));
       } catch (err) {
            next(err);
       }
   }
}