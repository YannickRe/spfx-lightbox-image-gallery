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
      return sp.web.lists.getByTitle(listName).get().then((listResult) => {
        if (listResult) {
          return Promise.resolve(true);
        }
      })
        .catch((e) => {
          if (e.status === 404) {
            return Promise.resolve(false);
          }
          else {
            return ErrorHandler.handleError(e);
          }
        });
    }

    public async GetSPLists(): Promise<any> {
      // only return picture libarys basetemplate = 109
      return sp.web.lists.get()
        .then((lists: any) => {
          let filtered = lists.filter((item) => {
            return item["BaseTemplate"] === 109;
          })
          return Promise.resolve(filtered);
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error);
        });
    };

    public async createList(listName: string): Promise<IListAddResult> {
      return sp.web.lists.add(listName, "Picture Library for the images webpart", 109, false)
        .then((listResult: any) => {
          return Promise.resolve(listResult);
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error);
        });
    }

    public async getPicturesFolder(listName: string) : Promise<ITreeBody> {
      // let list = sp.web.lists.getByTitle(listName);
      // let foldersPromise = new Promise<any>((resolve, reject) => {
      //   return this.getFoldersFromList(listName).then((data) => {
      //     resolve({folders: data});
      //   }).catch((data) => {
      //     reject({error: data});
      //   });
      // });
      // let filesPromise = new Promise<any>((resolve, reject) => {
      //   return this.getFilesFromFolder(listName).then((data) => {
      //     resolve({files: data});
      //   }).catch((data) => {
      //     reject({error: data});
      //   });
      // });

      let foldersPromise = await this.getFoldersFromList(listName);
      let filesPromise = await this.getFilesFromFolder(listName);
      let pageurl = this.context.pageContext.web.absoluteUrl + "/" + listName + "/";
      let body = await this._treeBuilder.buildImageTree(foldersPromise, filesPromise, pageurl);
      return body;
      
      // return Promise.all([foldersPromise, filesPromise]).then((values) => {
      //   console.log(values);
      //   let pageurl = this.context.pageContext.web.absoluteUrl + "/" + listName + "/";
      //   return this._treeBuilder.buildImageTree(values[0].folders, values[1].files, pageurl).then((body: ITreeBody) => {
      //     console.log(body);
      //     return Promise.resolve(body);
      //   });
      // });
    }
  
    public async getFoldersFromList(path: string): Promise<IFolderInfo[]> {
      try{
        let folders = await sp.web.getFolderByServerRelativePath(path).folders();
        return Promise.resolve(folders);
      }catch(error){
        return Promise.reject(error);
      }

      // return sp.web.getFolderByServerRelativePath(path).folders().then((folders: IFolderInfo[]) => {
      //   return Promise.resolve(folders);
      // }).catch((error) => {
      //   return Promise.reject(error);
      // });
      
    };

    public async getFilesFromFolder(path: string): Promise<IFileInfo[]> {
      try{
        let files = await sp.web.getFolderByServerRelativePath(path).files();
        return Promise.resolve(files);
      }catch(error){
        return Promise.reject(error);
      }
      // return sp.web.getFolderByServerRelativePath(path).files().then((files: IFileInfo[]) => {
      //   return Promise.resolve(files);
      // }).catch((error) => {
      //   return Promise.reject(error);
      // });
    } 
}