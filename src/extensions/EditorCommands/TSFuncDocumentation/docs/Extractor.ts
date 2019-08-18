import { IFieldValues, IRange } from '../types';

export default class
{
	readonly defaultArgType: string = "any";
	readonly defaultReturnType: string = "";

	public generate = (selection: string): IFieldValues =>
	{
		const argsRange: IRange = {
			from: selection.indexOf("(") + 1,
			to: this.getEndOfArgs(selection)
		}
		const nameRange: IRange = {
			from: 0,
			to: argsRange.from,
		}
		const retRange: IRange = {
			from: argsRange.to + 1,
			to: selection.length
		}

		return {
			name: this.processName(selection.substring(nameRange.from, nameRange.to)),
			args: this.processArgs(selection.substring(argsRange.from, argsRange.to)),
			retType: this.processReturn(selection.substring(retRange.from))
		}
	}

	public reform (fields: IFieldValues)
	{
		const mergeType = (arg: {
			name: string;
			type: string;
		}) => `${arg.name}: ${arg.type}`
		return fields.name + '= (' + fields.args.map(a => mergeType(a)).join(', ') + ') : ' + fields.retType + ' => {'
	}

	private getEndOfArgs = (selection: string): number =>
	{
		let index = 0;
		let level = 0;
		for (index = 0; index < selection.length; index++) {
			const char = selection.charAt(index)
			if (char === "(") {
				level++;
			} else if (char === ")") {
				level--;
				if (level === 0) {
					return index;
				}
			}
		}
		return index;
	}

	private processName = (nameSelection: string): string =>
	{
		let name = nameSelection.replace(/(const|let|async|var|declare|export|namespace|module|function\*?)*/, '').replace(/(\w+).+/, '$1').trim();
		return name;

	}

	/**
	 * Should properly process: batata:IBatata,yeye:{hue:string,aux:batata},{wi,xu}:{wi:string,xu:string}
	 */
	private processArgs = (argSelection: string): Array<{ name: string, type: string }> =>
	{
		const ends: number[] = [];
		for (let i = 0, level = 0; i < argSelection.length; i++) {
			const char = argSelection.charAt(i);
			if (char === "{") level++;
			else if (char === "}") level--;
			else if (level === 0 && char === ",") {
				ends.push(i);
			}
		}
		ends.push(argSelection.length);
		const lines: string[] = ends.map((end, index) =>
		{
			if (index === 0) {
				return argSelection.substring(0, end);
			} else {
				return argSelection.substring(ends[index - 1] + 1, end);
			}
		})
		const values: Array<{ name: string, type: string }> = lines.map((argLine: string) =>
		{
			const semicolonPos = argLine.indexOf(":");
			if (semicolonPos) {
				return {
					name: argLine.substring(0, semicolonPos).replace(/\s/g, ''),
					type: argLine.substring(semicolonPos + 1).replace(/\s/g, ''),
				}
			}
			else {
				return {
					name: argLine.replace(/\s/g, ''),
					type: this.defaultArgType
				}
			}
		})
		if (values[0].name === '') {
			return [];
		}
		return values;
	}

	private processReturn = (retSelection: string): string =>
	{
		retSelection = retSelection.trim();
		let start = -1;
		let end = 0;
		let level = 0;
		let wentUp = 0;
		if (!retSelection.match(/^\s*:/)) {
			return this.defaultReturnType;
		}
		for (let i = 0; i < retSelection.length; i++) {
			const char = retSelection.charAt(i);
			end = i + 1;
			if (char === '=' && retSelection.charAt(i + 1) === '>') {
				if (level === 0) {
					end--;
					break;
				}
			}
			else if (char.match(/\w/) && start < 0) {
				start = i;
			} else if (char.match(/{|\(|</)) {
				if (level === 0 && wentUp > 0) {
					break;
				}
				level++;
				wentUp++;
			} else if (char.match(/}|\)|>/)) {
				level--;
				if (level === 0 && start >= 0) {
					break;
				}
			}
		}
		return retSelection.substring(start, end).trim().replace(/{$/, '').replace(/\s/g, '');
	}
}