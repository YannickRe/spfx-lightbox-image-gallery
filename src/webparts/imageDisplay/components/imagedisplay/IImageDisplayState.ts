import { breadCrumbItem } from "../../interfaces/breadCrumbItem.interface";
import { IImageItem } from "../../interfaces/IImageItem.interface";

export interface IImageDisplayState {
    isOpen : boolean;
    breadCrumbState: breadCrumbItem[];
    currentbreadCrumbState: string;
    folderState: any[];
    photosState: IImageItem[];
    selectedImageIndex: number;
    amountColumnsState: number;
  }