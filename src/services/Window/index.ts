import * as vscode from 'vscode';

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
	 * Creates a Dropdown with the options received
	 * @param {string[]} items is the options
	 */
	async dropdown (items: string[])
	{
		return await vscode.window.showQuickPick(items);
	}
}

export default new Help();