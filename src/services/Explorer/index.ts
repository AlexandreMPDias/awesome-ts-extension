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

	/**
	 * Creates a [new] file
	 * @param filePath
	 * @param fileName 
	 * @param content 
	 */
	createFile (filePath: string, fileName: string, content: string)
	{

	}
}

export default new Help();