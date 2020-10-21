import { IFileInfo } from "@pnp/sp/files";

export interface IImageProps {
  photo: IFileInfo;
  index: number;
  photoClicked:  (index: number) => void;
}
