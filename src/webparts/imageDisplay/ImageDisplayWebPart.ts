import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/pnpjs";

import * as strings from 'ImageDisplayWebPartStrings';
import ImageDisplay from './components/ImageDisplay';
import { IImageDisplayProps } from './components/IImageDisplayProps';
import { IDataService } from './interfaces/dataservice.interface';
import MockDataService from './services/mockservice.service';
import DataService from './services/dataservice.service';

import { PropertyPaneCreateImageSource  } from './controls/CreateImageSourceDialog/PropertyPaneCreateImageSource';
import { IList } from './interfaces/list.interface';
import { ErrorObjectFormat } from './helpers/errorhandler';
import { IFolder, IFolderInfo } from '@pnp/sp/folders';
import { ITreeBody } from './interfaces/treeBody.interface';
import { IBreadcrumbItem } from 'office-ui-fabric-react';
import 'react-bnb-gallery/dist/style.css';
import { Photo } from 'react-bnb-gallery';

export interface IImageDisplayWebPartProps {
  description: string;
}

export default class ImageDisplayWebPart extends BaseClientSideWebPart <IImageDisplayWebPartProps> {
  private loadingIndicator = false;
  private _folders: IFolderInfo[] = [];
  private _breadCrumb: IBreadcrumbItem[] = [];
  private _photos: Photo[] = [];
  private _picLib: string;
  private _containerWidth: string;
  private _containerHeight: string;
  private _dataService: IDataService;
  private get DataService(): IDataService {
    if (!this._dataService) {
      if (Environment.type in [EnvironmentType.Local, EnvironmentType.Test]) {
        this._dataService = new MockDataService();
      }
      else {
        this._dataService = new DataService(this.context);
      }
    }
    return this._dataService;
  }

  public render(): void {
    const element: React.ReactElement<IImageDisplayProps> = React.createElement(
      ImageDisplay,
      {
        folders: this._folders,
        // breadCrumb: this._breadCrumb,
        picLib: this._picLib,
        photos: this._photos,
        containerWidth: this._containerHeight,
        containerHeight: this._containerWidth,
        show: true,
        dataUpdate: this.updateImageData.bind(this)
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private SPListsCollection: any[] = [];

  public onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });

    // this.SPLists();
    let splistPromise = new Promise<any>((resolve, reject) => {
      this.DataService.GetSPLists().then((lists: any) => {
        this.SPListsCollection = lists;
        resolve(true);
      }).catch((error) => {
          reject(error);
        });
    });

    return Promise.all([splistPromise]).then((values) => {
      return Promise.resolve();
    });
      
}

  protected onPropertyPaneConfigurationStart(): void {
    // this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'options');
    // re render after fetch, if something is fetched
    // this.render();
    // this.context.statusRenderer.clearLoadingIndicator(this.domElement);
  }

  private _createConfigList(listName: string): Promise<IList> {
    return this._dataService.checkIfListAlreadyExists(listName).then((exists) => {
      if (exists) {
        return Promise.reject({ message: "List already exists." });
      } else {
        return this._dataService.createList(listName).then((result: IList) => {
          // this._listDropDownOptions.push({ key: result.Id, text: result.Title });
          this.context.propertyPane.refresh();
          return result;
        }).catch((error) => {
          return Promise.reject(error);
        });
      }
    });
  }
  

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'containerHeight' && (newValue != oldValue)) {
      // this.properties.selectedUser = undefined;
      console.log(this.properties["containerHeight"]);
      this._containerHeight = this.properties["containerHeight"];
      this.context.propertyPane.refresh();
      // this.loadingIndicator = true;
      this.render();
    }
    if (propertyPath === 'containerWidth' && (newValue != oldValue)) {
      // this.properties.selectedUser = undefined;
      console.log(this.properties["containerWidth"]);
      this._containerWidth = this.properties["containerWidth"];
      this.context.propertyPane.refresh();
      // this.loadingIndicator = true;
      this.render();
    }
    if (propertyPath === 'PicturesURL' && (newValue != oldValue)) {
        console.log(this.properties["PicturesURL"]);
        this._picLib = this.properties["PicturesURL"];
        this.DataService.getPicturesFolder(this.properties["PicturesURL"]).then((treeData: ITreeBody) => {
          this._folders = treeData.folders;
          // this._breadCrumb = treeData.breadcrumb;
          this._photos = treeData.photos;
          this.render();
        });
        
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    // this.render();
  }

  private updateImageData(folder: IFolderInfo){
    this.DataService.getPicturesFolder(folder.ServerRelativeUrl).then((treeData: ITreeBody) => {
      this._folders = treeData.folders;
      // this._breadCrumb = treeData.breadcrumb;
      this._photos = treeData.photos;
      this.render();
    });
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      showLoadingIndicator: this.loadingIndicator,
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('containerHeight', {
                  label: 'Set Image Container Height in px'
                }),
                PropertyPaneTextField('containerWidth', {
                  label: 'Set Image Container Width in px'
                })
              ]
            },
            {
              groupName: "Select Images Lists",
              groupFields: [
                PropertyPaneDropdown('PicturesURL', {
                  label: 'Source for your images',
                  options: this.SPListsCollection.map((listitem, i) => { 
                    return {
                      key:listitem.Title,
                      text:listitem.Title,
                      index: i
                    } 
                  })
                })
              ]
            },
            {
              groupName: "Create Images Lists",
              groupFields: [
                new PropertyPaneCreateImageSource('createImagesList', {
                  buttonLabel: "Create image source list",
                  dialogTitle: "Create List",
                  dialogText: "Create a new image source list.",
                  saveAction: this._createConfigList.bind(this),
                })
              ]
            }
          ]
        }
      ]
    };
  }
}