import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { _editor, window } from "../../services";
import { CommandKeys, IFinalTemplate, Key, StoreTemplateKeys } from "./types";

import templateGenerators from './templates';

type TGen = typeof templateGenerators;


// String.prototype.capitalize = function ()
// {
// 	return this.charAt(0).toUpperCase() + this.slice(1);
// };

// String.prototype.uncapitalize = function ()
// {
// 	return this.charAt(0).toLowerCase() + this.slice(1);
// };

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
	}
}

function filterPath (input: string, uncapitalize: boolean = true): string
{
	if (uncapitalize) {
		return input
			.replace(/-/g, "_")
			.replace(/\W+/g, "")
			.uncapitalize();
	}
	return input.replace(/-/g, "_").replace(/\W+/g, "");
}

function createFile (source: string, fileName: string, content: string)
{
	const editor = _editor.getEditor();
	if (editor) {
		const filePath = path.join(source, fileName);
		fs.writeFileSync(filePath, content, "utf8");
	}
}

function createNewDirectory (dir: string): boolean
{
	if (fs.existsSync(dir)) return false;
	try {
		fs.mkdirSync(dir, { recursive: true });
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

function handleTemplateCreation (
	source: string,
	folderName: string,
	templates: IFinalTemplate[]
)
{
	const newSource = path.join(source, folderName);
	if (createNewDirectory(newSource)) {
		templates.forEach((template: IFinalTemplate) =>
		{
			const { fileName, content } = template;
			window.show(`Creating file ${fileName}`);
			createFile(newSource, fileName, content);
		});
	} else {
		_editor.error(`Failed creating directory ${newSource}`);
	}
}

function createOne (template: IFinalTemplate)
{
	const [fileName, ...baseDirs] = template.fileName.split(path.sep).reverse();
	const baseDir = path.join(...baseDirs);

	if (!fs.existsSync(baseDir)) {
		fs.mkdirSync(baseDir, { recursive: true });
	}

	window.show(`Creating file ${fileName}`);
	fs.writeFileSync(template.fileName, template.content, { encoding: 'utf-8' });
}

function getCasedName (name: string): { lowerCamelCase: string, upperCamelCase: string }
{
	return {
		lowerCamelCase: name.uncapitalize(),
		upperCamelCase: name.capitalize()
	}
}

function resolveTemplate (namespace: string, cleanKey: string, name: string, baseDir: string): IFinalTemplate[]
{
	type TGen = typeof templateGenerators;
	type NamespaceKeys<T extends keyof TGen> = keyof TGen[T];
	const finals: IFinalTemplate[] = [];
	const casedName = getCasedName(name);

	const resolveGenerator = (generator: any) => Object.values<any>(generator).map((template) => ({
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


function command (context: vscode.ExtensionContext, dirPath: vscode.Uri)
{
	const catched = () =>
	{
		window.show(`Awesomefication Cancelled`);
	};
	const invalidOption = (opt?: string) =>
	{
		window.show(`[ ${opt} ] is not a valid option`);
		catched();
	}
	const optionsMapping = {
		root: ['Native', 'Shared'],
		Native: ['Create Function Component'],
		Shared: ['Create Redux Store']
	}

	_editor.dropdown(optionsMapping.root.concat('Cancel')).then((option) =>
	{
		if (option && Object.keys(optionsMapping).includes(option)) {
			const subOptions = (optionsMapping as any)[option]
			_editor.dropdown(subOptions.concat('Cancel')).then(subOption =>
			{
				const key = `${subOption && (subOptions as any)[subOption]}`;
				const cleanKey = key.replace(/Create (.+)/, '$1').replace(/\s/g, '').uncapitalize();
				if (cleanKey && option) {
					_editor.getInput("How we gonna call the Monstrao?").then(name =>
					{
						if (name && name.length > 0) {
							console.log({ line: 154, option, key, cleanKey, name, filtered: filterPath(name), dirPath: dirPath.fsPath });
							const templates = resolveTemplate(option as any, cleanKey, name, dirPath.fsPath);
							if (templates) {
								handleTemplateCreation(dirPath.fsPath, filterPath(name), templates);
							} else {
								window.error(`Invalid template \`${option}\`.\`${cleanKey}\` with name [ ${name} ]`);
							}
						} else {
							catched();
						}
					}).catch(catched);
				}
			}).catch(catched);
		} else {
			invalidOption(option);
		}
	}).catch(catched);
}

// async function command (context: vscode.ExtensionContext, dirPath: vscode.Uri)
// {
// 	const optionsKeys: CommandKeys[] = [
// 		"Native Component",
// 		"Web Component",
// 		"Container",
// 		"Redux-Store Directory"
// 	];
// 	const options: string[] = [
// 		...optionsKeys.map(option => `Create Awesome ${option}`),
// 		"Cancel"
// 	];
// 	const selectedDirectory = dirPath.fsPath;
// 	const selected = (await _editor.dropdown(options)) as CommandKeys;
// 	const selectedKey = selected.replace(
// 		/^Create Awesome (.+)/,
// 		"$1"
// 	) as CommandKeys;
// 	// window.show(vscode.Uri.file);
// 	switch (selectedKey) {
// 		case "Native Component": {
// 			window.show(`Running: ${selected}`);
// 			const dirName = await _editor.getInput("Name your Awesome Component");
// 			if (dirName && dirName.length > 0) {
// 				const cfn = filterPath(dirName);
// 				const templates: IFinalTemplate[] = generateComponentTemplate(
// 					cfn,
// 					nativeComponentsTemplates
// 				);
// 				handleTemplateCreation(selectedDirectory, cfn, templates);
// 			} else {
// 				window.show(`Awesomefication Cancelled`);
// 			}
// 			break;
// 		}
// 		case "Web Component": {
// 			window.show(`Running ${selected}`);
// 			const dirName = await _editor.getInput("Name your Awesome Component");
// 			if (dirName && dirName.length > 0) {
// 				const cfn = filterPath(dirName);
// 				const templates: IFinalTemplate[] = generateComponentTemplate(
// 					cfn,
// 					webComponentsTemplates
// 				);
// 				handleTemplateCreation(selectedDirectory, cfn, templates);
// 			} else {
// 				window.show(`Awesomefication Cancelled`);
// 			}
// 			break;
// 		}
// 		case "Container": {
// 			window.show(`Running ${selected}`);
// 			const dirName = await _editor.getInput("Name your Awesome Container");
// 			if (dirName && dirName.length > 0) {
// 				const cfn = filterPath(dirName);
// 				const templates: IFinalTemplate[] = generateContainerTemplate(
// 					cfn.replace(/Container$/, "") + "Container",
// 					containerComponentTemplates
// 				);
// 				handleTemplateCreation(selectedDirectory, cfn, templates);
// 			} else {
// 				window.show(`Awesomefication Cancelled`);
// 			}
// 			break;
// 		}
// 		case "Redux-Store Directory": {
// 			window.show(`Running ${selected}`);
// 			const dirName = await _editor.getInput("Name your Awesome Store");
// 			if (dirName && dirName.length > 0) {
// 				const cfn = filterPath(dirName);
// 				const templates: IFinalTemplate[] = generateReduxTemplate(
// 					cfn,
// 					reduxStoreTemplates
// 				);
// 				const chdir = path.join(selectedDirectory, cfn);
// 				createNewDirectory(chdir);
// 				handleTemplateCreation(chdir, "store", templates);
// 			} else {
// 				window.show(`Awesomefication Cancelled`);
// 			}
// 			break;
// 		}
// 		case "Cancel": {
// 			window.show(`Awesomefication Cancelled`);
// 			break;
// 		}
// 		default: {
// 			if (selected === undefined) {
// 				window.show(`Awesomefication Cancelled`);
// 			} else {
// 				_editor.error(`Invalid Option ${selected}.\nAwesomefication Cancelled`);
// 			}
// 		}
// 	}
// }

function deactivate () { }

const exp: IExtension = {
	name: "extension.awesomifyExplorer",
	command: command,
	deactivate
};

export default exp;
