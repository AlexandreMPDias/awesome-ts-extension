import { ExportFileTemplate, FileTemplate, IFileTemplateArgs } from '../types';

const __indexContent: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Global Imports
import React, { Component } from 'react';
import { View, Text } from 'react-native';

// Package Imports
import { IconKeys } from '@liberedu/assets';  // '../../assets';
import {  } from '@liberedu/services';

// Style and Types Imports
import Style, {} from './${lowerCamelCase}Styles';
import { I${upperCamelCase}Props, I${upperCamelCase}State } from './${lowerCamelCase}Types';

/**
 * Class ${upperCamelCase.replace(/([a-z])([A-Z])/, '$1 $2')}
 */
class ${upperCamelCase} extends Component<I${upperCamelCase}Props, I${upperCamelCase}State> {
	constructor(props: I${upperCamelCase}Props) {
		super(props);
		this.state = {
			// empty
		};
	}

	render() {
		return <View style={Style.mainContainer}>
			<Text>hey cutie</Text>
		</View>
	}
	
}

// export default ReduxService.betterConnect({
// 	// selectors
// },{
// 	// actions
// })(${upperCamelCase});

export default ${upperCamelCase}	
`

const __style: ExportFileTemplate = ({ }: IFileTemplateArgs) => `// Global Imports
import { StyleSheet } from 'react-native';

// Package
import { IconKeys } from '@liberedu/assets';  // '../../assets';
import { FontService } from '@liberedu/services';

export default StyleSheet.create({
	mainContainer: {
		// empty
	}
})
`

const __type: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Global Imports
import { StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

/**
 * I${upperCamelCase}'s Selectors
 */
export interface I${upperCamelCase}Selectors {

}

/**
 * I${upperCamelCase}'s Actions
 */
export interface I${upperCamelCase}Actions {

}

/**
 * I${upperCamelCase}'s Props
 */
export interface I${upperCamelCase}Props extends I${upperCamelCase}Actions, I${upperCamelCase}Selectors {

}

/**
 * I${upperCamelCase}'s State
 */
export interface I${upperCamelCase}State {

}
`

const exportDefault: FileTemplate = {
	index: __indexContent,
	styles: __style,
	types: __type
}

export default exportDefault;