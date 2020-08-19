import { IListAddResult } from "@pnp/sp/lists/types";

export interface IDataService {
 getPicturesFolder(listName: string): Promise<any>;
 getFoldersFromList(path: string): Promise<any>;
 getFilesFromFolder(path: string): Promise<any>;
 GetSPLists(): Promise<any>;
 checkIfListAlreadyExists(listName: string): Promise<boolean>;
 createList(listName: string): Promise<any>;
}


// onclick?: () => ImageData;