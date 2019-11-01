import { ExportFileTemplate, FileTemplate, IFileTemplateArgs } from '../../types';

const __indexContent: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Global Imports
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// Package Imports
import { IconKeys } from '@liberedu/assets';  // '../../assets';
import {  } from '@liberedu/services';

// Style and Types Imports
import Style, {} from './${lowerCamelCase}Styles';
import { I${upperCamelCase}Props, I${upperCamelCase}State } from './${lowerCamelCase}Types';

const withState = () : I${upperCamelCase}State => {

    const [ text, setText ] = useState<string>('weee');

    return {
        get text() {
            return text;
        },
        set text(x : string) {
            setText(x);
        }
    }
}

/**
 * Component ${upperCamelCase.replace(/([a-z])([A-Z])/, '$1 $2')}
 */
const ${upperCamelCase} : React.FunctionComponent<I${upperCamelCase}Props> = (props) => {
    
    const state = withState();

    return 
        <View style={Style.mainContainer}>
			<Text>{state.text}</Text>
		</View>
}

export default ${upperCamelCase}	
`

const __style: ExportFileTemplate = ({ }: IFileTemplateArgs) => `// Global Imports
import { StyleSheet } from 'react-native';

// Package
import { IconKeys, style } from '@liberedu/components-app';  // '../../assets';
import { FontService } from '@liberedu/services';

const { colors } = style.theme;

export default StyleSheet.create({
	mainContainer: {
		// empty
	}
})
`

const __type: ExportFileTemplate = ({ upperCamelCase, lowerCamelCase }: IFileTemplateArgs) => `// Global Imports
import { StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

/**
 * I${upperCamelCase}'s Props
 */
export interface I${upperCamelCase}Props {

}

/**
 * I${upperCamelCase}'s State
 */
export interface I${upperCamelCase}State {
    text: string;
}
`

const exportDefault: FileTemplate = {
    index: __indexContent,
    styles: __style,
    types: __type
}

export default exportDefault;