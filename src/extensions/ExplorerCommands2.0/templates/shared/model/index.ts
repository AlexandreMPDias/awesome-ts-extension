import { ExportFileTemplate, FileTemplate, IFileTemplateArgs } from '../../../types';

const __getters = (args: any) => `import * as schema from './schema';
import { ${args.upperCamelCase} } from './index';

/**
 * ! Add Some Description here
 */
const entries = {
	
};

/**
 * Map the API Request Type slug into a friendly name
 */
export function getHumanName<T>(slug: IStatusSlug<T>): string {
	return entries[slug as string];
}

/**
 * Get the request type formatted into the
 * frontend abstraction
 *
 * @param {IRequestTypeApiSlugs[] | undefined} sessions
 */
export function getEntry<T>(key: IStatusSlug<T>): IStatus<T> {
	return Status.init(slug);
}

export default {
	
};
`

const __schema = (args: any) => `/**
* Helper types
*/


/**
* The API representation of the ${args.upperCamelCase}
*/
export interface IAPI${args.upperCamelCase} {
	
};

/**
* The Frontend representation of the Request Type
*/
export interface I${args.upperCamelCase} {
   
}
`

const __index = (args: any) => `import R from 'ramda';
import getters from './getters';
import * as schema from './schema';

/**
 * Transform a Request Api ${args.lowerCamelCase} into an
 * item with the frontend abstractions
 *
 * @param {schema.IAPI${args.lowerCamelCase}} entry
 *
 * @return {I${args.lowerCamelCase}}
 */
function init<T>(entry: schema.IAPI${args.lowerCamelCase}): I${args.lowerCamelCase} {
	const output = R.pipe(
		// R.assoc('slug', slug),
		// R.assoc('name', humanName)
	)({});

	return output;
}

export const ${args.lowerCamelCase} = {
	init,
	...getters,
};
`

const exportDefault = {
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
}

export default exportDefault;