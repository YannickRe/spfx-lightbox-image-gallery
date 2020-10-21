import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';
import { ThemeProvider, IReadonlyTheme, ThemeChangedEventArgs } from '@microsoft/sp-component-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { isEqual, isEmpty } from '@microsoft/sp-lodash-subset';

import { sp } from "@pnp/pnpjs";
import * as strings from 'ImagesGalleryWebPartStrings';
import { ImagesGalleryContainer, IImagesGalleryContainerProps } from './components/ImagesGalleryContainer';
import { IDataService } from '../../models/IDataService';
import MockDataService from '../../services/MockDataService';
import DataService from '../../services/DataService';
import {IImagesGalleryWebPartProps} from './IImagesGalleryWebPartProps';
import { IListInfo } from '@pnp/sp/lists';

export default class ImagesGalleryWebPart extends BaseClientSideWebPart<IImagesGalleryWebPartProps> {
  private _dataService: IDataService;
  private _placeholder = null;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme;
  private _initComplete = false;
  private _SPListsCollection: IListInfo[] = [];
  
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
  }

  protected get isRenderAsync(): boolean {
    return true;
  }

  protected renderCompleted(): void {
    super.renderCompleted();
    let renderElement = null;

    if (this._isWebPartConfigured()) {
      renderElement = React.createElement(
        ImagesGalleryContainer,
        {
          imageLibraryRootFolderUniqueId: this.properties.imageLibraryUrl,
          rootUrl: this.context.pageContext.web.serverRelativeUrl,
          numberOfColumns: this.properties.numberOfColumns,
          themeVariant: this._themeVariant,
          dataService: this._dataService,
          displayMode: this.displayMode,
          showBlank: this.properties.showBlank,
          webPartTitle: this.properties.webPartTitle,
          updateWebPartTitle: (value: string) => {
            this.properties.webPartTitle = value;
          }
        } as IImagesGalleryContainerProps
      );
    } else {
      if (this.displayMode === DisplayMode.Edit) {
          const placeholder: React.ReactElement<any> = React.createElement(
              this._placeholder,
              {
                  iconName: strings.placeholderIconName,
                  iconText: strings.placeholderName,
                  description: strings.placeholderDescription,
                  buttonLabel: strings.placeholderbtnLbl,
                  onConfigure: () => { this._setupWebPart(); }
              }
          );
          renderElement = placeholder;
      } else {
          renderElement = React.createElement('div', null);
      }
    }

    ReactDom.render(renderElement, this.domElement);
  }
  
  public async onInit(): Promise<void> {
    this._initializeRequiredProperties();

    this._initThemeVariant();

    if (Environment.type in [EnvironmentType.Local, EnvironmentType.Test]) {
      this._dataService = new MockDataService();
    }
    else {
      this._dataService = new DataService(this.context);
    }

    //TODO: is dit nog nodig, kan dit beter?
    sp.setup({
      spfxContext: this.context
    });
    this._SPListsCollection = await this._dataService.getSPLists();

    this._initComplete = true;

    return super.onInit();
      
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneSlider("numberOfColumns", {
                  label: strings.lblAmountColumns,
                  value:  3,
                  min:  1,
                  max: 10
                })
              ]
            },
            {
              //TODO: is dit wel de beste manier?
              groupName: strings.SelectListGroupname,
              groupFields: [
                PropertyPaneDropdown("imageLibraryUrl", {
                  label: strings.lblPicturesURL,
                  options: this._SPListsCollection.map((listitem, i) => { 
                    return {
                      key:listitem.RootFolder.UniqueId,
                      text:listitem.Title,
                      index: i
                    };
                  })
                })
              ]
            }
          ],
          displayGroupsAsAccordion: true
        }
      ]
    };
  }

  private _isWebPartConfigured(): boolean {
    return !isEmpty(this.properties.imageLibraryUrl);
  }

  private _initializeRequiredProperties() {
    this.properties.numberOfColumns = !isEmpty(this.properties.numberOfColumns) ? this.properties.numberOfColumns : 3;
    this.properties.imageLibraryUrl = !isEmpty(this.properties.imageLibraryUrl) ? this.properties.imageLibraryUrl : "";
  }

  private _initThemeVariant(): void {
    // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent.bind(this));
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    if (!isEqual(this._themeVariant, args.theme)) {
        this._themeVariant = args.theme;
        this.render();
    }
  }

  private _setupWebPart() {
    this.context.propertyPane.open();
  }
}