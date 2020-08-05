import { IPropertyPaneCustomFieldProps, IPropertyPaneField, PropertyPaneFieldType } from "@microsoft/sp-property-pane";
import { } from "@microsoft/sp-webpart-base";
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { CreateImageSource, ICreateImageSourceProps } from './CreateImageSource';


export interface IPropertyPaneCreateImageSourceInternalProps extends ICreateImageSourceProps, IPropertyPaneCustomFieldProps {
}

export class PropertyPaneCreateImageSource implements IPropertyPaneField<IPropertyPaneCreateImageSourceInternalProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneCreateImageSourceInternalProps;
  private elem: HTMLElement;

  constructor(targetProperty: string, properties: ICreateImageSourceProps) {
    this.targetProperty = targetProperty;
    this.properties = {
      key: properties.buttonLabel,
      buttonLabel: properties.buttonLabel,
      saveAction: properties.saveAction,
      dialogText: properties.dialogText,
      dialogTitle: properties.dialogTitle,
      onRender: this.onRender.bind(this)
    };
  }

  public render(): void {
    if (!this.elem) {
      return;
    }

    this.onRender(this.elem);
  }

  private onRender(elem: HTMLElement): void {
    if (!this.elem) {
      this.elem = elem;
    }

    const element: React.ReactElement<ICreateImageSourceProps> = React.createElement(CreateImageSource, {
      buttonLabel: this.properties.buttonLabel,
      saveAction: this.properties.saveAction,
      dialogText: this.properties.dialogText,
      dialogTitle: this.properties.dialogTitle
    });
    ReactDom.render(element, elem);
  }
}