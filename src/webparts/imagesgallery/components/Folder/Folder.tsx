import * as React from 'react';
import { IFolderProps } from './IFolderProps';
import styles from '../ImagesGalleryWebPart.module.scss';

const _foldericonright: string = require('./icons/folderIconRight.svg'); // eslint-disable-line @typescript-eslint/no-var-requires
const _foldericonleft: string = require('./icons/folderIconLeft.svg'); // eslint-disable-line @typescript-eslint/no-var-requires

export default class Folder extends React.Component<IFolderProps, {}> {

  constructor(props: IFolderProps){
    super(props);
  }

  public render(): React.ReactElement<IFolderProps> {
    return (
      <div title={this.props.folderInfo.Name} className={styles.folderTile} onClick={(e) => this.props.onClick(this.props.folderInfo)}>
        <div className={styles.folderTileContent}>
          <div className={styles.folderIcon}>
            <i aria-hidden="true">
              <img src={_foldericonleft} />
            </i>
            <div className={styles.folderPaper} />
            <i aria-hidden="true" className={styles.folderFront}>
              <img src={_foldericonright} />
            </i>
            <span className={styles.folderCount}>{this.props.folderInfo.ItemCount}</span>
          </div>
          <span className={styles.folderTileNamePlate}>
            <span className={styles.folderTileName}>
                <div className={styles.folderTileNameText}>{this.props.folderInfo.Name}</div>
            </span>
          </span>
        </div>
      </div>
    );
  }
}
