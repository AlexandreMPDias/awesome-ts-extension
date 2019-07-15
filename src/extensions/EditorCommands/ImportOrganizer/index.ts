import * as vscode from 'vscode';
import { _editor, window } from '../../../services';


interface IByNamespace
{
	global: string[],
	package: string[],
	local: string[],
	styleType: string[],
}

class ImportOrganizer
{
	window: typeof vscode.window;
	editor: typeof vscode.window.activeTextEditor;
	file: string;
	fileArray: string[];
	imports: string[];

	constructor ()
	{
		this.window = vscode.window;
		this.editor = this.window.activeTextEditor
		if (this.editor) {
			this.file = this.editor.document.getText();
		} else {
			this.file = '';
		}
		this.imports = [];
		this.fileArray = this.file.split('\n');
	}

	/**
	 * Organize the Imports
	 */
	organize (context: vscode.ExtensionContext)
	{
		const limits: [number, number, number] = this.extractImports();
		const output: string = this.compile();
		const range: Position = this.translateLimits(limits);
		_editor.replace(output, range);
		// this.replaceLines(limits, this.compile());
	}

	/**
	 * Extract the Imports from the entire file.
	 * 
	 * @return {[number,number,number]} is an array with:
	 * [line of first import, line of last import, size of last import's line]
	 */
	private extractImports (): [number, number, number]
	{
		const importOrEmptyLines: string[] = [];
		let breakLine = 0;
		let start: number = -1;
		this.fileArray.some((line: string, index: number) =>
		{
			if (line.match(/from\s?['|"].+['|"]/)) {
				breakLine = index;
			}
			if (line.startsWith('import') && start < 0) {
				start = index;
			}
			if (line.match(/^(const|let|type|export|interface|\/\*)/)) {
				return true;
			}
			else if (line.length > 0 && !line.startsWith('//')) {
				importOrEmptyLines.push(line.trim());
			}

		})
		let asLine = importOrEmptyLines.join('\n').replace(/^\t?\s?(\w+),\s?\n/gm, '$1,').replace(/{\s?\n/, '{').replace(/,\s*}/, '}');
		this.imports = asLine.split('\n').map(line => this.fixPath(line));
		return [start, breakLine, this.fileArray[breakLine].length - 1];
	}

	translateLimits (limits: [number, number, number]): Position
	{
		const [line, line2, char] = limits;
		return {
			start: {
				line,
			},
			end: {
				line: line2,
				char
			}
		}
	}

	compile (): string
	{
		const space = this.organizeByNameSpace();
		let ret: string[] = [];
		if (space.global.length > 0) {
			ret.push('// Global Imports');
			space.global.forEach((line: string) => { ret.push(line) });
		}
		if (space.package.length > 0) {
			ret.push('');
			ret.push('// Package Imports');
			space.package.forEach((line: string) => { ret.push(line) });
		}
		if (space.local.length > 0) {
			ret.push('');
			ret.push('// Local Imports');
			space.local.forEach((line: string) => { ret.push(line) });
		}
		if (space.styleType.length > 0) {
			ret.push('');
			ret.push('// Style and Types Imports');
			space.styleType.forEach((line: string) => { ret.push(line) });
		}

		return ret.join('\n');
	}

	private replaceLines (limits: [number, number, number], output: string)
	{
		const [start, end, endLine] = limits;
		if (this.editor) {
			const startPosition = new vscode.Position(start, 0);
			const endPosition = new vscode.Position(end, endLine);
			const textRange = new vscode.Range(startPosition, endPosition);

			this.editor.edit(builder =>
			{
				builder.replace(textRange, output);
			});
		}

	}



	private organizeByNameSpace (): IByNamespace
	{
		const byNspc: IByNamespace = {
			global: [],
			package: [],
			local: [],
			styleType: [],
		}

		this.imports.forEach((fixedLine: string) =>
		{
			const path = this.extractPath(fixedLine);

			if (path.startsWith('@liberedu')) {
				byNspc.package.push(fixedLine);
			} else if (path.startsWith('.')) {
				if (path.match(/(type|style)s?$/i)) {
					byNspc.styleType.push(fixedLine);
				} else {
					byNspc.local.push(fixedLine);
				}
			} else if (path.length > 0) {
				byNspc.global.push(fixedLine);
			}
		})
		return byNspc;
	}

	private extractPath (line: string): string
	{
		return line.replace(/.+['|"](.+)["|'];?$/, '$1');
	}

	private fixPath (line: string): string
	{
		const path = this.extractPath(line);
		if (path.match(/@\/\w+(-\w+)*\/src$/)) {
			const packageID = path.replace(/@\/(\w+(-\w+)*)\/src/, '@liberedu/$1');
			window.show(packageID);
			return line.replace(/(.+['|"]).+(["|'];?)$/, `$1${packageID}$2`);
		}
		return line;
	}
}



export default (context: vscode.ExtensionContext): void =>
{
	new ImportOrganizer().organize(context);
}