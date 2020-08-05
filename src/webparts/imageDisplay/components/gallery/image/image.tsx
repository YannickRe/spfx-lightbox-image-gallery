import * as React from 'react';
import { IImageProps } from './imageProps';
// import styles from './image.module.scss';
import styles from '../gallery.module.scss';

export interface IImageState {
  spans: any
}

export default class Gallery extends React.Component<IImageProps, IImageState> {

  // private backURL:React.CSSProperties = { backgroundImage: `url('${this.props.photo.photo}')` };
  private imageRef: any;
  
  constructor(props: any){
    super(props);  
    this.state = {spans:0};
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

  public render(): React.ReactElement<IImageProps> {
    return (
      <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
        <img ref={this.imageRef} src={this.props.photo.photo} />
      </div>
    );
  }
}
