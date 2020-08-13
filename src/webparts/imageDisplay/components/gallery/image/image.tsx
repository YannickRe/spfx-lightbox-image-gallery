import * as React from 'react';
import { IImageProps } from './imageProps';
// import styles from './image.module.scss';
import styles from '../gallery.module.scss';

export interface IImageState {
  spans: any;
  classN: any;
}

export default class Gallery extends React.Component<IImageProps, IImageState> {

  // private backURL:React.CSSProperties = { backgroundImage: `url('${this.props.photo.photo}')` };
  private imageRef: any;
  
  constructor(props: any){
    super(props);  
    this.state = {
      spans:0,
      classN: ""
    };
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    const spans = Math.ceil(height / 10 );
    this.setState({ spans: spans});
  }

  setHover = (bool) => {
    this.setState({ classN: bool ? styles.zoom : ""});
  }

  public render(): React.ReactElement<IImageProps> {
    return (
      <div onMouseEnter={() => this.setHover(true)} onMouseLeave={() => this.setHover(false)} onClick={(e) => this.props.photoClicked(this.props.index)} className={this.state.classN} style={{ gridRowEnd: `span ${this.state.spans}` }}>
        <img ref={this.imageRef} src={this.props.photo.photo} />
      </div>
    );
  }
}
