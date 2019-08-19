import * as vscode from 'vscode';

import { config } from '..';

class Help
{
	async getInput (placeHolder: string)
	{
		return await vscode.window.showInputBox({
			placeHolder
		});
	}

	running(str: string) {
		if(config.property('showRunning')) {
			vscode.window.showInformationMessage("Running: " + str);
		}
	}

	show (str: string)
	{
		if (config.property('showInfo')) {
			vscode.window.showInformationMessage(str);
		}
	}

	error (str: string)
	{
		if (config.property('showError')) {
			vscode.window.showErrorMessage("[Error]: " + str);
		}
	}

	warning (str: string)
	{
		if (config.property('showWarning')) {
			vscode.window.showWarningMessage("[Warning]: " + str);
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
}

export default new Help();