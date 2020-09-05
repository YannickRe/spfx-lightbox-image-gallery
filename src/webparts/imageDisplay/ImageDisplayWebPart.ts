import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/pnpjs";

import * as strings from 'ImageDisplayWebPartStrings';
import ImageDisplay from './components/ImageDisplay';
import { IImageDisplayProps } from './components/IImageDisplayProps';
import { IDataService } from './interfaces/dataservice.interface';
import MockDataService from './services/mockservice.service';
import DataService from './services/dataservice.service';
import {IImageDisplayWebPartProps} from './IImageDisplayWebpartProps';

// import { isEqual, isEmpty } from "@microsoft/sp-lodash-subset";


import { IFolderInfo } from '@pnp/sp/folders';
import { ITreeBody } from './interfaces/treeBody.interface';
import 'react-bnb-gallery/dist/style.css';
import { Photo } from 'react-bnb-gallery';
import { PropertyPaneCreateImageSource } from './controls/CreateImageSourceDialog/PropertyPaneCreateImageSource';


export default class ImageDisplayWebPart extends BaseClientSideWebPart <IImageDisplayWebPartProps> {
  private _loadingIndicator = false;
  private _folders: IFolderInfo[] = [];
  private _photos: Photo[] = [];
  private _picLib: string = "";
  private _amountColumns: number;
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
        show: false,
        contextPropertypane: this.context.propertyPane,
        amountColumns: this._amountColumns,
        dataUpdate: this.updateImageData.bind(this)
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse(strings.version);
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
    
    if (propertyPath === 'PicturesURL' && (newValue != oldValue)) {
        this._picLib = this.properties["PicturesURL"];
        this.DataService.getPicturesFolder(this.properties["PicturesURL"]).then((treeData: ITreeBody) => {
          this._folders = treeData.folders;
          this._photos = treeData.photos;
          // this.context.propertyPane.refresh();
          this.render();
        });
        
    }
    if(propertyPath === 'AmountColumns' && (newValue != oldValue)){
      this._amountColumns = this.properties["AmountColumns"];
      // this.context.propertyPane.refresh();
      this.render();
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.render(); 
  }

  private async updateImageData(folderUrl: string){
    try {
      let treeData = await this.DataService.getPicturesFolder(folderUrl);
      this._folders = treeData.folders;
      this._photos = treeData.photos;
      this.render();
    }catch(error){

    }
    // this.DataService.getPicturesFolder(folderUrl).then((treeData: ITreeBody) => {
    //   this._folders = treeData.folders;
    //   this._photos = treeData.photos;
    //   this.render();
    // });
  }

  private async _createConfigList(listName: string): Promise<any> {
    let exists = await this._dataService.checkIfListAlreadyExists(listName);
    if (exists) {
      return Promise.reject({ message: strings.listExistsError });
    } else {
      try {
        let createdList = await this._dataService.createList(listName);
      }catch(error){
        return Promise.reject(error);
      }
      try {
        this.SPListsCollection = await this.DataService.GetSPLists();
      }catch(error){
        return Promise.reject(error);
      }
      
    }

    // return this._dataService.checkIfListAlreadyExists(listName).then((exists) => {
    //   if (exists) {
    //     return Promise.reject({ message: strings.listExistsError });
    //   } else {
    //     return this._dataService.createList(listName).then((result: any) => {
    //       return this.DataService.GetSPLists().then((lists: any) => {
    //         this.SPListsCollection = lists;
    //         // this.context.propertyPane.refresh();
    //         return result;
    //       }).catch((error) => {
    //           return Promise.reject(error);
    //         });
    //     }).catch((error) => {
    //       return Promise.reject(error);
    //     });
    //   }
    // });
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      showLoadingIndicator: this._loadingIndicator,
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneSlider(strings.AmountColumns, {
                  label: strings.lblAmountColumns,
                  value:  3,
                  min:  1,
                  max: 10
                })
              ]
            },
            {
              groupName: strings.SelectListGroupname,
              groupFields: [
                PropertyPaneDropdown(strings.PicturesURL, {
                  label: strings.lblPicturesURL,
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
              groupName: strings.CreateListGroupName,
              groupFields: [
                new PropertyPaneCreateImageSource(strings.CreateListName, {
                  buttonLabel: strings.dialogBtnLbl,
                  dialogTitle: strings.dialogTitle,
                  dialogText: strings.dialogText,
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