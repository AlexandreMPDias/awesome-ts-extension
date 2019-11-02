import { IFileTemplateArgs, ITemplateExporter } from '../../types';

const __actions = (args: IFileTemplateArgs) => `// Package Imports
import {  } from '@liberedu/types';

import { ${args.upperCamelCase}Types } from './${args.lowerCamelCase}Types';

export interface I${args.upperCamelCase}Actions {
	/**
	 * Fetch ${args.humanCase}
	 * This function does this and that
	 */
	fetch${args.upperCamelCase}: (${args.lowerCamelCase}Uuid: string) => any;

}

const ${args.lowerCamelCase}Actions: I${args.upperCamelCase}Actions = {
	fetch${args.upperCamelCase}: (${args.lowerCamelCase}Uuid: string): any => {
		//empty
	}
}

export default ${args.lowerCamelCase}Actions;
`

const __operations = (args: IFileTemplateArgs) => `// Global Imports
import { takeLatest, apply, put } from 'redux-saga/effects';

// Package Imports
import { ApiService, NavigationService, AlertService } from '@liberedu/services';
import {  } from '@liberedu/types';

// Types Imports
import { ${args.upperCamelCase}Types } from './${args.lowerCamelCase}Types';

function* handleError(error) {
	if (error) {
		const errorMessage = [error.data.message];
		yield put({ type: ${args.upperCamelCase}Types.ERROR, errors: errorMessage });
	}
}

function* sample(action: IDontLeaveAnyHere) {
	try {
		const response = yield apply(ApiService, ApiService.post, [
			'${args.lowerCamelCase}/',
			{},
		]);
		const value = response.data.data;
		yield put({ type: ${args.upperCamelCase}Types.SOMETHING, value });
	} catch (errors) {
		handleError(errors).next()
	}
}

const ${args.lowerCamelCase}Operations = [
	takeLatest(${args.upperCamelCase}Types.SOMETHING_SUCCESS, sample),
];

export default ${args.lowerCamelCase}Operations;
`

const __reducers = (args: IFileTemplateArgs) => `// Global Imports
import { combineReducers } from 'redux';
import { produce } from 'immer';

// Package Imports
import { IApiError } from '@liberedu/types';
import { AlertService } from '@liberedu/services';

// Types Imports
import { ${args.upperCamelCase}Types, ${args.upperCamelCase}ActionTypes, I${args.upperCamelCase}State } from './${args.lowerCamelCase}Types';

const initialState : I${args.upperCamelCase}State = {
	errors: {} as IApiError,
	// empty
}

const store = (state : I${args.upperCamelCase}State = initialState, action: ${args.upperCamelCase}ActionTypes): I${args.upperCamelCase}State => {
	return produce(state, draft => {
		switch(action.type) {
			case ${args.upperCamelCase}Types.SOMETHING: {
				// Something
				break;
			}
			case ${args.upperCamelCase}Types.ERROR: {
				draft.errors = action.errors;
				break;
			} 
		}
	})
}

export default combineReducers({
	store,
});

export interface I${args.upperCamelCase}Reducers {
	store: I${args.upperCamelCase}State;
}
`

const __selectors = (args: IFileTemplateArgs) => `export interface I${args.upperCamelCase}Selectors {
	sampleSelector: (state: any) => IDontLeaveAnyHere;
}

const ${args.lowerCamelCase}Selectors: I${args.upperCamelCase}Selectors = {
	sampleSelector: (state: any) : IDontLeaveAnyHere => state.core.user.${args.lowerCamelCase}.store.sample,
};

export default ${args.lowerCamelCase}Selectors;
`

const __types = (args: IFileTemplateArgs) => `import { IApiError } from '@liberedu/types';

/**
 * ${args.humanCase}'s Types
 */
export enum ${args.upperCamelCase}Types {
	ERROR = 'core/user/${args.lowerCamelCase}/ERROR',
	
}

/**
 * ${args.humanCase}'s State
 */
export interface I${args.upperCamelCase}State {
	errors: IApiError;
}

export interface I${args.upperCamelCase}Error {
	type: typeof ${args.upperCamelCase}Types.ERROR;
	errors: IApiError;
}

export type ${args.upperCamelCase}ActionTypes = I${args.upperCamelCase}Error;
`
const exportDefault: ITemplateExporter<'shared', 'reduxStore'> = {
	generator: {
		actions: {
			content: __actions,
			fileName: (fN: string) => `store/${fN}Actions.ts`,
		},
		operations: {
			content: __operations,
			fileName: (fN: string) => `store/${fN}Operations.ts`,
		},
		reducers: {
			content: __reducers,
			fileName: (fN: string) => `store/${fN}Reducers.ts`,
		},
		selectors: {
			content: __selectors,
			fileName: (fN: string) => `store/${fN}Selectors.ts`,
		},
		types: {
			content: __types,
			fileName: (fN: string) => `store/${fN}Types.ts`,
		}
	},
	optionQuery: "Create Redux Store"
}

export default exportDefault;