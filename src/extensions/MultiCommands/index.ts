import * as vscode from 'vscode';
import { EditorService, StackerService } from '../../services';

function activate (context: vscode.ExtensionContext)
{
	// this code runs whenever your click 'Create Gist' from the context menu in your browser.
	let disposable = vscode.commands.registerCommand("extension.awesomeDoc", () =>
	{
		handleCommand();
	});
	context.subscriptions.push(disposable);
}

function deactivate () { }

StackerService.subscribe(activate, deactivate);