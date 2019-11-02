
export interface IFileTemplateArgs
{
	lowerCamelCase: string;
	upperCamelCase: string;
	humanCase: string;
}

type TemplateGenerator = {
	content: (arg: IFileTemplateArgs) => string
	fileName: (fileName: string) => string
}

type TemplateKeyFunction<Keys extends string> = {
	generator: { [key in Keys]: TemplateGenerator };
	optionQuery: string;
};

export interface ITemplates
{
	native: {
		functionComponent: TemplateKeyFunction<'index' | 'styles' | 'types'>
	},
	shared: {
		reduxStore: TemplateKeyFunction<'actions' | 'operations' | 'reducers' | 'selectors' | 'types'>,
		model: TemplateKeyFunction<'index' | 'getters' | 'schema'>,
		modelWithProducer: TemplateKeyFunction<'index' | 'getters' | 'schema' | 'types' | 'producers'>
	},
}

export type ITemplateExporter<T extends keyof ITemplates, K extends keyof ITemplates[T]> = ITemplates[T][K];

export interface IFinalTemplate
{
	fileName: string;
	content: string;
}