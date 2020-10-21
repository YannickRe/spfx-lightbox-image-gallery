import { breadCrumbItem } from "../../../../models/breadCrumbItem.interface";
import { IImageItem } from "../../../../models/IImageItem.interface";
import { IFolderInfo } from '@pnp/sp/folders';

export interface IImagesGalleryContainerState {
    isOpen : boolean;
    hasError: boolean;
    errorMessage: string;
    areResultsLoading: boolean;
    folders: IFolderInfo[];
    photos: IImageItem[];
    selectedImageIndex: number;
    breadCrumb: breadCrumbItem[];
  }