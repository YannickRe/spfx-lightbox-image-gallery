import { IFolderInfo } from "@pnp/sp/folders"
import { Photo } from "react-bnb-gallery"
import { IPropertyPaneAccessor } from "@microsoft/sp-webpart-base"
import { IDataService } from "./interfaces/dataservice.interface"

export interface IImageDisplayWebPartProps {
    description: string;
    dataservice: IDataService;
    folders: IFolderInfo[],
    picLib: string,
    rootUrl: string,
    photos: Photo[],
    show: boolean,
    // openPropertypane: () => void,
    amountColumns: number,
    // dataUpdate: (folderUrl:string) => void

}