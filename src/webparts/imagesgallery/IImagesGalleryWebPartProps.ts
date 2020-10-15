import { IFolderInfo } from "@pnp/sp/folders"
import { IDataService } from "../../models/dataservice.interface"
import { IImageItem } from "../../models/IImageItem.interface"

export interface IImagesGalleryWebPartProps {
    description: string;
    dataservice: IDataService;
    folders: IFolderInfo[],
    picLib: string,
    rootUrl: string,
    photos: IImageItem[],
    show: boolean,
    amountColumns: number,
}