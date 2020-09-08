import { IFolderInfo } from "@pnp/sp/folders";
import { IFileInfo } from "@pnp/sp/files";
import { ITreeBody } from "../interfaces/treeBody.interface";


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
                photo: file.ServerRelativeUrl
            });
        });
        return Promise.resolve(bodyObject);
    }

}

