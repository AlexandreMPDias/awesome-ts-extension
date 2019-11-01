import { ExportFileTemplate } from '../../../types';

const __indexContent = (a: any) => `// Global Imports
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// Package Imports
import { IconKeys } from '@liberedu/assets';  // '../../assets';
import {  } from '@liberedu/services';

// Style and Types Imports
import Style, {} from './${a.lowerCamelCase}Styles';
import { I${a.upperCamelCase}Props, I${a.upperCamelCase}State } from './${a.lowerCamelCase}Types';

const withState = () : I${a.upperCamelCase}State => {

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
 * Component ${a.upperCamelCase.replace(/([a-z])([A-Z])/, '$1 $2')}
 */
const ${a.upperCamelCase} : React.FunctionComponent<I${a.upperCamelCase}Props> = (props) => {
    
    const state = withState();

    return 
        <View style={Style.mainContainer}>
			<Text>{state.text}</Text>
		</View>
}

export default ${a.upperCamelCase}	
`

const __style = (a: any) => `// Global Imports
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

const __type = (a: any) => `// Global Imports
import { StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

/**
 * I${a.upperCamelCase}'s Props
 */
export interface I${a.upperCamelCase}Props {

}

/**
 * I${a.upperCamelCase}'s State
 */
export interface I${a.upperCamelCase}State {
    text: string;
}
`

const exportDefault = {
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
}

export default exportDefault;