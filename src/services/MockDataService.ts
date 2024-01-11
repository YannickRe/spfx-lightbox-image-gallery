import { SPFI } from "@pnp/sp";
import { IDataService } from "../models/IDataService";

export default class MockDataService implements IDataService {
  private _sp: SPFI;
  
  constructor(sp: SPFI) {
    this._sp = sp;
  }

  public getLists(): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
      return Promise.resolve([{
        Id: 1,
        Title: "List One",
        ParentWebUrl: "string",
        NavUrl: "string"
      }]);
  }

  public getFolderData(listName: string) : Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return Promise.resolve({
      Id: 1,
      Title: "string",
      ParentWebUrl: "string",
      NavUrl: "string"
    });
  }

  private getFoldersFromList(path: string): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return Promise.resolve();
  }

  private getFilesFromFolder(path: string): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return Promise.resolve();
  }
}