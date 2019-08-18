import { ExportFileTemplate, FileTemplate, IFileTemplateArgs } from '../types';

function space (word: string): string
{
	return word.replace(/([a-z])([A-Z])/, '$1 $2');
}

const __indexContent: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Local Imports
import withContainer from './${lowerCamelCase}Types';

// Types Imports
import { I${upperCamelCase}ChildProps } from './${lowerCamelCase}Types';

// tslint:disable-next-line: no-namespace
export namespace ${lowerCamelCase} {
	export type Props = I${upperCamelCase}ChildProps;
	export const wrap = withContainer;
}

`

const __container: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Global Imports
import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

// Package Imports
import sharedStore from '@liberedu/redux-store';
import { ReduxService } from '@liberedu/services';

// Types Imports
import { 
	I${upperCamelCase}ParentProps,
	I${upperCamelCase}ReduxProps,
	I${upperCamelCase}ChildProps,
	I${upperCamelCase}Props,
	I${upperCamelCase}State,
	ClassProps
} from './${lowerCamelCase}Types';

function ${lowerCamelCase}HOC<T>(
	WrappedComponent: T
): React.ComponentClass<ClassProps<T>> {

	class ${upperCamelCase}HOC extends Component<I${upperCamelCase}Props, I${upperCamelCase}State> {
		constructor(props: I${upperCamelCase}Props) {
			super(props);
			this.state = {
				// empty
			};
		}
	
		render() {
			const MyComponent = (WrappedComponent as unknown) as React.ComponentType<
				I${upperCamelCase}ChildProps
			>;
			return (
				<MyComponent
					{...this.props}
				/>
			);
		}	
	}


	const select = sharedStore.selectors;
	const action = sharedStore.actions;
	
	const mapStateToProps = (state: any) => {
		return {
			// sessions: select.core.[...],
		};
	};

	const mapDispatchToProps = (dispatch: Dispatch) => {
		return bindActionCreators({
			// fetchSomething: action.core.[...],
		}, dispatch);
	};

	const connection = connect(
		mapStateToProps,
		mapDispatchToProps
	);

	return (connection(${upperCamelCase}HOC) as unknown) as React.ComponentClass<ClassProps<T>>;
}

export default ${lowerCamelCase}HOC;	

`

const __type: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `

/**
 * Props to be received from the Container Parents.
 * These properties **should** always be optional, as to create less dependencies between containers
 */
export interface I${upperCamelCase}ParentProps {

}

/**
 * The Container's ReduxProps
 * Properties that come from the Redux-Store
 */
export interface I${upperCamelCase}ReduxProps {

}

/**
 * The Container's Child Props
 * Props that the Wrapped Component **must** posses.
 */
export interface I${upperCamelCase}ChildProps {

}

/**
 * The Container's State
 */
export interface I${upperCamelCase}State {

}

// ! The following interfaces/types should not be touched.

/**
 * I${upperCamelCase}'s Props
 */
export type I${upperCamelCase}Props = I${upperCamelCase}ReduxProps & I${upperCamelCase}ParentProps;

/**
 * Extract the Child's Props (without the one that should be included from this Container)
 */
type PureDumbProps<T> = Omit<Props<T>, keyof I${upperCamelCase}ChildProps>;

export type ClassProps<T> = I${upperCamelCase}ParentProps & PureDumbProps<T>;

`

const exportDefault: FileTemplate = {
	index: __indexContent,
	types: __type,
	container: __container
}

export default exportDefault;