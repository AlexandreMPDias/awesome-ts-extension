
/**
 * Valid Template Keys
 */
export type DumbComponentTemplateKeys = 'index' | 'styles' | 'types';
export type ComponentTemplateKeys = 'index' | 'types' | 'container';
export type StoreTemplateKeys = 'actions' | 'operations' | 'reducers' | 'types' | 'selectors';

export type Key = DumbComponentTemplateKeys | StoreTemplateKeys | ComponentTemplateKeys;

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
	key: DumbComponentTemplateKeys | StoreTemplateKeys;
}


export type ExportFileTemplate = (args: IFileTemplateArgs) => string;


export type FileTemplate = { [key in ComponentTemplateKeys]: ExportFileTemplate } | { [key in DumbComponentTemplateKeys]: ExportFileTemplate } | { [key in StoreTemplateKeys]: ExportFileTemplate };

type ActualCommandKeys = "Native Component" | "Web Component" | "Redux-Store Directory" | 'Container';

export type CommandKeys = ActualCommandKeys | "Cancel";