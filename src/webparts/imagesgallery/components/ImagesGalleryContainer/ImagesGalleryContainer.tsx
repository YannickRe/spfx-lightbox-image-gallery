import * as React from 'react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ImagesGalleryWebPartStrings';
import styles from '../ImagesGalleryWebPart.module.scss';

import { IImagesGalleryContainerProps } from './IImagesGalleryContainerProps';
import { IImagesGalleryContainerState } from './IImagesGalleryContainerState';

import { isEqual, isEmpty } from "@microsoft/sp-lodash-subset";

import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Breadcrumb,
} from "office-ui-fabric-react";
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { ITheme } from 'office-ui-fabric-react/lib/Styling';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { DisplayMode } from "@microsoft/sp-core-library";


import Gallery from '../gallery/gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import FolderIcon  from '../folder/folder';
import { breadCrumbItem } from '../../../../models/breadCrumbItem.interface';
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
      folders: [],
      photos: [],
      breadCrumb: [{text: this.props.imageLibraryRootFolderUniqueId, key: this.props.imageLibraryRootFolderUniqueId, relativefolderUrl: `${this.props.rootUrl}/${this.props.imageLibraryRootFolderUniqueId}`, onClick: (ev: React.MouseEvent<HTMLElement>, item: breadCrumbItem) => { this.selectedBreadCrumb(item); }}],
    };
  }  

  public async componentDidMount() {
    await this._fetchDocumentLibraryItems(this.props.imageLibraryRootFolderUniqueId);
  }

  public async componentDidUpdate(prevProps: IImagesGalleryContainerProps, prevState: IImagesGalleryContainerState) {
    if (!isEqual(this.props, prevProps)) {
      await this._fetchDocumentLibraryItems(this.props.imageLibraryRootFolderUniqueId);
    }
  }

  public render(): React.ReactElement<IImagesGalleryContainerProps> {
    const areResultsLoading = this.state.areResultsLoading;
    const hasError = this.state.hasError;
    const errorMessage = this.state.errorMessage;
    const folders = this.state.folders;
    const photos = this.state.photos;

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

    if (isEmpty(folders) && isEmpty(photos) && this.props.showBlank) {
      if (this.props.displayMode === DisplayMode.Edit) {
        renderWebPartContent = <MessageBar messageBarType={MessageBarType.info}>{strings.ShowBlankEditInfoMessage}</MessageBar>;
      }
      else {
        renderWebPartTitle = null;
      }
    } else {
      if (this.state.isOpen) {
        renderLightbox = <Lightbox images={this.state.photos} onClose={() => this.setGallerystate()} startIndex={this.state.selectedImageIndex} showTitle={true} />;
      }
      renderWebPartContent =
        <React.Fragment>
          {renderOverlay}
          <Breadcrumb items={this.state.breadCrumb} theme={this.props.themeVariant as ITheme}></Breadcrumb>
          <FolderIcon items={this.state.folders} folderClicked={(_folder) => this.selectedFolderData(_folder)}></FolderIcon>
          {renderLightbox}
          <Gallery 
            photos={this.state.photos}
            imgClicked={(_img) => this.selectedImage(_img)}
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

  private async _fetchDocumentLibraryItems(uniqueFolderId: string): Promise<void> {
    try {
      this.setState({
        areResultsLoading: true,
        hasError: false,
        errorMessage: ""
      });

      let treeData = await this.props.dataService.getPicturesFolder(uniqueFolderId);
      this.setState({
        areResultsLoading: false,
        folders: treeData.folders,
        photos: treeData.photos
      });
    } catch (error) {
      this.setState({
          areResultsLoading: false,
          hasError: true,
          errorMessage: error.message
      });
    }
  }

  //TODO: alles hieronder heeft een makeover nodig...

  private selectedFolderData = (folderData: IFolderInfo) => {
    this.setState((state) => {
      const _breadCrumbState = [...state.breadCrumb, {text: folderData.Name, key:folderData.UniqueId, relativefolderUrl: folderData.ServerRelativeUrl, onClick: (ev: React.MouseEvent<HTMLElement>, item: breadCrumbItem) => { () => this.selectedBreadCrumb(item); }}];
      return {
        breadCrumb: _breadCrumbState
      };
    });
    this._fetchDocumentLibraryItems(folderData.UniqueId);
  }
  private selectedImage = (imgIndex: number) => {
    this.setState((state) => {
      return {
        selectedImageIndex: imgIndex
      };
    });
    this.setGallerystate();
  }

  private selectedBreadCrumb = (breadCrumbfolder: breadCrumbItem) => {
    let clickedItem: breadCrumbItem = null;
    let keepBreadcrumbItems: breadCrumbItem[] = [];
    this.state.breadCrumb.forEach((breadCrumb, index) => {
      if(breadCrumb.key === breadCrumbfolder.key){
        clickedItem = breadCrumb;
        keepBreadcrumbItems.push(breadCrumb);
      }else if (breadCrumb.key !== breadCrumbfolder.key && clickedItem === null){
        keepBreadcrumbItems.push(breadCrumb);
      }
    });
    this.setState((state) => {
      return {
        breadCrumb: keepBreadcrumbItems
      };
    });
    this._fetchDocumentLibraryItems(clickedItem.key);
  }

  private setGallerystate = () => {
    console.log(this.state.photos);
    this.setState((state) => {
      return {
        isOpen: !state.isOpen
      };
    });
  }
}
