import { IImageItem } from "../../../../../models/IImageItem.interface";

export interface IImageProps {
  photo: IImageItem;
  index: number;
  photoClicked:  (index: number) => void;
}
