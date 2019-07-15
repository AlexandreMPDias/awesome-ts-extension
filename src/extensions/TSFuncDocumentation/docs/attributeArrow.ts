import { IFieldValues, ClassCommentGenerator, IRange } from '../types';

export default class implements ClassCommentGenerator
{
	getEndOfArgs = (selection: string): number =>
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

	processName = (nameSelection: string): string =>
	{
		const filter = nameSelection.replace(/(const|let|async|var)*/, '')
		return filter.replace(/(\w+)=?/, '$1');
	}

	/**
	 * Should properly process: batata:IBatata,yeye:{hue:string,aux:batata},{wi,xu}:{wi:string,xu:string}
	 */
	processArgs = (argSelection: string): Array<{ name: string, type: string }> =>
	{
		const ends: number[] = [];
		for (let i = 0, level = 0; i < argSelection.length; i++) {
			const char = argSelection.charAt(i);
			if (char === "{") level++;
			else if (char === "}") level--;
			else if (char === ",") { ends.push(i - 1) }
		}
		const lines: string[] = ends.map((end, index) =>
		{
			if (index === 0) {
				return argSelection.substring(0, end);
			} else {
				return argSelection.substring(ends[index - 1], end);
			}
		})
		const values: Array<{ name: string, type: string }> = lines.map((argLine: string) =>
		{
			const [name, type] = argLine.split(":");
			return {
				name,
				type: type ? type : "any"
			}
		})
		return values;
	}

	processReturn = (retSelection: string): string =>
	{
		let start = -1;
		let end = 0;
		let level = 0;
		for (let i = 0; i < retSelection.length; i++) {
			const char = retSelection.charAt(i);
			if (char.match(/\w/) && start < 0) {
				start = i;
			} else if (char.match(/{|\(/)) {
				level++;
			} else if (char.match(/}|\)/)) {
				level--;
				if (level === 0 && start >= 0) {
					end = i - 1;
					break;
				}
			}
		}
		return retSelection.substring(start, end);
	}

	generate = (selection: string): IFieldValues =>
	{
		const argsRange: IRange = {
			from: selection.indexOf("(") + 1,
			to: this.getEndOfArgs(selection) - 1
		}
		const nameRange: IRange = {
			from: 0,
			to: argsRange.from,
		}
		const retRange: IRange = {
			from: argsRange.to + 1,
			to: selection.indexOf("=", argsRange.to)
		}

		return {
			name: this.processName(selection.substring(nameRange.from, nameRange.to)),
			args: this.processArgs(selection.substring(argsRange.from, argsRange.to)),
			retType: this.processReturn(selection.substring(retRange.from, retRange.to))
		}
	}
}