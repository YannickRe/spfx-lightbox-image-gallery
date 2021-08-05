import { IFileInfo } from "@pnp/sp/files";

export interface IImageListProps {
  imagesInfo: IFileInfo[];
  onClick: (index: number) => void;
}
