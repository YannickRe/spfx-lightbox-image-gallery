import { IDataService } from "../models/IDataService";
import { sp } from "@pnp/pnpjs";
import { IFolderInfo, IFolder } from "@pnp/sp/folders";
import { IFileInfo, IFile } from "@pnp/sp/files";
import { IListInfo } from "@pnp/sp/lists";
import { IFolderData } from "../models/IFolderData";

export default class DataService implements IDataService {
    public async getLists(): Promise<IListInfo[]> {
        let lists = await sp.web.lists.select("Title", "BaseTemplate", "RootFolder").expand('RootFolder').get();
        lists = lists.filter(item => item["BaseTemplate"] === 109 || item["BaseTemplate"] === 101);
        return lists;
    }

    public async getFolderData(folderUniqueId: string) : Promise<IFolderData> {
      let folder = await sp.web.getFolderById(folderUniqueId);
      let folderInfo = await folder.get();
      let subFolders = await this.getSubFolders(folder);
      let files = await this.getFilesFromFolder(folder);

      return {
        folder: folderInfo,
        subFolders: subFolders,
        files: files
      };
    }
  
    private async getSubFolders(folder: IFolder): Promise<IFolderInfo[]> {
        let folders = await folder.folders.orderBy("TimeCreated", false).get();
        folders = folders.filter(sf => !sf.IsWOPIEnabled && sf.ItemCount > 0);
        return folders;
    }

    private async getFilesFromFolder(folder: IFolder): Promise<IFileInfo[]> {
        let files = await folder.files.orderBy("TimeCreated", true).get();
        files = files.filter(fileData => ["jpg","jpeg","png"].indexOf(fileData.Name.toLocaleLowerCase().split('.').pop()) !== -1);
        return files;
    } 
}