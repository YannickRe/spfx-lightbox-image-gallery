import * as React from 'react';
import styles from '../ImagesGalleryWebPart.module.scss';
// import * as strings from 'ImagesGalleryWebPartStrings';

import { IImageDisplayProps } from './IImageDisplayProps';

import Gallery from '../gallery/gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import FolderIcon  from '../folder/folder';
import { Breadcrumb, DefaultButton } from 'office-ui-fabric-react';
import { breadCrumbItem } from '../../../../models/breadCrumbItem.interface';
import { IImageDisplayState } from './IImageDisplayState';
// import { isEmpty } from "@microsoft/sp-lodash-subset";

import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";




export default class ImageDisplay extends React.Component<IImageDisplayProps, IImageDisplayState> {
  
  constructor(props: any){
    super(props);  
  
    this.state = {  
      isOpen: this.props.show,
      breadCrumbState: [{text: this.props.breadCrumbInit.text, key:"0", relativefolderUrl: this.props.breadCrumbInit.relativefolderUrl ,onClick: (ev: React.MouseEvent<HTMLElement>, item: breadCrumbItem) => { this.selectedBreadCrumb(item)}}],
      currentbreadCrumbState: "0",
      folderState: [],
      photosState: [],
      selectedImageIndex: 0,
      amountColumnsState: this.props.amountColumns
    };

  }  

  public render(): React.ReactElement<IImageDisplayProps> {
    return (
          <div className={styles["gallery-control"]}>
            <div>
              <Breadcrumb items={this.state.breadCrumbState}></Breadcrumb>
            </div>
            <div >
              <FolderIcon items={this.state.folderState} folderClicked={(_folder) => this.selectedFolderData(_folder)}></FolderIcon>
            </div>
            {this.state.isOpen ? <Lightbox images={this.state.photosState}
              onClose={() => this.setGallerystate()}
              startIndex={this.state.selectedImageIndex}
              showTitle={true} />: null}
              <Gallery 
                photos={this.state.photosState}
                imgClicked={(_img) => this.selectedImage(_img)}
                amountColumns={this.state.amountColumnsState}>
              </Gallery>
          </div>     
    );
  }

  private selectedFolderData = (folderData: IFolderInfo) => {
    this.setState((state) => {
      const _breadCrumbState = [...state.breadCrumbState, {text: folderData.Name, key:folderData.UniqueId ,relativefolderUrl: folderData.ServerRelativeUrl ,onClick: (ev: React.MouseEvent<HTMLElement>, item: breadCrumbItem) => { () => this.selectedBreadCrumb(item)}}];
      return {
        breadCrumbState: _breadCrumbState
      };
    });
    this.props.dataUpdate(folderData.ServerRelativeUrl);
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
    this.state.breadCrumbState.forEach((breadCrumb, index) => {
      if(breadCrumb.key === breadCrumbfolder.key){
        clickedItem = breadCrumb;
        keepBreadcrumbItems.push(breadCrumb);
      }else if (breadCrumb.key !== breadCrumbfolder.key && clickedItem === null){
        keepBreadcrumbItems.push(breadCrumb);
      }
    });
    this.setState((state) => {
      return {
        breadCrumbState: keepBreadcrumbItems
      };
    });
    this.props.dataUpdate(clickedItem.relativefolderUrl);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.breadCrumb != nextProps.breadCrumb) {
      let updateBreadcrumb = nextProps.breadCrumb;
      this.setState((state) => {
        const _breadCrumbState = [...updateBreadcrumb, ...state.breadCrumbState];
        return {
          breadCrumbState: _breadCrumbState
        };
      });
    }
    if(this.props.folders != nextProps.folders) {
      this.setState((state) => {
        return {
          folderState: nextProps.folders
        };
      });
    }
    if(this.props.photos != nextProps.photos) {
      this.setState((state) => {
        return {
          photosState: nextProps.photos
        };
      });
    }
    if(this.props.picLib != nextProps.picLib) {
      this.setState((state) => {
        return {
          breadCrumbState: [{text: nextProps.picLib, key:"0", relativefolderUrl: `${this.props.rootUrl}/${nextProps.picLib}` ,onClick: (ev: React.MouseEvent<HTMLElement>, item: breadCrumbItem) => { this.selectedBreadCrumb(item)}}]
        };
      });
    }
    if(this.props.amountColumns != nextProps.amountColumns) {
      this.setState((state) => {
        return {
          amountColumnsState: nextProps.amountColumns
        };
      });
    }
  }

  private setGallerystate = () => {
    console.log(this.state.photosState);
    this.setState((state) => {
      return {
        isOpen: !state.isOpen
      };
    });
  }
}
