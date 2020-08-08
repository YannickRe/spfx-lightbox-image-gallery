import * as React from 'react';
// import styles from './BreadCrumb.modules.scss';
import { IBreadCrumbProps } from './BreadCrumbProps';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';


export default class BreadCrumb extends React.Component<IBreadCrumbProps, {}> {

    private labelStyles: Partial<ILabelStyles> = {
        root: { margin: '10px 0', selectors: { '&:not(:first-child)': { marginTop: 24 } } },
    };

  public render(): React.ReactElement<IBreadCrumbProps> {
    return (
        <div>
            <Breadcrumb
                items={this.props.items}
                maxDisplayedItems={5}
                ariaLabel="Breadcrumb with items rendered as buttons"
                overflowAriaLabel="..."
            />
        </div>
    );
  }
}
