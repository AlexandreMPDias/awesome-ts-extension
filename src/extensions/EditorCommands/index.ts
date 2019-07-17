import * as vscode from 'vscode';
import { _editor, window } from '../../services';

import { CommandKeys } from './types';

import importOrganizer from './ImportOrganizer';
import generateTSXDoc from './TSFuncDocumentation';

class MultiCommands
{
	async command (context: vscode.ExtensionContext)
	{
		const options: CommandKeys[] = ["ImportOrganizer", "Generate TSX Document", 'Cancel'];
		const selected = await _editor.dropdown(options) as CommandKeys;
		const name = selected.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
		switch (selected) {
			case 'ImportOrganizer': {
				window.running(`${name}`);
				importOrganizer(context);
				break;
			}
			case 'Generate TSX Document': {
				window.running(`${name}`);
				generateTSXDoc(context);
				break;
			}
			case 'Cancel': {
				window.show(`Awesomefication Cancelled`);
				break;
			} default: {
				window.show(`Invalid Option ${selected}\nAwesomefication Cancelled`);
			}
		}
	}
}

const m = new MultiCommands();

function deactivate () { }

const exp: IExtension = {
	name: "extension.awesomifyEditor",
	command: m.command,
	deactivate
}

export default exp
// StackerService.subscribe(m.name, m.commands, deactivate);