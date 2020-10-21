import { IDataService } from "../models/IDataService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/pnpjs";
import { IFolderInfo, IFolder } from "@pnp/sp/folders";
import { IFileInfo } from "@pnp/sp/files";
import TreeBuilder from "../helpers/treeBuilder";
import { ITreeBody } from "../models/treeBody.interface";
import { IListInfo } from "@pnp/sp/lists";

export default class DataService implements IDataService {
    private _treeBuilder: TreeBuilder;

    constructor(protected context: WebPartContext){
      this._treeBuilder = new TreeBuilder();
    }

    public async getSPLists(): Promise<IListInfo[]> {
        let lists = await sp.web.lists.select("Title", "BaseTemplate", "RootFolder").expand('RootFolder').get();
        let filtered = lists.filter((item) => {
          return item["BaseTemplate"] === 109 || item["BaseTemplate"] === 101;
        })
        return filtered;
    };

    public async getPicturesFolder(folderUniqueId: string) : Promise<ITreeBody> {
      let rootFolder = await sp.web.getFolderById(folderUniqueId);
      let subFolders = await this.getSubFolders(rootFolder);
      let files = await this.getFilesFromFolder(rootFolder);
      let pageurl = this.context.pageContext.web.absoluteUrl + "/" + folderUniqueId + "/";
      let body = await this._treeBuilder.buildImageTree(subFolders, files, pageurl);
      return body;
    }
  
    private async getSubFolders(folder: IFolder): Promise<IFolderInfo[]> {
        return await folder.folders();
    };

    private async getFilesFromFolder(folder: IFolder): Promise<IFileInfo[]> {
        let files = await folder.files();
        let filteredFiles = files.filter((fileData, i)=> {
          return ["jpg","jpeg","png"].indexOf(fileData.Name.toLocaleLowerCase().split('.').pop()) !== -1
        })
        return filteredFiles;
    } 
}