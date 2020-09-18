import { IFolderInfo } from '@pnp/sp/folders';
import { IBreadcrumbItem } from 'office-ui-fabric-react';
import { IPropertyPaneAccessor } from '@microsoft/sp-webpart-base';
import { IImageItem } from '../../interfaces/IImageItem.interface';

export interface IImageDisplayProps {
  picLib: string;
  rootUrl: string;
  onclose: any;
  show: boolean;
  photos: IImageItem[];
  folders: IFolderInfo[];
  breadCrumb: IBreadcrumbItem[];
  breadCrumbInit: any;
  openPropertypane: IPropertyPaneAccessor;
  amountColumns: number;
  dataUpdate: (folder:string) => void;
}
