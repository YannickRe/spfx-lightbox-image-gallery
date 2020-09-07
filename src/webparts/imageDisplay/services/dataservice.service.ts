import { IDataService } from "../interfaces/dataservice.interface";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/pnpjs";
import ErrorHandler from "../helpers/errorhandler";
import { IList } from '../interfaces/list.interface';
import { IItems } from "@pnp/sp/items";
import { IFolderInfo } from "@pnp/sp/folders";
import { IFileInfo } from "@pnp/sp/files";
import TreeBuilder from "../helpers/treeBuilder";
import { ITreeBody } from "../interfaces/treeBody.interface";
import { IListAddResult } from "@pnp/sp/lists/types";

export default class DataService implements IDataService {
    private _treeBuilder: TreeBuilder;

    constructor(protected context: WebPartContext){
      this._treeBuilder = new TreeBuilder();
    }

    public async checkIfListAlreadyExists(listName: string): Promise<boolean> {
      try{
        let list = await sp.web.lists.getByTitle(listName).get();
        if (list) {
          return Promise.resolve(true);
        }
      } catch(error){
        if (error.status === 404) {
          return Promise.resolve(false);
        }
        else {
          return ErrorHandler.handleError(error);
        }
      }
    }

    public async GetSPLists(): Promise<any> {
      // only return picture libarys basetemplate = 109 od doc Lib 101
      try{
        let lists = await sp.web.lists.get();
        let filtered = lists.filter((item) => {
          return item["BaseTemplate"] === 109 || item["BaseTemplate"] === 101;
        })
        return Promise.resolve(filtered);
      } catch(error) {
        return Promise.reject(error);
      }
    };

    public async createList(listName: string): Promise<IListAddResult> {
      try{
        let listResult = await sp.web.lists.add(listName, "Picture Library for the images webpart", 109, false);
        return listResult;
      }catch (error){
        return Promise.reject(error);
      }
    }

    public async getPicturesFolder(listName: string) : Promise<ITreeBody> {
      let foldersPromise = await this.getFoldersFromList(listName);
      let filesPromise = await this.getFilesFromFolder(listName);
      let pageurl = this.context.pageContext.web.absoluteUrl + "/" + listName + "/";
      let body = await this._treeBuilder.buildImageTree(foldersPromise, filesPromise, pageurl);
      return body;
      
    }
  
    public async getFoldersFromList(path: string): Promise<IFolderInfo[]> {
      try{
        let folders = await sp.web.getFolderByServerRelativePath(path).folders();
        return Promise.resolve(folders);
      }catch(error){
        return Promise.reject(error);
      }
      
    };

    public async getFilesFromFolder(path: string): Promise<IFileInfo[]> {
      try{
        let files = await sp.web.getFolderByServerRelativePath(path).files();
        let filteredFiles = files.filter((fileData, i)=> {
          return ["jpg","jpeg","png"].includes(fileData.Name.toLocaleLowerCase().split('.').pop())
        })
        return Promise.resolve(filteredFiles);
      }catch(error){
        return Promise.reject(error);
      }
    } 
}