import { Photo } from "react-bnb-gallery";

export interface IImageProps {
  photo: Photo;
  index: number;
  photoClicked:  (index: number) => void;
}
