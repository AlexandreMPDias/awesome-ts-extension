// tslint:disable:curly
// tslint:disable:semicolon
import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { join } from 'path';

class Config
{
	private config: AwesomeConfiguration;
	private firstRun: boolean;
	private validConfigKeys: string[] = ["show-error", "show-warning", "show-info", "show-running"];

	constructor ()
	{
		this.config = {
			showWarning: true,
			showError: true,
			showInfo: true,
			showRunning: true,
		}
		this.firstRun = true;
	}

	public property (key: keyof AwesomeConfiguration)
	{
		return this.config[key];
	}

	public __load ()
	{
		const { workspaceFolders } = vscode.workspace;
		if (workspaceFolders) {
			const root = workspaceFolders[0].uri.fsPath;
			try {
				const content = readFileSync(join(root, 'awesome-extension-config.json'), { encoding: 'utf-8' });
				const asJSON = JSON.parse(content);
				this.checkKeys(asJSON);
				// this.updateConfig(asJSON, "show-error", "showError");
				// this.updateConfig(asJSON, "show-warning", "showWarning");
				// this.updateConfig(asJSON, "show-info", "showInfo");
				this.updateAll(asJSON);
				console.log("[Awesome TS Extension]: Extension Settings loaded successfully")
				console.log(this.config);

			} catch {
				vscode.window.showErrorMessage("[Awesome TS Extension]: Failed parsing Extension Settings");
			}
		} else {
			if (this.firstRun) {
				vscode.window.showInformationMessage("[Awesome TS Extension]: Extension Settings not found");
			}
		}
		this.firstRun = false;
	}

	private checkKeys (JSONObject: any)
	{
		Object.keys(JSONObject).some((key: string) =>
		{
			if (!this.validConfigKeys.includes(key)) {
				vscode.window.showErrorMessage(`[Awesome TS Extension]: ${key} is not a valid Configuration Key`);
				vscode.window.showWarningMessage(`[Awesome TS Extension]: Configuration Keys: ${JSON.stringify(this.validConfigKeys)}`);
			}
		})
	}

	private updateAll (JSONObject: any)
	{
		Object.keys(this.config).forEach((key: string) =>
		{
			const jsonKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
			this.updateConfig(JSONObject, jsonKey, key as keyof AwesomeConfiguration);
		})
	}

	private updateConfig (JSONObject: any, JSONKey: string, key: keyof AwesomeConfiguration)
	{
		const value = JSONObject[JSONKey];
		if (JSONObject[JSONKey] !== undefined) {
			this.config[key] = value;
		}
	}

}

export default new Config();