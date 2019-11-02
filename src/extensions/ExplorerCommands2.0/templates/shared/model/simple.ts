import { IFileTemplateArgs, ITemplateExporter } from '../../types';

const __getters = (args: IFileTemplateArgs) => `import * as schema from './schema';
import { ${args.upperCamelCase} } from './index';

/**
 * ! Add Some Description here
 */
const entries = {
	
};

export default {
	
};
`

const __schema = (args: IFileTemplateArgs) => `/**
 * Helper Types
 */

/**
* The API representation of the [ ${args.humanCase} ]
*/
export interface IAPI${args.upperCamelCase} {
	
};

/**
* The Frontend representation of the [ ${args.humanCase} ]
*/
export interface I${args.upperCamelCase} {
   
}
`

const __index = (args: IFileTemplateArgs) => `import R from 'ramda';
import getters from './getters';
import * as schema from './schema';

/**
 * Transform an API [ ${args.humanCase} ] into an
 * item with the frontend abstractions
 *
 * @param {schema.IAPI${args.upperCamelCase}} entry
 *
 * @return {I${args.upperCamelCase}}
 */
function init<T>(entry: schema.IAPI${args.upperCamelCase}): schema.I${args.upperCamelCase} {
	const output = R.pipe(
		// R.assoc('slug', slug),
		// R.assoc('name', humanName)
	)({});

	return output;
}

export const ${args.upperCamelCase} = {
	init,
	...getters,
};
`
const exportDefault: ITemplateExporter<'shared', 'model'> = {
	generator: {
		index: {
			content: __index,
			fileName: (fN: string) => `${fN}/index.ts`,
		},
		getters: {
			content: __getters,
			fileName: (fN: string) => `${fN}/getters.ts`,
		},
		schema: {
			content: __schema,
			fileName: (fN: string) => `${fN}/schema.ts`,
		}
	},
	optionQuery: "Create Simple Model"
}

export default exportDefault;