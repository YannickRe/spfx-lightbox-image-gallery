import * as React from 'react';
import styles from './../ImagesGalleryWebPart.module.scss';
import { IImageListProps } from './IImageListProps';
import Image from '../Image/Image';
import { LightgalleryProvider } from "react-lightgallery";
import "lightgallery.js/dist/css/lightgallery.css";

export default class ImageList extends React.Component<IImageListProps, {}> {

  constructor(props: IImageListProps){
    super(props);
  }

  public render(): React.ReactElement<IImageListProps> {
    const allImages = [];
    this.props.imagesInfo.forEach((image, index) => {
      allImages.push(<Image key={index} imageInfo={image} rootUrl={this.props.rootUrl} />);
    });
    
    return (
      <LightgalleryProvider lightgallerySettings={
        {
          counter: false
        }
      }>
        <div className={styles.imageList}>
          {allImages}
        </div>
      </LightgalleryProvider>
    );
  }
}
