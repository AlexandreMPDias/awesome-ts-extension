import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { _editor, window } from "../../services";
import * as templateTypes from "./templates/types";

import templateGenerators from './templates';

type TGen = typeof templateGenerators;
type NamespaceKeys<T extends keyof TGen> = keyof TGen[T];

String.prototype.capitalize = function ()
{
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.uncapitalize = function ()
{
	return this.charAt(0).toLowerCase() + this.slice(1);
};

const resolve = {
	namespace: {
		isNative: (key: any): key is 'native' =>
		{
			return key === 'native';
		},
		isShared: (key: any): key is 'shared' =>
		{
			return key === 'shared';
		}
	},
	subOption: (namespace: string, selectedSubOption: string | undefined): string | undefined =>
	{
		if (selectedSubOption) {
			const subGen = templateGenerators[namespace as keyof TGen];
			let found: any;
			Object.entries(subGen).some(subGenEntry =>
			{
				const [key, value] = subGenEntry;
				if (value.optionQuery === selectedSubOption) {
					found = key;
					return true;
				}
			})
			return found;
		}
		return undefined;
	}
}

function getCasedName (name: string): templateTypes.IFileTemplateArgs
{
	return {
		lowerCamelCase: name.uncapitalize(),
		upperCamelCase: name.capitalize(),
		humanCase: name.replace(/([a-z])([A-Z])/g, '$1 $2').capitalize()

	}
}

function filterPath (input: string, uncapitalize: boolean = true): string
{
	const filtered = input.replace(/-/g, "_").replace(/\W+/g, "")
	return uncapitalize ? filtered.uncapitalize() : filtered;
}

function createOne (template: templateTypes.IFinalTemplate)
{
	const [fileName, ...baseDirs] = template.fileName.split(path.sep).reverse();
	const baseDir = path.join(...baseDirs.reverse());

	if (!fs.existsSync(baseDir)) {
		fs.mkdirSync(baseDir, { recursive: true });
	}

	window.show(`Creating file ${fileName}`);
	fs.writeFileSync(template.fileName, template.content, { encoding: 'utf-8' });
}

function resolveTemplate (namespace: string, cleanKey: string, name: string, baseDir: string): templateTypes.IFinalTemplate[]
{
	const finals: templateTypes.IFinalTemplate[] = [];
	const casedName = getCasedName(name);

	const resolveGenerator = (generator: any) => Object.values<any>(generator.generator).map((template) => ({
		content: template.content(casedName),
		fileName: path.join(baseDir, template.fileName(name).replace('/', path.sep))
	}));

	if (resolve.namespace.isNative(namespace)) {
		const generators = templateGenerators[namespace];
		const key = cleanKey as NamespaceKeys<typeof namespace>;
		if (generators[key]) {
			return resolveGenerator(generators[key]);
		}
	}
	else if (resolve.namespace.isShared(namespace)) {
		const generators = templateGenerators[namespace];
		const key = cleanKey as NamespaceKeys<typeof namespace>;
		if (generators[key]) {
			return resolveGenerator(generators[key]);
		}
	}
	return finals;
}

function ifCancel (option: string | undefined): option is undefined
{
	const isCancel = option === 'Cancel' || option === undefined;
	if (isCancel) {
		window.show(`Awesomefication Cancelled`);
	}
	return isCancel;
}

function isKey (key: string): key is keyof TGen
{
	return Object.keys(templateGenerators).includes(key.toLowerCase());
}

function getAllOptions (key?: string)
{
	if (key && isKey(key)) {
		return Object.values(templateGenerators[key]).map(generators => generators.optionQuery);
	}
	return Object.keys(templateGenerators).map(k => k.capitalize());
}

function command (context: vscode.ExtensionContext, dirPath: vscode.Uri)
{
	const catched = (e?: any) =>
	{
		console.log(e);
		window.show(`Awesomefication Cancelled`);
	};
	const invalidOption = (opt?: string) =>
	{
		window.show(`[ ${opt} ] is not a valid option`);
		catched();
	}

	const rootOptions = getAllOptions();
	_editor.dropdown(rootOptions).then((rawOption) =>
	{
		if (ifCancel(rawOption)) {
			return;
		}
		console.log(rootOptions)
		if (rootOptions.includes(rawOption)) {
			const option = rawOption.toLowerCase();
			const subOptions = getAllOptions(option);
			_editor.dropdown(subOptions).then(subOption =>
			{
				if (ifCancel(subOption)) {
					return;
				}
				const cleanKey = resolve.subOption(option, subOption);
				if (cleanKey && option) {
					_editor.getInput("How are we gonna call the Monstrao?").then(name =>
					{
						if (name && name.length > 0) {
							try {
								const templates = resolveTemplate(option.toLowerCase(), cleanKey, filterPath(name), dirPath.fsPath);
								console.log(templates);
								if (templates) {
									templates.forEach(createOne);
								} else {
									window.error(`Invalid template \`${option}\`.\`${cleanKey}\` with name [ ${name} ]`);
								}
							} catch (e) {
								console.error(e);
							}
						} else {
							catched();
						}
					}).catch(catched);
				}
			}).catch(catched);
		} else {
			invalidOption(rawOption);
		}
	}).catch(catched);
}

async function commandSync (context: vscode.ExtensionContext, dirPath: vscode.Uri)
{
	const catched = (e?: any) =>
	{
		console.log(e);
		window.show(`Awesomefication Cancelled`);
	};
	const invalidOption = (opt?: string) =>
	{
		window.show(`[ ${opt} ] is not a valid option`);
		catched();
	}

	try {
		const rootOptions = getAllOptions();

		const rawOption = await _editor.dropdown(rootOptions);
		if (ifCancel(rawOption)) {
			return;
		}

		if (!rootOptions.includes(rawOption)) {
			invalidOption(rawOption);
			return;
		}

		const option = rawOption.toLowerCase();
		const subOptions = getAllOptions(option);

		const subOption = await _editor.dropdown(subOptions);
		if (ifCancel(subOption)) {
			return;
		}

		const cleanKey = resolve.subOption(option, subOption);
		if (!cleanKey) {
			catched();
			return;
		}

		const name = await _editor.getInput("How are we gonna call the Monstrao?");

		if (!name || name.length <= 0) {
			catched();
			return;
		}

		const templates = resolveTemplate(option.toLowerCase(), cleanKey, filterPath(name), dirPath.fsPath);
		console.log(templates);
		if (templates) {
			templates.forEach(createOne);
		} else {
			window.error(`Invalid template \`${option}\`.\`${cleanKey}\` with name [ ${name} ]`);
			return;
		}

	} catch (e) {
		catched(e);
	}
}

function deactivate () { }

const exp: IExtension = {
	name: "extension.awesomifyExplorer",
	command: commandSync,
	deactivate
};

export default exp;
