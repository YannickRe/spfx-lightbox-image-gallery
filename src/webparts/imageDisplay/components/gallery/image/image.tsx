import * as React from 'react';
import { IImageProps } from './imageProps';
// import styles from './image.module.scss';
import styles from '../gallery.module.scss';

export interface IImageState {
  classN: any;
}

export default class Gallery extends React.Component<IImageProps, IImageState> {
  
  constructor(props: any){
    super(props);  
    this.state = {
      classN: ""
    };
  }

  setHover = (bool) => {
    this.setState({ classN: bool ? styles.zoom : ""});
  }

  public render(): React.ReactElement<IImageProps> {
    return (
      <div onMouseEnter={() => this.setHover(true)} onMouseLeave={() => this.setHover(false)} onClick={(e) => this.props.photoClicked(this.props.index)} className={this.state.classN} >
        <img src={this.props.photo.photo} />
      </div>
    );
  }
}
