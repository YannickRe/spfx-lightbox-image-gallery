import { IFolderInfo } from "@pnp/sp/folders";
import { IFileInfo } from "@pnp/sp/files";
import { ITreeBody } from "../interfaces/treeBody.interface";

import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb";

export default class TreeBuilder {

    public buildImageTree(folders: IFolderInfo[], files: IFileInfo[], pageurl: string) : Promise<any>{
        
        let bodyObject: ITreeBody = {
            folders: [], 
            photos: [], 
            breadcrumb: []};

        // { text: 'Files', key: 'Files', onClick: _onBreadcrumbItemClicked },

        folders.forEach((folder, i) => {
            // IsWOPIEnabled = false => only folders that users created
            if(!folder.IsWOPIEnabled && folder.ItemCount > 0){
                bodyObject.breadcrumb.push({text: folder.Name, key:i.toString(), onClick: (ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) => { console.log(`Breadcrumb item with key "${item.text}" has been clicked.`); }});
                bodyObject.folders.push(folder);
            }
        });
        files.forEach((file, i) => {
            // bodyObject.photos.push({photo: pageurl + file.Name});
            bodyObject.photos.push({
                photo: file.ServerRelativeUrl
                // src: pageurl + file.Name,
                // thumbnail: pageurl + file.Name
            });
        });
        // this will ensure we can view data in following format: object.key
        // let returnData = Object.assign({}, ...bodyObject); 
        return Promise.resolve(bodyObject);
    }

}

