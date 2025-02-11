import { Config, IEntry, IResponse, SuccessResponse } from "../";


export abstract class AController {
    protected readonly config: Config;


    constructor() {
        this.config = Config.getInstance();
    }

    // /**
    //  * Method that will convert a database entry to a response model
    //  * 
    //  * This method wil convert an entry to a response model
    //  * If you want to convert a list of entries to a response model you can use this method in a map function
    //  *  
    //  * @param entry
    //  */
    // protected toModel<EntryType extends IEntry, ResponseType extends IResponse>(entry: EntryType): SuccessResponse<ResponseType> {
    //     return {
    //         success: true,
    //         data: entry as unknown as ResponseType,
    //     };
    // }
}