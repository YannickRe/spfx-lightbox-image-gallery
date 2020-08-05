import * as React from 'react';
import styles from './ImageDisplay.module.scss';
import { IImageDisplayProps } from './IImageDisplayProps';

import ReactBnbGallery, { Photo } from 'react-bnb-gallery';
import Gallery from './gallery/gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import FolderIcon  from './folder/folder';
import { Breadcrumb, IBreadcrumbData, IBreadcrumbItem, DefaultButton } from 'office-ui-fabric-react';


export interface IImageDisplayState {
  isOpen : boolean;
  breadCrumbState: IBreadcrumbItem[];
  folderState: any[];
  photosState: Photo[];
  containerWidthState: string;
  containerHeightState: string;
}

export default class ImageDisplay extends React.Component<IImageDisplayProps, IImageDisplayState> {

  
  constructor(props: any){
    super(props);  
  
    this.state = {  
      isOpen: this.props.show,
      breadCrumbState: [],
      folderState: [],
      photosState: [],
      containerWidthState: "",
      containerHeightState: ""
    };

    this.setGallerystate = this.setGallerystate.bind(this);
  }  

  public render(): React.ReactElement<IImageDisplayProps> {
    return (
      <div>
        <div>
          <Breadcrumb items={this.state.breadCrumbState}></Breadcrumb>
        </div>
        <div>
          <FolderIcon items={this.state.folderState}></FolderIcon>
        </div>
        <DefaultButton text="Open Gallery" onClick={this.setGallerystate} />
        <ReactBnbGallery  
        show={this.state.isOpen} 
        onClose={this.setGallerystate}
        photos={this.state.photosState}
        />
      <Gallery containerHeight={this.state.containerHeightState + 'px'} containerWidth={this.state.containerWidthState + 'px'} photos={this.state.photosState}></Gallery>
      </div>      
    );
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.breadCrumb != nextProps.breadCrumb) {
      let updateBreadcrumb = nextProps.breadCrumb;
      this.setState((state) => {
        const _breadCrumbState = [...updateBreadcrumb, ...state.breadCrumbState];
        return {
          isOpen: state.isOpen,
          breadCrumbState: _breadCrumbState
        };
      });
    }
    if(this.props.folders != nextProps.folders) {
      let updateFolders = nextProps.folders;
      this.setState((state) => {
        const _folderState = [...updateFolders, ...state.folderState];
        return {
          isOpen: state.isOpen,
          folderState: _folderState
        };
      });
    }
    if(this.props.photos != nextProps.photos) {
      let updatePhotos = nextProps.photos;
      this.setState((state) => {
        const _photoState = [...updatePhotos, ...state.photosState];
        return {
          isOpen: state.isOpen,
          photosState: _photoState
        };
      });
    }
    if(this.props.containerHeight != nextProps.containerHeight || this.props.containerWidth != nextProps.containerWidth) {
      let updateWidth = nextProps.containerWidth;
      let updateHeight = nextProps.containerHeight;
      this.setState((state) => {
        return {
          containerWidthState: updateWidth,
          containerHeightState: updateHeight
        };
      });
    }
  }

  // componentDidUpdate(prevProps) {
  //   if(prevProps.breadCrumb !== this.props.breadCrumb) {
  //     this.setState((state) => {
  //       const _breadCrumbState = [...this.props.breadCrumb, ...state.breadCrumbState];
  //       return {
  //         isOpen: state.isOpen,
  //         breadCrumbState: _breadCrumbState
  //       };
  //     });
  //   }
  // }

  private setGallerystate() {
    console.log(this.state.photosState);
    this.setState((state) => {
      return {
        isOpen: !state.isOpen
      };
    });
  }
}