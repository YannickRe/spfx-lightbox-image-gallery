import { IFolderData } from "../../../../models/IFolderData";
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb";
import { IFolderInfo } from "@pnp/sp/folders";

export interface IImagesGalleryContainerState {
    hasError: boolean;
    errorMessage: string;
    areResultsLoading: boolean;
    folderData: IFolderData;
    breadCrumb: IFolderInfo[];
  }