import * as React from 'react';
import styles from './../ImagesGalleryWebPart.module.scss';
import { IImageListProps } from './IImageListProps';
import Image from '../Image/Image';
import { SRLWrapper } from "simple-react-lightbox";

export default class ImageList extends React.Component<IImageListProps, {}> {
  private srlOptions = {
    caption: {
      captionFontFamily: "\"Segoe UI Web (West European)\",Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
    }
  };

  constructor(props: IImageListProps){
    super(props);
  }

  public render(): React.ReactElement<IImageListProps> {
    const allImages = [];
    this.props.imagesInfo.forEach((image, index) => {
      allImages.push(<Image key={index} imageInfo={image} rootUrl={this.props.rootUrl} />);
    });
    
    return (
      <SRLWrapper options={this.srlOptions}>
        <div className={styles.imageList}>
          {allImages}
        </div>
      </SRLWrapper>
    );
  }
}
