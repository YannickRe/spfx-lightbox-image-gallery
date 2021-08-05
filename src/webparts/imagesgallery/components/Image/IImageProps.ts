import { IFileInfo } from "@pnp/sp/files";

export interface IImageProps {
  imageInfo: IFileInfo;
  imageIndex: number;
  onClick: (index: number) => void;
}
