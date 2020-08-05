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

    this.gridColumnImageBuild = this.gridColumnImageBuild.bind(this);
    this.gridContainerBuild = this.gridContainerBuild.bind(this);
  }

  public render(): React.ReactElement<IGalleryProps> {
    return (
      <div className={styles["grid-container"]} style={this.gridSize}>
        <div className={styles.grid}>
            {
              this.gridContainerBuild()
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

  gridContainerBuild(){
    let chunkedArray = this.chunkArray(this.props.photos, this.gridColumnSize);  
    return chunkedArray.map((photoArray) => {
      return <div className={styles.column}>
        {
          this.gridColumnImageBuild(photoArray)
        }
      </div>
    })
  }
  gridColumnImageBuild(photoItems: Photo[]): any {
    return photoItems.map((_photo) => {
      return <Image photo={_photo}></Image>
    })
  }

  // divide images into equal parts
  chunkArray(imgArray: Photo[], chunk_size: number){
    let index = 0;
    let arrayLength = imgArray.length;
    let tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = imgArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
  }
}
