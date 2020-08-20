import { Photo } from 'react-bnb-gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import { IBreadcrumbItem } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IImageDisplayProps {
  picLib: string;
  rootUrl: string;
  onclose: any;
  show: boolean;
  photos: Photo[];
  folders: IFolderInfo[];
  containerWidth: string;
  containerHeight: string;
  breadCrumb: IBreadcrumbItem[];
  context: WebPartContext;
  amountColumns: number;
  dataUpdate: (folder:string) => void;
}
