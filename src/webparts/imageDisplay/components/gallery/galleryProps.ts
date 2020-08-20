import { Photo } from "react-bnb-gallery";

export interface IGalleryProps {
  photos: Photo[];
  containerWidth: string;
  containerHeight: string;
  amountColumns: number;
  imgClicked:  (_imgIndex: number) => void;
}
