import { Photo } from 'react-bnb-gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import { IBreadcrumbItem } from 'office-ui-fabric-react';
import { IPropertyPaneAccessor } from '@microsoft/sp-webpart-base';

export interface IImageDisplayProps {
  picLib: string;
  rootUrl: string;
  onclose: any;
  show: boolean;
  photos: Photo[];
  folders: IFolderInfo[];
  breadCrumb: IBreadcrumbItem[];
  contextPropertypane: IPropertyPaneAccessor;
  amountColumns: number;
  dataUpdate: (folder:string) => void;
}
