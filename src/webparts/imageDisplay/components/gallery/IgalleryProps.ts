import { Photo } from "react-bnb-gallery";

export interface IGalleryProps {
  photos: Photo[];
  amountColumns: number;
  imgClicked:  (_imgIndex: number) => void;
}
