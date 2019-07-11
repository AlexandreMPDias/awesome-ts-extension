import * as vscode from 'vscode';
import Help from './helpers';

interface IFuncValues {
	name: string;
	args: Array<{ name: string, type: string }>;
	retType: string;
}

class Commentify {
	readonly values: IFuncValues;
	readonly identation: number;

	constructor(values: IFuncValues, tabIdentation: number = 0) {
		this.values = values;
		this.identation = tabIdentation;
	}

	/**
	 * Commentify the Arguments
	 * 
	 * @return {string[]} an array of lines to be rendered.
	 */
	commentifyArgs(): string[] {
		const retVal: string[] = [];
		if (this.values.args.length > 0) {
			this.values.args.forEach(entry => {
				retVal.push(` * @param {${entry.type}} ${entry.name} `);
			});
		}
		return retVal;
	}

	/**
	 * Commentify the Return
	 * 
	 * @return {string} a line to be rendered.
	 */
	commentifyRet(): string {
		if (this.values.retType.length > 0) {
			return ` * @return {${this.values.retType}} `;
		}
		return '';
	}

	all() {
		const lines = [];
		const start = '/**';
		const prepend = ' * ';
		const end = ' */';
		lines.push(start);
		lines.push(`${prepend}${this.values.name}`);
		this.commentifyArgs().forEach((argLine, index) => {
			if (index === 0) {
				lines.push(prepend);
			}
			lines.push(argLine);
		});
		const retLine = this.commentifyRet();
		if (retLine.length > 0) {
			lines.push(prepend);
			lines.push(retLine);
		}
		lines.push(end);
		return lines.join('\n');
	}
}

/**
 * Filters the
 * @param editor 
 */
function handleSelection(editor: vscode.TextEditor): string {
	const singleLine = editor.document.getText(editor.selection)
		.replace(/^(\w+\s)?(\w+\s?=\s?.+)/, '$2')
		.replace(/\s|\n|\t/g, '')
		.replace(/(.+)=>.+/, '$1');
	const fE = singleLine.indexOf("=");
	const lE = singleLine.lastIndexOf("=");
	if (fE !== lE) {
		return singleLine.substring(0, lE);
	}
	return singleLine;
}

function getIdentation(editor: vscode.TextEditor): number {
	// ! TODO
	return ''.replace(/^(\t+).+/g, '$1').length;
}

function tabs(size: number) {
	// TODO
	return '';// new Array(size).fill("\t").join('');
}

// function commentifyArgs(values: IFuncValues): string[] {
// 	const retVal: string[] = [];
// 	if (values.args.length > 0) {
// 		values.args.forEach(entry => {
// 			retVal.push(` * @param {${entry.type}} ${entry.name} `);
// 		});
// 	}
// 	return retVal;
// }

// function commentifyRet(values: IFuncValues): string {
// 	if (values.retType.length > 0) {
// 		return ` * @return {${values.retType}} `;
// 	}
// 	return '';
// }

// function commentify(values: IFuncValues) {
// 	const lines = [];
// 	const start = '/**';
// 	const prepend = ' * ';
// 	const end = ' */';
// 	lines.push(start);
// 	lines.push(`${prepend}${values.name}`);
// 	commentifyArgs(values).forEach((argLine, index) => {
// 		if (index === 0) {
// 			lines.push(prepend);
// 		}
// 		lines.push(argLine);
// 	});
// 	const retLine = commentifyRet(values);
// 	if (retLine.length > 0) {
// 		lines.push(prepend);
// 		lines.push(retLine);
// 	}
// 	lines.push(end);
// 	return lines.join('\n');
// }

function filterArguments(args: string): Array<{ name: string, type: string }> {
	const array: Array<{ name: string, type: string }> = [];
	args.split(",").forEach((valueAndType: string) => {
		const [name, type] = valueAndType.split(':');
		array.push({ name, type })
	});


	return array;
}

function generateDOCObject(text: string): IFuncValues {
	const values: IFuncValues = {
		name: '',
		args: [],
		retType: ''
	};
	if (text.startsWith('function')) {
		// return 'im sorry';
	} else {
		const firstEqualPos = text.indexOf("=");
		const argStart = text.indexOf("(", firstEqualPos) + 1;
		const argEnd = text.indexOf(")", argStart);
		values.name = text.substring(0, firstEqualPos);
		values.args = filterArguments(text.substring(argStart, argEnd));
		values.retType = text.substring(argEnd + 1).replace(/(:?)(.+)/, '$2').replace(/\s?(\w+)/, '$1');
	}
	values.name = values.name.charAt(0).toUpperCase() + values.name.slice(1);
	return values;
}

async function handleCommand() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return '';
	}
	try {
		const header = handleSelection(editor);
		const funcValues: IFuncValues = generateDOCObject(header);
		const commentify = new Commentify(funcValues);
		// vscode.window.showInformationMessage(getIdentation(editor) + '');

		Help.prependComment(editor, commentify.all());
	} catch (e) {
		vscode.window.showInformationMessage(`Awesome Extension Error: Malformed Selection.`);
	}
}

function activate(context: vscode.ExtensionContext) {
	// this code runs whenever your click 'Create Gist' from the context menu in your browser.
	let disposable = vscode.commands.registerCommand("extension.awesomeDoc", () => {
		handleCommand();
	});
	context.subscriptions.push(disposable);
}

function deactivate() { }


export default {
	activate, deactivate
};
