import { IFolderInfo } from "@pnp/sp/folders";
import { IImageItem } from "./IImageItem.interface";

export interface ITreeBody {
    folders: IFolderInfo[];
    photos: IImageItem[];
}