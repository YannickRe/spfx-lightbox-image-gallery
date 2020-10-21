import { IFileInfo } from "@pnp/sp/files";
import { IFolderInfo } from "@pnp/sp/folders";

export interface IFolderData {
    folder: IFolderInfo;
    subFolders: IFolderInfo[];
    files: IFileInfo[];
}