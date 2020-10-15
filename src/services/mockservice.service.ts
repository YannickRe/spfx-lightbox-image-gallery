import { IDataService } from "../models/dataservice.interface";
import { IListAddResult } from "@pnp/sp/lists/types";

export default class MockDataService implements IDataService {


  public checkIfListAlreadyExists(listName: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  public GetSPLists(): Promise<any> {
      return Promise.resolve([{
        Id: 1,
        Title: "List One",
        ParentWebUrl: "string",
        NavUrl: "string"
      }]);

  };

  public createList(listName: string): Promise<any> {
    return Promise.resolve({
      Id: 1,
      Title: "string",
      ParentWebUrl: "string",
      NavUrl: "string"
    });
  }

  public getPicturesFolder(listName: string) : Promise<any> {
    return Promise.resolve({
      Id: 1,
      Title: "string",
      ParentWebUrl: "string",
      NavUrl: "string"
    });
  }

  public getFoldersFromList(path: string): Promise<any> {
    return Promise.resolve();
  };

  public getFilesFromFolder(path: string): Promise<any> {
    return Promise.resolve();
  }

    
}