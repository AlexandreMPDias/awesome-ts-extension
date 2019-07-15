import { ExportFileTemplate, FileTemplate, IFileTemplateArgs } from '../types';

const __actions: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Package Imports
import {  } from '@liberedu/types';

import { ${upperCamelCase}Types } from './${lowerCamelCase}Types';

export interface I${upperCamelCase}Actions {
	/**
	 * Fetch ${upperCamelCase}
	 * This function does this and that
	 */
	fetch${upperCamelCase}: (${lowerCamelCase}Uuid: string) => any;

}

const ${lowerCamelCase}Actions: I${upperCamelCase}Actions = {
	fetch${upperCamelCase}: (${lowerCamelCase}Uuid: string): any => {
		//empty
	}
}

export default ${lowerCamelCase}Actions;
`

const __operations: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Global Imports
import { takeLatest, apply, put } from 'redux-saga/effects';

// Package Imports
import { ApiService, NavigationService, AlertService } from '@liberedu/services';
import {  } from '@liberedu/types';

// Types Imports
import { ${upperCamelCase}Types } from './${lowerCamelCase}Types';

function* handleError(error) {
	if (error) {
		const errorMessage = [error.data.message];
		yield put({ type: ${upperCamelCase}Types.ERROR, errors: errorMessage });
	}
}

function* sample(action: IDontLeaveAnyHere) {
	try {
		const response = yield apply(ApiService, ApiService.post, [
			'${lowerCamelCase}/',
			{},
		]);
		const value = response.data.data;
		yield put({ type: ${upperCamelCase}Types.SOMETHING, value });
	} catch (errors) {
		handleError(errors).next()
	}
}

const ${lowerCamelCase}Operations = [
	takeLatest(${upperCamelCase}Types.SOMETHING_SUCCESS, sample),
];

export default ${lowerCamelCase}Operations;
`

const __reducers: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Global Imports
import { combineReducers } from 'redux';

// Package Imports
import { IApiError } from '@liberedu/types';
import { AlertService } from '@liberedu/services';

// Types Imports
import { ${upperCamelCase}Types, ${upperCamelCase}ActionTypes, I${upperCamelCase}State } from './${lowerCamelCase}Types';

const initialState : I${upperCamelCase}State = {
	errors: {} as IApiError,
	// empty
}

const store = (state : I${upperCamelCase}State = initialState, action: ${upperCamelCase}ActionTypes): I${upperCamelCase}State => {
	
	switch(action.type) {
		case ${upperCamelCase}Types.SOMETHING: {
			return {
				...state
			}
		}
		case ${upperCamelCase}Types.ERROR: {
			return {
				...state,
				errors: action.errors
			}
		}
		default {
			return state;
		}
	}
}

export default combineReducers({
	store,
});

export interface I${upperCamelCase}Reducers {
	store: I${upperCamelCase}State;
}

`

const __selectors: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `export interface I${upperCamelCase}Selectors {
	sampleSelector: (state: any) => IDontLeaveAnyHere;
}

const ${lowerCamelCase}Selectors: I${upperCamelCase}Selectors = {
	sampleSelector: (state: any) : IDontLeaveAnyHere => state.core.user.${lowerCamelCase}.store.sample,
};

export default ${lowerCamelCase}Selectors;
`

const __types: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `import { IApiError } from '@liberedu/types';

/**
 * ${upperCamelCase}'s Types
 */
export enum ${upperCamelCase}Types {
	ERROR = 'core/user/${lowerCamelCase}/ERROR',
	
}

/**
 * ${upperCamelCase}'s State
 */
export interface I${upperCamelCase}State {
	errors: IApiError;
}

export interface I${upperCamelCase}Error {
	type: typeof ${upperCamelCase}Types.ERROR;
	errors: IApiError;
}

export type ${upperCamelCase}ActionTypes = I${upperCamelCase}Error;
`
const exportDefault: FileTemplate = {
	actions: __actions,
	operations: __operations,
	reducers: __reducers,
	selectors: __selectors,
	types: __types

}

export default exportDefault;