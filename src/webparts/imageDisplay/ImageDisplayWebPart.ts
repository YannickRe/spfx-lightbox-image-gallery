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


import { IFolderInfo } from '@pnp/sp/folders';
import { ITreeBody } from './interfaces/treeBody.interface';
import 'react-bnb-gallery/dist/style.css';
import { Photo } from 'react-bnb-gallery';
import { PropertyPaneCreateImageSource } from './controls/CreateImageSourceDialog/PropertyPaneCreateImageSource';

export interface IImageDisplayWebPartProps {
  description: string;
}

export default class ImageDisplayWebPart extends BaseClientSideWebPart <IImageDisplayWebPartProps> {
  private loadingIndicator = false;
  private _folders: IFolderInfo[] = [];
  private _photos: Photo[] = [];
  private _picLib: string = "";
  private _rootUrl: string;
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
        picLib: this._picLib,
        rootUrl: this.context.pageContext.web.serverRelativeUrl,
        photos: this._photos,
        containerWidth: this._containerHeight,
        containerHeight: this._containerWidth,
        show: false,
        context: this.context,
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


  
  

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'containerHeight' && (newValue != oldValue)) {
      this._containerHeight = this.properties["containerHeight"];
      this.context.propertyPane.refresh();
      this.render();
    }
    if (propertyPath === 'containerWidth' && (newValue != oldValue)) {
      this._containerWidth = this.properties["containerWidth"];
      this.context.propertyPane.refresh();
      this.render();
    }
    if (propertyPath === 'PicturesURL' && (newValue != oldValue)) {
        this._picLib = this.properties["PicturesURL"];
        this.DataService.getPicturesFolder(this.properties["PicturesURL"]).then((treeData: ITreeBody) => {
          this._folders = treeData.folders;
          this._photos = treeData.photos;
          this.context.propertyPane.refresh();
          this.render();
        });
        
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.render(); 
  }

  private updateImageData(folderUrl: string){
    this.DataService.getPicturesFolder(folderUrl).then((treeData: ITreeBody) => {
      this._folders = treeData.folders;
      this._photos = treeData.photos;
      this.render();
    });
  }

  private _createConfigList(listName: string): Promise<any> {
    return this._dataService.checkIfListAlreadyExists(listName).then((exists) => {
      if (exists) {
        return Promise.reject({ message: "List already exists." });
      } else {
        return this._dataService.createList(listName).then((result: any) => {
          return this.DataService.GetSPLists().then((lists: any) => {
            this.SPListsCollection = lists;
            this.context.propertyPane.refresh();
            return result;
          }).catch((error) => {
              return Promise.reject(error);
            });
        }).catch((error) => {
          return Promise.reject(error);
        });
      }
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
                  buttonLabel: "Create Picture Library",
                  dialogTitle: "Create library",
                  dialogText: "Create a new picture library.",
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