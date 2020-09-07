import * as React from 'react';
import styles from './gallery.module.scss';
import { IGalleryProps } from './IgalleryProps';
import Image from './image/image';



export default class Gallery extends React.Component<IGalleryProps, {}> {
  private gridSize:React.CSSProperties;
  private amountColumsCSS:React.CSSProperties;
  
  constructor(props: any){
    super(props);

    this.amountColumsCSS = {
      columnCount: 3
    }

    this.imageClicked = this.imageClicked.bind(this)
  }

  public render(): React.ReactElement<IGalleryProps> {
    return (
      <div className="maingrid" style={this.gridSize}>
        <div className={styles["photo-list"]} style={this.amountColumsCSS}>
          {
            this.props.photos.map((_photo, _index) => {
                return <Image photoClicked={(i) => this.imageClicked(i)} index={_index} photo={_photo} ></Image>
            })
          }
        </div> 
      </div>  
    );
  }

  private imageClicked(imgIndex: number) {
    this.props.imgClicked(imgIndex);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.amountColumns != nextProps.amountColumns) {
      this.amountColumsCSS = {
        columnCount: nextProps.amountColumns
      }
    }
  }

  
}
