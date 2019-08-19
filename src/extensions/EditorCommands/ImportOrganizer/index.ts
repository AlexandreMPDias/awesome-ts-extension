// tslint:disable:curly
// tslint:disable:semicolon
import * as vscode from 'vscode';
import { _editor, window } from '../../../services';

interface GlobalIteration
{
	inside: boolean;
}

interface LineIterator extends GlobalIteration
{
	tags: string[];
	index: number;
	line: string;
	lineToAppend: string;
}

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
	preFormatted?: boolean;
	log: LineIterator[] = [];

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
		this.log = [];
		this.preFormatted = false;
		const limits: [number, number, number] = this.extractImports();
		const output: string = this.compile();
		const range: Position = this.translateLimits(limits);
		_editor.replace(output, range);
		// this.replaceLines(limits, this.compile());
	}

	/**
	 * Seek the first and last line that are [import-lines]
	 */
	private seekImportLimits (): [number, number]
	{
		let start: number = -1;
		let end: number = 0;
		this.fileArray.some((line: string, index: number) =>
		{
			if (start < 0) {
				if (line.match(/^import/)) {
					start = index;
				} else if (line.match(/^\/\/ Global import/i)) {
					start = index;
				}
			}
			if (line.match(/from ("|').+('|");?\s*$/)) {
				end = index;
			}
		})
		return [start, end];
	}

	private lineIterator (iterator: LineIterator): LineIterator
	{
		const { line, index, inside } = iterator;
		const tags: string[] = [];
		let iter: LineIterator = {
			...iterator,
			tags,
			lineToAppend: '',
		}
		if (line.length <= 1) {
			iter.tags.push('line-too-short');
			return iter;
		}
		if (line.startsWith('//')) {
			iter.tags.push('commentary');
			return iter;
		}
		iter.lineToAppend = this.fixPath(line.trim(), index);
		return iter;
	}

	/**
	 * Extract the Imports from the entire file.
	 * 
	 * @return {[number,number,number]} is an array with:
	 * [line of first import, line of last import, size of last import's line]
	 */
	private extractImports (): [number, number, number]
	{
		const base = {
			tags: [],
		}
		let globalIter: GlobalIteration = {
			inside: false,
		}
		const [start, end] = this.seekImportLimits();
		const importOrEmptyLines: string[] = [];
		const debug: string[] = [];
		this.fileArray.some((line: string, index: number) =>
		{
			if (index < start) {
				return false;
			}
			const iterator: LineIterator = { ...base, ...globalIter, line, index, lineToAppend: '' };
			const i = this.lineIterator(iterator);
			globalIter = { ...i };
			debug.push(`[ ${i.index}/${end} ]: ${i.line}`);
			debug.push(`Globals: { inside: ${i.inside} } ]`);
			debug.push(`Tags: [ ${i.tags.length > 0 ? i.tags.join(', ') : 'None'} ]`)
			if (i.lineToAppend.length > 0) {
				importOrEmptyLines.push(i.lineToAppend);
				debug.push(`Appending: [ ${i.lineToAppend} ]`)
			}
			debug.push(``);
			if (index === end) {
				return true;
			}
		})
		// console.log(debug.join('\n'));
		let asLine = importOrEmptyLines.join('\n').replace(/^\t?\s?(\w+),\s?\n/gm, '$1,').replace(/{\s?\n/, '{').replace(/,\s*}/, '}');
		this.imports = asLine.split('\n');
		return [start, end, this.fileArray[end].length - 1];
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
			// if (this.skipGlobal) 
			if (!space.global[0].startsWith("// Global")) {
				ret.push('// Global Imports');
			}
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

	private fixPath (line: string, index: number): string
	{
		const path = this.extractPath(line);
		if (path.match(/@\/(\w+(-\w+)*\/)*src/)) {
			if (!path.match(/@\/(\w+(-\w+)*\/)*src$/)) {
				window.warning(`At line: ${index}\n[ ${line} ] doesn't have a valid import path`)
			}
			const packageID = path.replace(/@\/(\w+(-\w+)*)\/src/, '@liberedu/$1');
			return line.replace(/(.+['|"]).+(["|'];?)$/, `$1${packageID}$2`);
		}
		return line;
	}
}



export default (context: vscode.ExtensionContext): void =>
{
	new ImportOrganizer().organize(context);
}