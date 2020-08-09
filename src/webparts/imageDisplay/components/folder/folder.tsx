import * as React from 'react';
import { IFolderIconProps } from './folderProps';
import { IFolderInfo } from "@pnp/sp/folders";
import styles from './folder.module.scss';


const _foldericonright: any = require('../../assets/folderIconRight.svg');
const _foldericonleft: any = require('../../assets/folderIconLeft.svg');

export interface folderIconState {
  hoverKey: any;
}

export default class FolderIcon extends React.Component<IFolderIconProps, folderIconState> {

  constructor(props){
    super(props);

    this.state = {
      hoverKey: null
    }
  }

  public render(): React.ReactElement<IFolderIconProps> {
    return (
        <div className={styles.folderMain}>
            {
                this.props.items.map((item: IFolderInfo, i) => {
                    return (
                      <div className={styles.folderContainer} onMouseEnter={() => this.setState({ hoverKey: i })} onMouseLeave={() => this.setState({ hoverKey: null })} key={i} onClick={(e) => this.selectedFolder(item)}>
                          <img src={_foldericonleft} />
                          <div className={`${styles.folderPaper} ${this.state.hoverKey === i ? styles.folderPaperUp : styles.folderPaperDown}`}></div>
                          <img className={styles.folderFront} src={_foldericonright} />
                        <div className={styles.folderInformation}>
                          <div className={styles.folderCount}>{item.ItemCount}</div>
                          <div className={styles.folderName}>{item.Name}</div>
                        </div>
                      </div>
                    )
                })
            }
        </div>
    );
  }

  private selectedFolder(folderData: IFolderInfo) {
    this.props.folderClicked(folderData);
  }
}
