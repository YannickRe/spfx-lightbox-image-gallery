import * as React from 'react';
import { IImageProps } from './IImageProps';
import { LightgalleryItem } from "react-lightgallery";

export default class Image extends React.Component<IImageProps, {}> {
  
  constructor(props: IImageProps){
    super(props);
  }

  public render(): React.ReactElement<IImageProps> {
    let imagePath = encodeURIComponent(this.props.imageInfo.ServerRelativeUrl);
    imagePath = imagePath.replace(/%2F/g, '/');
    const thumbnailPath = `${this.props.rootUrl.replace(/\/$/, '')}/_layouts/15/getpreview.ashx?path=${imagePath}`;
    return (
      <LightgalleryItem group="any" src={this.props.imageInfo.ServerRelativeUrl}>
          <img src={thumbnailPath} title={this.props.imageInfo.Name} alt={this.props.imageInfo.Name} />
      </LightgalleryItem>
    );
  }
}
