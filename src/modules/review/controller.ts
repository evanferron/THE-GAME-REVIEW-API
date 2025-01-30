import { Config } from "../../config/config";
import { AController } from "../../base/AController";
import { Request, Response } from "express";


export class ReviewController extends AController {
    constructor(config: Config) {
        super(config);
    }

    public getAllReviews(req: Request, res: Response) {
    }

    public getReviewById(req: Request, res: Response) {
    }

    public createReview(req: Request, res: Response) {
    }

    public updateReview(req: Request, res: Response) {
    }

    public deleteReview(req: Request, res: Response) {
    }
}