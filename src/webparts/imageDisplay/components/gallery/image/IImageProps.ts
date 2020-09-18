import { IImageItem } from "../../../interfaces/IImageItem.interface";

export interface IImageProps {
  photo: IImageItem;
  index: number;
  photoClicked:  (index: number) => void;
}
