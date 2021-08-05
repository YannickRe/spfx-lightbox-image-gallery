import * as React from 'react';
import styles from '../ImagesGalleryWebPart.module.scss';
import { IFolderListProps } from './IFolderListProps';
import Folder from '../Folder/Folder';

export default class FolderList extends React.Component<IFolderListProps, {}> {
  constructor(props: IFolderListProps){
    super(props);
  }

  public render(): React.ReactElement<IFolderListProps> {
    const allFolders = [];
    this.props.foldersInfo.forEach((folder, index) => {
      allFolders.push(<Folder key={index} folderInfo={folder} onClick={(folderInfo) => this.props.onClick(folderInfo)} />);
    });
    
    return (
        <div className={styles.folderList}>
          {allFolders}
        </div>
    );
  }
}
