import * as vscode from 'vscode';

import { config } from '..';

type Activator = (context: vscode.ExtensionContext) => void
type Deactivator = () => void

class Stacker
{
	readonly activators: Activator[] = [];
	readonly deactivators: Deactivator[] = [];

	activate (context: vscode.ExtensionContext, extension: IExtension)
	{
		const disposable = vscode.commands.registerCommand(extension.name, (...args: any[]) =>
		{
			config.__load();
			extension.command(context, ...args);
		});
		context.subscriptions.push(disposable);
	}

	deactivate (extension: IExtension)
	{
		extension.deactivate();
	}
}

export default new Stacker();