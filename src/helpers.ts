import * as vscode from 'vscode';

class Help {
	async getInput(placeHolder: string) {
		return await vscode.window.showInputBox({
			placeHolder
		});
	}

	show(str: string) {
		vscode.window.showInformationMessage(str);
	}

	prependComment(editor: vscode.TextEditor, comment: string) {
		if (editor) {
			editor.edit(editBuilder => {
				editBuilder.replace(editor.selection, '\n' + comment + '\n' + editor.document.getText(editor.selection))
			});
		}
	}
}

export default new Help();