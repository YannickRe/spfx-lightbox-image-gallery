import { IFolderInfo } from "@pnp/sp/folders"
// import { IPropertyPaneAccessor } from "@microsoft/sp-webpart-base"
import { IDataService } from "./interfaces/dataservice.interface"
import { IImageItem } from "./interfaces/IImageItem.interface"

export interface IImageDisplayWebPartProps {
    description: string;
    dataservice: IDataService;
    folders: IFolderInfo[],
    picLib: string,
    rootUrl: string,
    photos: IImageItem[],
    show: boolean,
    // openPropertypane: () => void,
    amountColumns: number,
    // dataUpdate: (folderUrl:string) => void

}