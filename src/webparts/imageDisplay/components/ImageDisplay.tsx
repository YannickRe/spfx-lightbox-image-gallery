import * as React from 'react';
import styles from './ImageDisplay.module.scss';
import { IImageDisplayProps } from './IImageDisplayProps';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";

import ReactBnbGallery, { Photo } from 'react-bnb-gallery';
import Gallery from './gallery/gallery';
import { IFolderInfo } from '@pnp/sp/folders';
import FolderIcon  from './folder/folder';
import { Breadcrumb, DefaultButton } from 'office-ui-fabric-react';
import { breadCrumbItem } from '../interfaces/breadCrumbItem.interface';


export interface IImageDisplayState {
  isOpen : boolean;
  breadCrumbState: breadCrumbItem[];
  currentbreadCrumbState: string;
  folderState: any[];
  photosState: Photo[];
  containerWidthState: string;
  containerHeightState: string;
  selectedImageIndex: number;
}

export default class ImageDisplay extends React.Component<IImageDisplayProps, IImageDisplayState> {
  
  constructor(props: any){
    super(props);  
  
    this.state = {  
      isOpen: this.props.show,
      breadCrumbState: [],
      currentbreadCrumbState: "0",
      folderState: [],
      photosState: [],
      containerWidthState: "",
      containerHeightState: "",
      selectedImageIndex: 0
    };

    this.setGallerystate = this.setGallerystate.bind(this);
    this.selectedFolderData = this.selectedFolderData.bind(this);
    this.selectedBreadCrumb = this.selectedBreadCrumb.bind(this);
    this.selectedImage = this.selectedImage.bind(this);
  }  

  public render(): React.ReactElement<IImageDisplayProps> {
    return (
      <div>
        {
          this.props.picLib === "" && 
          <Placeholder iconName='Edit'
             iconText='Configure your web part'
             description='Please configure the web part.'
             buttonLabel='Configure'
             onConfigure={this._configureWebPart} />
        }
        {
          this.props.picLib !== "" &&
          <div>
            <div>
              <Breadcrumb items={this.state.breadCrumbState}></Breadcrumb>
            </div>
            <div >
              <FolderIcon items={this.state.folderState} folderClicked={this.selectedFolderData}></FolderIcon>
            </div>
            <DefaultButton text="Open Gallery" onClick={this.setGallerystate} />
            <ReactBnbGallery  
            show={this.state.isOpen} 
            onClose={this.setGallerystate}
            photos={this.state.photosState}
            activePhotoIndex={this.state.selectedImageIndex}
            />
              <Gallery 
                containerHeight={this.state.containerHeightState + 'px'} 
                containerWidth={this.state.containerWidthState + 'px'} 
                photos={this.state.photosState}
                imgClicked={this.selectedImage}>
              </Gallery>
          </div>
        }
      </div>      
    );
  }

  private selectedFolderData(folderData: IFolderInfo) {
    this.setState((state) => {
      const _breadCrumbState = [...state.breadCrumbState, {text: folderData.Name, key:folderData.UniqueId ,relativefolderUrl: folderData.ServerRelativeUrl ,onClick: (ev: React.MouseEvent<HTMLElement>, item: breadCrumbItem) => { this.selectedBreadCrumb(item)}}];
      return {
        breadCrumbState: _breadCrumbState
      };
    });
    this.props.dataUpdate(folderData.ServerRelativeUrl);
  }

  private _configureWebPart = () => {
    this.props.context.propertyPane.open();
  }

  private selectedImage(imgIndex: number){
    this.setState((state) => {
      return {
        selectedImageIndex: imgIndex
      };
    });
    this.setGallerystate();
  }

  private selectedBreadCrumb(breadCrumbfolder: breadCrumbItem) {
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
    // let _array = this.state.breadCrumbState.slice(clickedItemIndex, (this.state.breadCrumbState.length-clickedItemIndex)-1);
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
      // let updateFolders = nextProps.folders;
      this.setState((state) => {
        // const _folderState = [...updateFolders, []];
        return {
          folderState: nextProps.folders
        };
      });
    }
    if(this.props.photos != nextProps.photos) {
      // let updatePhotos = nextProps.photos;
      this.setState((state) => {
        // const _photoState = [...updatePhotos, []];
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

  // private _configureWebPart = () => {
  //   this.props.context.propertyPane.open();
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
