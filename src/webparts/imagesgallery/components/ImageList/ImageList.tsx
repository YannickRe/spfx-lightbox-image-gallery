import * as React from 'react';
import styles from './ImageList.module.scss';
import { IImageListProps } from './IImageListProps';
import Image from '../Image/Image';

export default class ImageList extends React.Component<IImageListProps, {}> {
  
  constructor(props: IImageListProps){
    super(props);
  }

  public render(): React.ReactElement<IImageListProps> {
    const allImages = [];
    this.props.imagesInfo.forEach((image, index) => {
      allImages.push(<Image onClick={(i) => this.props.onClick(i)} imageIndex={index} imageInfo={image} ></Image>);
    });

    return (
        <div className={styles.imageList}>
          {allImages}
        </div>
    );
  }
}
