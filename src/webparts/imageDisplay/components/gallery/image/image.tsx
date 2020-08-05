import * as React from 'react';
import { IImageProps } from './imageProps';
// import styles from './image.module.scss';
import styles from '../gallery.module.scss';


export default class Gallery extends React.Component<IImageProps, {}> {

  private backURL:React.CSSProperties = { backgroundImage: `url('${this.props.photo.photo}')` };
  
  constructor(props: any){
    super(props);  
  }  

  public render(): React.ReactElement<IImageProps> {
    return (
      <figure className={`${styles.picture} ${styles.loaded}`}>
        <div className={styles.bg} style={this.backURL}>
          <img src={this.props.photo.photo} />
        </div>
      </figure> 
    );
  }
}
