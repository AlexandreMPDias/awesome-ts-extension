import * as vscode from 'vscode';
import { _editor } from '../../../services';
import makeComment from './docs';

/**
 * Filters the selection looking for an arrow function
 * @param editor 
 */
function handleSelection (editor: vscode.TextEditor): [string, number]
{
	const range: vscode.Range = new vscode.Range(_editor.getStartOfLine(editor.selection).start, _editor.endOfFile);
	const text = editor.document.getText(range);
	const identation = Math.max(text.split('\n')[0].replace(/^(\s*).+/, '$1').length - 1, 0);
	const singleLine = text
		.replace(/^(\w+\s)?(\w+\s?=\s?.+)/, '$2')
		.replace(/\s|\n|\t/g, '')
		.replace(/(.+)=>.+/, '$1');
	const fE = singleLine.indexOf("=");
	const lE = singleLine.lastIndexOf("=");
	if (fE !== lE) {
		return [singleLine.substring(0, lE), identation];
	}
	return [singleLine, identation];
}

async function handleCommand (context: vscode.ExtensionContext)
{
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return '';
	}
	try {
		const [header, identation] = handleSelection(editor);
		_editor.prependComment(makeComment.commentify(header, identation));
	} catch (e) {
		vscode.window.showInformationMessage(`Awesome Extension Error: Malformed Selection.`);
	}
}


function deactivate () { }

const exp: IExtension = {
	name: "extension.awesomeDoc",
	command: handleCommand,
	deactivate
}

export default exp