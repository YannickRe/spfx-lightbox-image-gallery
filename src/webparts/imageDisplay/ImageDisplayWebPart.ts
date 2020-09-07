import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';
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
import { isEqual, isEmpty } from '@microsoft/sp-lodash-subset';


export default class ImageDisplayWebPart extends BaseClientSideWebPart <IImageDisplayWebPartProps> {
  private _loadingIndicator = false;
  private _initComplete = false;
  private _placeholder = null;
  private _SPListsCollection: any[] = [];
  private _dataService: IDataService;
  // private _folders: IFolderInfo[] = [];
  // private _photos: Photo[] = [];
  // private _picLib: string = "";
  // private _amountColumns: number;
  // private _dataService: IDataService;
  // private get DataService(): IDataService {
  //   if (!this._dataService) {
  //     if (Environment.type in [EnvironmentType.Local, EnvironmentType.Test]) {
  //       // this._dataService = new MockDataService();
  //       this._dataService = new MockDataService();
  //     }
  //     else {
  //       // this._dataService = new DataService(this.context);
  //       this._dataService = new DataService(this.context);
  //     }
  //   }
  //   // return this._dataService;
  //   return this._dataService;
  // }

  public async render(): Promise<void> {
    if (!this._initComplete) {
      return;
    }

    if (this.displayMode === DisplayMode.Edit) {
      const { Placeholder } = await import(
          /* webpackChunkName: 'search-property-pane' */
          '@pnp/spfx-controls-react/lib/Placeholder'
      );
      this._placeholder = Placeholder;
    }

    this.renderCompleted();

    // const element: React.ReactElement<IImageDisplayProps> = React.createElement(
    //   ImageDisplay,
    //   {
    //     // folders: this._folders,
    //     folders: this.properties.folders,
    //     picLib: this.properties.picLib,
    //     rootUrl: this.context.pageContext.web.serverRelativeUrl,
    //     photos: this.properties.photos,
    //     show: false,
    //     openPropertypane: this.context.propertyPane,
    //     // ppTest: this.context.propertyPane,
    //     amountColumns: this.properties.amountColumns,
    //     dataUpdate: this.updateImageData.bind(this)
    //   }
    // );

    // ReactDom.render(element, this.domElement);
  }

  protected renderCompleted(): void {
    super.renderCompleted();

    let renderElement: React.ReactElement<IImageDisplayProps> = null;

    if (this._isWebPartConfigured()) {
      const element: React.ReactElement<IImageDisplayProps> = React.createElement(
        ImageDisplay,
        {
          // folders: this._folders,
          folders: this.properties.folders,
          picLib: this.properties.picLib,
          rootUrl: this.context.pageContext.web.serverRelativeUrl,
          photos: this.properties.photos,
          show: false,
          breadCrumbInit: {text: this.properties.picLib, key:"0", relativefolderUrl: `${ this.context.pageContext.web.serverRelativeUrl}/${this.properties.picLib}`},
          // openPropertypane: this.context.propertyPane,
          // ppTest: this.context.propertyPane,
          amountColumns: this.properties.amountColumns,
          dataUpdate: this.updateImageData.bind(this)
        }
      );
      renderElement = element;
    } else {
      if (this.displayMode === DisplayMode.Edit) {
          const placeholder: React.ReactElement<any> = React.createElement(
              this._placeholder,
              {
                  iconName: strings.placeholderIconName,
                  iconText: strings.placeholderName,
                  description: strings.placeholderDescription,
                  buttonLabel: strings.placeholderbtnLbl,
                  onConfigure: this._setupWebPart.bind(this)
              }
          );
          renderElement = placeholder;
      } else {
          renderElement = React.createElement('div', null);
      }
    }

    ReactDom.render(renderElement, this.domElement);
  }

  protected get isRenderAsync(): boolean {
    return true;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse(strings.version);
  }

  private _setupWebPart() {
    this.context.propertyPane.open();
  }

  private _isWebPartConfigured(): boolean {
    return !isEmpty(this.properties.picLib);
  }

  

  public async onInit(): Promise<void> {
    if (Environment.type in [EnvironmentType.Local, EnvironmentType.Test]) {
      // this._dataService = new MockDataService();
      this._dataService = new MockDataService();
    }
    else {
      // this._dataService = new DataService(this.context);
      this._dataService = new DataService(this.context);
    }

    this._initializeRequiredProperties();
    sp.setup({
      spfxContext: this.context
    });
    
    // this.openConfigPanel = this.openConfigPanel.bind(this);
    // this.updateImageData = this.updateImageData.bind(this);
    this._SPListsCollection = await this._dataService.GetSPLists();

    // let splistPromise = new Promise<any>((resolve, reject) => {
    //   this.DataService.GetSPLists().then((lists: any) => {
    //     this._SPListsCollection = lists;
    //     resolve(true);
    //   }).catch((error) => {
    //       reject(error);
    //     });
    // });

    // return Promise.all([splistPromise]).then((values) => {
    //   return Promise.resolve();
    // }); 
    this._initComplete = true;

    return super.onInit();
      
  }


  private _initializeRequiredProperties() {
    this.properties.amountColumns = (this.properties.amountColumns !== undefined && this.properties.amountColumns !== null) ? this.properties.amountColumns : 3;
    this.properties.picLib = (this.properties.picLib !== undefined && this.properties.picLib !== null) ? this.properties.picLib : "";
  }
  

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void> {
    // propertyPath.localeCompare('searchParameterOption') === 0
    // if (propertyPath === 'PicturesURL' && (newValue != oldValue)) {
    if (propertyPath.localeCompare('PicturesURL') === 0 && !isEqual(newValue, oldValue)) {
        // this._picLib = this.properties["PicturesURL"];
        this.properties.picLib = this.properties["PicturesURL"];
        // this.DataService.getPicturesFolder(this.properties["PicturesURL"]).then((treeData: ITreeBody) => {
        let treeData = await this._dataService.getPicturesFolder(this.properties["PicturesURL"]);// .then((treeData: ITreeBody) => {
          // this._folders = treeData.folders;
          this.properties.folders = treeData.folders;
          this.properties.photos = treeData.photos,
          // this._photos = treeData.photos;
          // this.context.propertyPane.refresh();
          this.render();
        //});
        
    }
    // if(propertyPath === 'AmountColumns' && (newValue != oldValue)){
    if (propertyPath.localeCompare('AmountColumns') === 0 && !isEqual(newValue, oldValue)) {
      this.properties.amountColumns = this.properties["AmountColumns"];
      // this._amountColumns = this.properties["AmountColumns"];
      // this.context.propertyPane.refresh();
      this.render();
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.render(); 
  }

  private async updateImageData(folderUrl: string){
    try {
      // let treeData = await this.DataService.getPicturesFolder(folderUrl);
      let treeData = await this._dataService.getPicturesFolder(folderUrl);
      this.properties.folders = treeData.folders;
      // this._folders = treeData.folders;
      this.properties.photos = treeData.photos;
      // this._photos = treeData.photos;
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
    // let exists = await this._dataService.checkIfListAlreadyExists(listName);
    let exists = await this._dataService.checkIfListAlreadyExists(listName);
    if (exists) {
      return Promise.reject({ message: strings.listExistsError });
    } else {
      try {
        // let createdList = await this._dataService.createList(listName);
        let createdList = await this._dataService.createList(listName);
      }catch(error){
        return Promise.reject(error);
      }
      try {
        this._SPListsCollection = await this._dataService.GetSPLists();
        // this._SPListsCollection = await this.DataService.GetSPLists();
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
    //         this._SPListsCollection = lists;
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
                  options: this._SPListsCollection.map((listitem, i) => { 
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
          ],
          displayGroupsAsAccordion: true
        }
      ]
    };
  }
}