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
import { PropertyPaneHelpers } from '@pnp/spfx-property-controls/lib/helpers';

export default class ImagesGalleryWebPart extends BaseClientSideWebPart<IImagesGalleryWebPartProps> {
  private _dataService: IDataService;
  private _placeholder = null;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme;
  private _initComplete = false;
  private _availableLists: IListInfo[] = [];
  
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
          imageLibraryRootFolderUniqueId: this.properties.imageLibraryRootFolderUniqueId,
          rootUrl: this.context.pageContext.web.serverRelativeUrl,
          themeVariant: this._themeVariant,
          dataService: this._dataService,
          displayMode: this.displayMode,
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
                  iconName: strings.PlaceholderIconName,
                  iconText: strings.PlaceholderName,
                  description: strings.PlaceholderDescription,
                  buttonLabel: strings.PlaceholderButton,
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
    this._initThemeVariant();

    if (Environment.type in [EnvironmentType.Local, EnvironmentType.Test]) {
      this._dataService = new MockDataService();
    }
    else {
      this._dataService = new DataService();
    }

    sp.setup({
      spfxContext: this.context
    });

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
          groups: [
            {
              groupFields: [
                PropertyPaneDropdown("imageLibraryRootFolderUniqueId", {
                  label: strings.ImageLibraryRootFolderUniqueId,
                  options: this._availableLists.map((listitem, i) => { 
                    return {
                      key:listitem.RootFolder.UniqueId,
                      text:listitem.Title,
                      index: i
                    };
                  })
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    PropertyPaneHelpers.setSpinner();

    this._availableLists = await this._dataService.getLists();

    PropertyPaneHelpers.clearSpinner(200);
  }

  private _isWebPartConfigured(): boolean {
    return !isEmpty(this.properties.imageLibraryRootFolderUniqueId);
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