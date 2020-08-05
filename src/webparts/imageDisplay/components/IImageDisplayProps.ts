import { Photo } from 'react-bnb-gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import { IBreadcrumbItem } from 'office-ui-fabric-react';

export interface IImageDisplayProps {
  picLib: string;
  onclose: any;
  show: boolean;
  photos: Photo[];
  folders: IFolderInfo[];
  containerWidth: string;
  containerHeight: string;
  breadCrumb: IBreadcrumbItem[];
}
