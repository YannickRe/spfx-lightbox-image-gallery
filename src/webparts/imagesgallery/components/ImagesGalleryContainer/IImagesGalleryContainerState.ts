import { IFolderData } from "../../../../models/IFolderData";
import { IFolderInfo } from "@pnp/sp/folders";

export interface IImagesGalleryContainerState {
    hasError: boolean;
    errorMessage: string;
    areResultsLoading: boolean;
    folderData: IFolderData;
    breadCrumb: IFolderInfo[];
  }