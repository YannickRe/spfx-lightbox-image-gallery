import { IFolderInfo } from "@pnp/sp/folders";

export interface IFolderIconProps{
    items: IFolderInfo[];
    folderClicked: (_folderData: IFolderInfo) => void;
}