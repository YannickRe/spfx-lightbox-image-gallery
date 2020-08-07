import * as React from 'react';
import styles from './gallery.module.scss';
import { IGalleryProps } from './galleryProps';
import { Photo } from 'react-bnb-gallery';
import Image from './image/image';

export interface IGalleryState {
  photosState: Photo[];
}

export default class Gallery extends React.Component<IGalleryProps, {}> {
  private gridSize:React.CSSProperties;
  private gridColumnSize: number = 3;
  
  constructor(props: any){
    super(props);
  }

  public render(): React.ReactElement<IGalleryProps> {
    return (
      <div className="maingrid" style={this.gridSize}>
        <div className={styles["image-list"]}>
          {
            this.props.photos.map((_photo) => {
                return <Image photo={_photo}></Image>
            })
          }
        </div> 
      </div>  
    );
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.containerWidth != nextProps.containerWidth || this.props.containerHeight != nextProps.containerHeight) {
      this.gridSize = { 
        width : nextProps.containerWidth.trim().length > 2 ? nextProps.containerWidth :"1200px",
        height: nextProps.containerHeight.trim().length > 2 ? nextProps.containerHeight :"800px"
      };
    }
    
  }

  
}
