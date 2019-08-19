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
			const range = this.getStartOfLine(editor.selection);
			editor.edit((editBuilder: any) =>
			{
				editBuilder.replace(range, '\n' + comment + '\n' + editor.document.getText(range))
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

	get endOfFile (): vscode.Position
	{
		const file = vscode.window.activeTextEditor!.document.getText().split('\n');
		const fileSize = file.length;
		const lastLineSize = file[fileSize - 1].length;
		return new vscode.Position(fileSize, lastLineSize);
	}

	getStartOfLine (range: vscode.Range): vscode.Range
	{
		const start: vscode.Position = new vscode.Position(range.start.line, 0);
		const end: vscode.Position = range.end;
		return new vscode.Range(start, end);
	}

	private ensureLimits (limits: Position): RequiredPosition
	{
		const forceLimit = (limits: PositionField): PositionField =>
		{
			return {
				line: limits.line < 0 ? 0 : limits.line,
				char: limits.char < 0 ? 0 : limits.char
			}
		}
		const forceStart = (): PositionField =>
		{
			if (limits.start) {
				const { line, char } = limits.start;
				return { line: line || 0, char: char || 0 };
			} else {
				return { line: 0, char: 0 };
			}
		};
		const ret: RequiredPosition = {
			start: forceLimit(forceStart()),
			end: forceLimit(limits.end)
		};
		return ret;
	}

	/**
	 * Get the Current ActiveTextEditor.
	 * If undefined, it will print a warning
	 */
	getEditor (): typeof vscode.window.activeTextEditor
	{
		if (!vscode.window.activeTextEditor) {
			this.show('Attempt to load activeTextEditor, but there\'s no activeTextEditor');
		}
		return vscode.window.activeTextEditor;
	}
}

export default new Help();