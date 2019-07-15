/**
 * Valid Template Keys
 */
export type ComponentTemplateKeys = 'index' | 'styles' | 'types';
export type StoreTemplateKeys = 'actions' | 'operations' | 'reducers' | 'types' | 'selectors';

export type Key = ComponentTemplateKeys | StoreTemplateKeys;
/**
 * -----------------------
 */
export interface IFileTemplateArgs
{
	lowerCamelCase: string;
	upperCamelCase: string;
}

export interface IFinalTemplate
{
	fileName: string;
	content: string;
}

export interface TemplateKey extends IFileTemplateArgs
{
	key: ComponentTemplateKeys | StoreTemplateKeys;
}


export type ExportFileTemplate = (args: IFileTemplateArgs) => string;


export type FileTemplate = { [key in ComponentTemplateKeys]: ExportFileTemplate } | { [key in StoreTemplateKeys]: ExportFileTemplate };

type ActualCommandKeys = "Create Awesome Native Component" | "Create Awesome Web Component" | "Create Awesome Redux-Store Directory";
export type CommandKeys = ActualCommandKeys | "Cancel";