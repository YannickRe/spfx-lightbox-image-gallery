import * as React from 'react';
import { IImageProps } from './IImageProps';

export default class Image extends React.Component<IImageProps, {}> {
  
  constructor(props: IImageProps){
    super(props);
  }

  public render(): React.ReactElement<IImageProps> {
    const thumbnailPath = `${this.props.rootUrl}/_layouts/15/getpreview.ashx?path=${this.props.imageInfo.ServerRelativeUrl}`;
    return (
      <a href={this.props.imageInfo.ServerRelativeUrl} title={this.props.imageInfo.Name}>
        <img src={thumbnailPath} title={this.props.imageInfo.Name} alt={this.props.imageInfo.Name} />
      </a>
    );
  }
}
