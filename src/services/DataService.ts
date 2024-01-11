import { IDataService } from "../models/IDataService";

import { SPFI } from "@pnp/sp";
import "@pnp/sp/files";
import "@pnp/sp/lists";
import "@pnp/sp/folders";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import { IFolderInfo, IFolder } from "@pnp/sp/folders";
import { IFileInfo } from "@pnp/sp/files";
import { IListInfo } from "@pnp/sp/lists";
import { IFolderData } from "../models/IFolderData";

export default class DataService implements IDataService {
  private _sp: SPFI;

  constructor(sp: SPFI) {
    this._sp = sp;
  }

  public async getLists(): Promise<IListInfo[]> {
      let lists = await this._sp.web.lists.select("Title", "BaseTemplate", "RootFolder").expand('RootFolder')();
      lists = lists.filter(item => item.BaseTemplate === 109 || item.BaseTemplate === 101);
      return lists;
  }

  public async getFolderData(folderUniqueId: string) : Promise<IFolderData> {
    const folder = this._sp.web.getFolderById(folderUniqueId);
    const folderInfo = await folder();
    const subFolders = await this.getSubFolders(folder);
    const files = await this.getFilesFromFolder(folder);

    return {
      folder: folderInfo,
      subFolders: subFolders,
      files: files
    };
  }

  private async getSubFolders(folder: IFolder): Promise<IFolderInfo[]> {
      let folders = await folder.folders.orderBy("TimeCreated", false)();
      folders = folders.filter(sf => !sf.IsWOPIEnabled && sf.ItemCount > 0);
      return folders;
  }

  private async getFilesFromFolder(folder: IFolder): Promise<IFileInfo[]> {
      let files = await folder.files.orderBy("TimeCreated", true)();
      files = files.filter(fileData => ["jpg","jpeg","png"].indexOf(fileData.Name.toLocaleLowerCase().split('.').pop()) !== -1);
      return files;
  } 
}