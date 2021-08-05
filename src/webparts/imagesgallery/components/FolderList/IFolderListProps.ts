import { IFolderInfo } from "@pnp/sp/folders";

export interface IFolderListProps {
  foldersInfo: IFolderInfo[];
  onClick: (folderInfo: IFolderInfo) => void;
}