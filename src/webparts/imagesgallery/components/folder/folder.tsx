import * as React from 'react';
import { IFolderIconProps } from './IFolderProps';
import { IFolderInfo } from "@pnp/sp/folders";
import styles from './folder.module.scss';
import { folderIconState } from './IFolderState';


const _foldericonright: any = require('../../assets/folderIconRight.svg');
const _foldericonleft: any = require('../../assets/folderIconLeft.svg');


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
                      <div className={styles.folderBackground}  onClick={(e) => this.selectedFolder(item)}>
                        <div className={styles.folderContainer} onMouseEnter={() => this.setState({ hoverKey: i })} onMouseLeave={() => this.setState({ hoverKey: null })} key={i}>
                            <img src={_foldericonleft} />
                            <div className={`${styles.folderPaper} ${this.state.hoverKey === i ? styles.folderPaperUp : styles.folderPaperDown}`}></div>
                            <img className={styles.folderFront} src={_foldericonright} />
                          <div className={styles.folderInformation}>
                            <div className={styles.folderCount}>{item.ItemCount}</div>
                            <div className={styles.folderName}>{item.Name}</div>
                          </div>
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
