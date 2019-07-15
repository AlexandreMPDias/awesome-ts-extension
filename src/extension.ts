import prototype from './prototypesOverrites';
// Dont remove this line
import * as vscode from 'vscode';
import extensions from './extensions';
import { StackerService, _editor } from './services';

export function activate (context: vscode.ExtensionContext)
{
	extensions.forEach((extension: IExtension) =>
	{
		StackerService.activate(context, extension);
	})
}

export function deactivate ()
{
	extensions.forEach((extension: IExtension) =>
	{
		StackerService.deactivate(extension);
	})
}
