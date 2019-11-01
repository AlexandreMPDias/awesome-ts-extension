interface ITemplateArg
{
	upperCamelCase: string;
	lowerCamelCase: string
}
type TemplateGenerator = {
	content: (arg: ITemplateArg) => string
	fileName: (fileName: string) => string
}

type TemplateKeyFunction<Keys extends string | number | symbol> = { [key in Keys]: TemplateGenerator };

export interface ITemplates
{
	native: {
		functionComponent: TemplateKeyFunction<'index' | 'styles' | 'types'>
	},
	shared: {
		reduxStore: TemplateKeyFunction<'actions' | 'operations' | 'reducers' | 'selectors' | 'types'>,
		model: TemplateKeyFunction<'index' | 'getters' | 'schema'>,
	},
}

export type ITemplateSimple = {
	[key in keyof ITemplates]: {
		[kkey in keyof ITemplates[key]]:
		TemplateKeyFunction<keyof ITemplates[key][kkey]>
	}
}