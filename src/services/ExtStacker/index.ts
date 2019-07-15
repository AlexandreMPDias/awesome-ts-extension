import * as vscode from 'vscode';


type Activator = (context: vscode.ExtensionContext) => void
type Deactivator = () => void

class Stacker
{
	readonly activators: Activator[] = [];
	readonly deactivators: Deactivator[] = [];

	// /**
	//  * Subscribe the function to the main activator
	//  * @param {string} name the Extension's Name
	//  * @param {Command} command is the command to be executed when the extension is invoked 
	//  * @param {Deactivator} deactivator
	//  */
	// subscribe (name: string, command: Command, deactivator?: Deactivator)
	// {
	// 	const activator: Activator = (context: vscode.ExtensionContext) =>
	// 	{
	// 		const disposable = vscode.commands.registerCommand(name, () => command(context));
	// 		context.subscriptions.push(disposable);
	// 	}
	// 	this.activators.push(activator);
	// 	this.deactivators.push(deactivator ? deactivator : () => { });
	// }

	activate (context: vscode.ExtensionContext, extension: IExtension)
	{
		const disposable = vscode.commands.registerCommand(extension.name, (...args: any[]) =>
		{
			extension.command(context, ...args);
		});
		context.subscriptions.push(disposable);
	}

	deactivate (extension: IExtension)
	{
		extension.deactivate();
	}

	// activate (context: vscode.ExtensionContext)
	// {
	// 	this.activators.forEach((activate: Activator) =>
	// 	{
	// 		activate(context);
	// 	})
	// }

	// deactivate ()
	// {
	// 	this.deactivators.forEach((deactivate: Deactivator) =>
	// 	{
	// 		deactivate();
	// 	})
	// }
}

export default new Stacker();