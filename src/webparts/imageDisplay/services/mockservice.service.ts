import { IDataService } from "../interfaces/dataservice.interface";
import { IList } from '../interfaces/list.interface';

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

  public createList(listName: string): Promise<IList> {
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