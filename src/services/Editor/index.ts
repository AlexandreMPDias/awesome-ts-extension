import * as vscode from 'vscode';

export type WindowWithEditor = RequiredKeys<typeof vscode.window, "activeTextEditor">
class Help
{
	async getInput (placeHolder: string)
	{
		return await vscode.window.showInputBox({
			placeHolder
		});
	}

	show (str: string)
	{
		vscode.window.showInformationMessage(str);
	}

	error (str: string)
	{
		vscode.window.showInformationMessage("[Error]: " + str);
	}

	/**
	 * Write a string right before a selection.
	 * @param editor 
	 * @param comment the string to be written
	 */
	prependComment (comment: string)
	{
		const editor = this.getEditor();
		if (editor) {
			editor.edit((editBuilder: any) =>
			{
				editBuilder.replace(editor.selection, '\n' + comment + '\n' + editor.document.getText(editor.selection))
			});
		}
	}

	/**
	 * Creates a Dropdown with the options received
	 * @param {string[]} items is the options
	 */
	async dropdown (items: string[])
	{
		return await vscode.window.showQuickPick(items);
	}

	/**
	 * Replaces a string with an output
	 * @param output string to be written
	 * @param limits range to be deleted
	 */
	replace (output: string, limits: Position)
	{
		const { start, end } = this.ensureLimits(limits);
		const editor = this.getEditor();
		if (editor) {
			const startPosition = new vscode.Position(start.line, start.char);
			const endPosition = new vscode.Position(end.line, end.char);
			const textRange = new vscode.Range(startPosition, endPosition);

			editor.edit(builder =>
			{
				builder.replace(textRange, output);
			});
		}

	}

	private ensureLimits (limits: Position): RequiredPosition
	{
		const forceStart = (): { line: number, char: number } =>
		{
			if (limits.start) {
				const { line, char } = limits.start;
				return { line: line || 0, char: char || 0 };
			} else {
				return { line: 0, char: 0 };
			}
		}
		const ret: RequiredPosition = {
			start: forceStart(),
			end: limits.end
		};
		return ret;
	}

	getEditor (): typeof vscode.window.activeTextEditor
	{
		if (!vscode.window.activeTextEditor) {
			this.show('Attempt to load activeTextEditor, but there\'s no activeTextEditor');
		}
		return vscode.window.activeTextEditor;
	}
}

export default new Help();