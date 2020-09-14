import * as React from 'react';
// import styles from './image.module.scss';
import styles from '../gallery.module.scss';
import { IImageProps } from './IImageProps';
import { IImageState } from './IImageState';


export default class Gallery extends React.Component<IImageProps, IImageState> {
  
  constructor(props: any){
    super(props);  
    this.state = {
      classN: "",
      classSpan: styles.hiddenspan
    };
  }

  setHover = (bool) => {
    this.setState({ classN: bool ? styles.zoom : "", classSpan:bool ? styles.visiblespan : styles.hiddenspan});
  }

  public render(): React.ReactElement<IImageProps> {
    return (
      <div onMouseEnter={() => this.setHover(true)} onMouseLeave={() => this.setHover(false)} onClick={(e) => this.props.photoClicked(this.props.index)} className={styles.zoom} >
        <img src={this.props.photo.photo} /><span className={this.state.classSpan}>{this.props.photo.subcaption}</span>
      </div>
    );
  }
}
