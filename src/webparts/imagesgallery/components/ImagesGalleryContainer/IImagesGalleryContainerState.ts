import { IFolderData } from "../../../../models/IFolderData";
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb";
import { IFolderInfo } from "@pnp/sp/folders";

export interface IImagesGalleryContainerState {
    isOpen : boolean;
    hasError: boolean;
    errorMessage: string;
    areResultsLoading: boolean;
    selectedImageIndex: number;
    folderData: IFolderData;
    breadCrumb: IFolderInfo[];
  }