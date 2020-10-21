import { IDataService } from "../models/IDataService";

export default class MockDataService implements IDataService {

  public getSPLists(): Promise<any> {
      return Promise.resolve([{
        Id: 1,
        Title: "List One",
        ParentWebUrl: "string",
        NavUrl: "string"
      }]);

  };

  public getPicturesFolder(listName: string) : Promise<any> {
    return Promise.resolve({
      Id: 1,
      Title: "string",
      ParentWebUrl: "string",
      NavUrl: "string"
    });
  }

  private getFoldersFromList(path: string): Promise<any> {
    return Promise.resolve();
  };

  private getFilesFromFolder(path: string): Promise<any> {
    return Promise.resolve();
  }

    
}