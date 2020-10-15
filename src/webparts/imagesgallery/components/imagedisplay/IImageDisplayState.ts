import { breadCrumbItem } from "../../../../models/breadCrumbItem.interface";
import { IImageItem } from "../../../../models/IImageItem.interface";

export interface IImageDisplayState {
    isOpen : boolean;
    breadCrumbState: breadCrumbItem[];
    currentbreadCrumbState: string;
    folderState: any[];
    photosState: IImageItem[];
    selectedImageIndex: number;
    amountColumnsState: number;
  }