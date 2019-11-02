import { IFileTemplateArgs, ITemplateExporter } from '../../types';

const __indexContent = (args: IFileTemplateArgs) => `// Global Imports
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// Package Imports
import { IconKeys } from '@liberedu/assets';  // '../../assets';
import {  } from '@liberedu/services';

// Style and Types Imports
import Style, {} from './${args.lowerCamelCase}Styles';
import { I${args.upperCamelCase}Props, I${args.upperCamelCase}State } from './${args.lowerCamelCase}Types';

const withState = () : I${args.upperCamelCase}State => {

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
 * Component ${args.humanCase}
 */
const ${args.upperCamelCase} : React.FunctionComponent<I${args.upperCamelCase}Props> = (props) => {
    
    const state = withState();

    return 
        <View style={Style.mainContainer}>
			<Text>{state.text}</Text>
		</View>
}

export default ${args.upperCamelCase}	
`

const __style = (args: IFileTemplateArgs) => `// Global Imports
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

const __type = (args: IFileTemplateArgs) => `// Global Imports
import { StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

/**
 * ${args.humanCase}'s Props
 */
export interface I${args.upperCamelCase}Props {

}

/**
 * ${args.humanCase}'s State
 */
export interface I${args.upperCamelCase}State {
    text: string;
}
`
const exportDefault: ITemplateExporter<'native', 'functionComponent'> = {
	generator: {
		index: {
			content: __indexContent,
			fileName: (fN: string) => `${fN}/index.tsx`
		},
		styles: {
			content: __style,
			fileName: (fN: string) => `${fN}/${fN}Styles.ts`
		},
		types: {
			content: __type,
			fileName: (fN: string) => `${fN}/${fN}Types.ts`
		},
	},
	optionQuery: "Create Functional Component"
}

export default exportDefault;