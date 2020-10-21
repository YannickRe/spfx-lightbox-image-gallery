import { IListInfo } from "@pnp/sp/lists";
import { ITreeBody } from "./treeBody.interface";

export interface IDataService {
 getPicturesFolder(folderUniqueId: string): Promise<ITreeBody>;
 getSPLists(): Promise<IListInfo[]>;
}