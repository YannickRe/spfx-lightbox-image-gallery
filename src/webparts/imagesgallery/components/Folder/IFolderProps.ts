import { IFolderInfo } from "@pnp/sp/folders";

export interface IFolderProps{
    folderInfo: IFolderInfo;
    onClick: (folderInfo: IFolderInfo) => void;
}