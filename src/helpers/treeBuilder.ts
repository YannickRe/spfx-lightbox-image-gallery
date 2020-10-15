import { IFolderInfo } from "@pnp/sp/folders";
import { IFileInfo } from "@pnp/sp/files";
import { ITreeBody } from "../models/treeBody.interface";


export default class TreeBuilder {

    public async buildImageTree(folders: IFolderInfo[], files: IFileInfo[], pageurl: string) : Promise<any>{
        let bodyObject: ITreeBody = {
            folders: [], 
            photos: []
        };
        folders.forEach((folder, i) => {
            // IsWOPIEnabled = false => only folders that users created
            if(!folder.IsWOPIEnabled && folder.ItemCount > 0){
                bodyObject.folders.push(folder);
            }
        });
        files.forEach((file, i) => {
            bodyObject.photos.push({
                url: file.ServerRelativeUrl,
                title: file.Name
            });
        });
        return Promise.resolve(bodyObject);
    }

}

