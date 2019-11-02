import { IFileTemplateArgs, ITemplateExporter } from '../../types';

const __getters = (args: IFileTemplateArgs) => `// Global Imports
import R from 'ramda';

// Local Imports
import * as schema from './schema';

/**
 * ! Add Some Description here
 */
const entries = {
	
};

export default {
	
};
`

const __schema = (args: IFileTemplateArgs) => `
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

const __index = (args: IFileTemplateArgs) => `// Global Imports
import R from 'ramda';

// Local Imports
import getters from './getters';
import * as schema from './schema';
import * as types from './types';
import * as producers from './producers';

/**
 * Transform an API [ ${args.humanCase} ]into an
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
	...producers
};
`

const __producers = (args: IFileTemplateArgs) => `// Global Imports
import R from 'ramda';

// Local Imports
import * as schema from './schema';
import * as types from './types';

`

const __types = (args: IFileTemplateArgs) => `// Local Imports
import * as schema from './schema';
import * as types from './types';

`

const exportDefault: ITemplateExporter<'shared', 'modelWithProducer'> = {
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
		},
		types: {
			content: __types,
			fileName: (fN: string) => `${fN}/types.ts`,
		},
		producers: {
			content: __producers,
			fileName: (fN: string) => `${fN}/producers.ts`,
		}
	},
	optionQuery: "Create Model with Producer"
}

export default exportDefault;