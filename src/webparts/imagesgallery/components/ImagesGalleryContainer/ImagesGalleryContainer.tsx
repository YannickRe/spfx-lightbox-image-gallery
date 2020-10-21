import * as React from 'react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ImagesGalleryWebPartStrings';
import styles from '../ImagesGalleryWebPart.module.scss';

import { IImagesGalleryContainerProps } from './IImagesGalleryContainerProps';
import { IImagesGalleryContainerState } from './IImagesGalleryContainerState';

import { isEqual, isEmpty, findIndex } from "@microsoft/sp-lodash-subset";

import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Breadcrumb,
  IBreadcrumbItem,
  Overlay,
  ITheme
} from "office-ui-fabric-react";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

import Gallery from '../gallery/gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import FolderIcon  from '../folder/folder';
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

export class ImagesGalleryContainer extends React.Component<IImagesGalleryContainerProps, IImagesGalleryContainerState> {
  
  constructor(props: IImagesGalleryContainerProps){
    super(props);  
  
    this.state = {  
      hasError: false,
      areResultsLoading: false,
      errorMessage: '',
      isOpen: false,
      selectedImageIndex: 0,
      folderData: {
        folder: null,
        files: [],
        subFolders: []
      },
      breadCrumb: [],
    };
  }  

  public async componentDidMount() {
    await this._fetchDocumentLibraryItems(this.props.imageLibraryRootFolderUniqueId, true);
  }

  public async componentDidUpdate(prevProps: IImagesGalleryContainerProps, prevState: IImagesGalleryContainerState) {
    if (!isEqual(this.props, prevProps)) {
      await this._fetchDocumentLibraryItems(this.props.imageLibraryRootFolderUniqueId, true);
    }
  }

  public render(): React.ReactElement<IImagesGalleryContainerProps> {
    const areResultsLoading = this.state.areResultsLoading;
    const hasError = this.state.hasError;
    const errorMessage = this.state.errorMessage;
    const subFolders = this.state.folderData.subFolders;
    const photos = this.state.folderData.files;

    const { semanticColors }: IReadonlyTheme = this.props.themeVariant;

    let renderWebPartTitle: JSX.Element = null;
    let renderWebPartContent: JSX.Element = null;
    let renderOverlay: JSX.Element = null;
    let renderLightbox: JSX.Element = null;

    // Loading behavior
    if (areResultsLoading) {
      renderOverlay = <React.Fragment>
          <Overlay isDarkThemed={false} theme={this.props.themeVariant as ITheme} className={styles.overlay}>
              <Spinner size={SpinnerSize.medium} />
          </Overlay>
      </React.Fragment>;
    }

    // WebPart title
    renderWebPartTitle = <WebPartTitle displayMode={this.props.displayMode} title={this.props.webPartTitle} updateProperty={(value: string) => this.props.updateWebPartTitle(value)} />;

    if (isEmpty(subFolders) && isEmpty(photos)) {
      renderWebPartContent = <MessageBar messageBarType={MessageBarType.info}>{strings.ShowBlankEditInfoMessage}</MessageBar>;
    } else {
      if (this.state.isOpen) {
        renderLightbox = <Lightbox images={photos.map(f => f.ServerRelativeUrl)} onClose={() => this._closeLightBox()} startIndex={this.state.selectedImageIndex} showTitle={true} />;
      }

      renderWebPartContent =
        <React.Fragment>
          {renderOverlay}
          <Breadcrumb items={this._getBreadCrumbData()} maxDisplayedItems={5} theme={this.props.themeVariant as ITheme} />
          <FolderIcon items={subFolders} folderClicked={async f => await this._fetchDocumentLibraryItems(f.UniqueId)}></FolderIcon>
          {renderLightbox}
          <Gallery 
            photos={photos}
            imgClicked={(_img) => this._openLightBox(_img)}
            amountColumns={this.props.numberOfColumns}>
          </Gallery>
        </React.Fragment>;
    }
    
    // Error Message
    if (hasError) {
      renderWebPartContent = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>;
    }

    return (
      <div style={{backgroundColor: semanticColors.bodyBackground}}>
        <div className={styles.imagesGalleryWebpart}>
          {renderWebPartTitle}
          {renderWebPartContent}
        </div>
      </div>
    );
  }
  
  private _getBreadCrumbData(): IBreadcrumbItem[] {
    return this.state.breadCrumb.map(f => ({
      text: f.Name,
      key: f.UniqueId,
      onClick: async (ev, item) => await this._fetchDocumentLibraryItems(item.key)
    } as IBreadcrumbItem));
  }

  private _getBreadCrumbState(prevBreadCrumbState: IFolderInfo[], folder: IFolderInfo, reset: boolean): IFolderInfo[] {
    if (reset) {
      return [folder];
    }

    let existingItemIndex = findIndex(prevBreadCrumbState, f => f.UniqueId === folder.UniqueId);
    if (existingItemIndex > -1) {
      return prevBreadCrumbState.slice(0, existingItemIndex + 1);
    }

    return [...prevBreadCrumbState, folder];
  }

  private async _fetchDocumentLibraryItems(uniqueFolderId: string, reset: boolean = false): Promise<void> {
    try {
      this.setState({
        areResultsLoading: true,
        hasError: false,
        errorMessage: ""
      });

      let folderData = await this.props.dataService.getFolderData(uniqueFolderId);

      this.setState((prevState) => ({
        areResultsLoading: false,
        folderData: folderData,
        breadCrumb: this._getBreadCrumbState(prevState.breadCrumb, folderData.folder, reset)
      }));

    } catch (error) {
      this.setState({
          areResultsLoading: false,
          hasError: true,
          errorMessage: error.message
      });
    }
  }

  private _openLightBox(imgIndex: number): void {
    this.setState({
      selectedImageIndex: imgIndex,
      isOpen: true
    });
  }

  private _closeLightBox(): void {
    this.setState({
      isOpen: false
    });
  }
}
