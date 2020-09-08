import { breadCrumbItem } from "../../interfaces/breadCrumbItem.interface";
import { Photo } from "react-bnb-gallery";

export interface IImageDisplayState {
    isOpen : boolean;
    breadCrumbState: breadCrumbItem[];
    currentbreadCrumbState: string;
    folderState: any[];
    photosState: Photo[];
    selectedImageIndex: number;
    amountColumnsState: number;
  }