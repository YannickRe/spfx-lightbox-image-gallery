import * as React from 'react';
import { IFolderIconProps } from './folderProps';

const _foldericon: any = require('../../assets/folderIcon.svg');
export default class FolderIcon extends React.Component<IFolderIconProps, {}> {

  public render(): React.ReactElement<IFolderIconProps> {
    return (
        <div>
            {
                this.props.items.map((item, i) => {
                    return (<img key={i} src={_foldericon} />)
                })
            }
        </div>
    );
  }
}
