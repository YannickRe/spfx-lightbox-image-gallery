import { IImageItem } from "../../interfaces/IImageItem.interface";

export interface IGalleryProps {
  photos: IImageItem[];
  amountColumns: number;
  imgClicked:  (_imgIndex: number) => void;
}
