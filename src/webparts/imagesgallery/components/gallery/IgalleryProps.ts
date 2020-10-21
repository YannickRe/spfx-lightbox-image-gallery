import { IFileInfo } from "@pnp/sp/files";

export interface IGalleryProps {
  photos: IFileInfo[];
  amountColumns: number;
  imgClicked:  (_imgIndex: number) => void;
}
