import { IListInfo } from "@pnp/sp/lists";
import { IFolderData } from "./IFolderData";

export interface IDataService {
 getFolderData(folderUniqueId: string): Promise<IFolderData>;
 getLists(): Promise<IListInfo[]>;
}