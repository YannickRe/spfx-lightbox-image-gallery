import { IFolderInfo } from "@pnp/sp/folders";
import { IFileInfo } from "@pnp/sp/files";
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb";
import { Photo } from "react-bnb-gallery";

export interface ITreeBody {
    folders: IFolderInfo[];
    photos: Photo[];
    // breadcrumb: IBreadcrumbItem[];
}