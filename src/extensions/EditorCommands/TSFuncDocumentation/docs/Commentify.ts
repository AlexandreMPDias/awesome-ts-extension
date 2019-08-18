import { IFieldValues, ClassCommentGenerator, IRange } from '../types';

export default class
{
	readonly identation: number;
	readonly values: IFieldValues;
	readonly comment: string;

	constructor (values: IFieldValues, identation: number = 1)
	{
		this.values = values;
		this.identation = identation;
		this.comment = this.generateComment();
	}

	prepend = (line: string, token: string = " * "): string =>
	{
		const tab = new Array(this.identation).fill('\t').join('');
		return `${tab}${token}${line}`;
	}

	private commentifyArgs = (): string[] =>
	{
		const args: string[] = [];
		this.values.args.forEach((value: IFieldValues['args'][0]) =>
		{
			args.push(`@param {${value.type}} ${value.name}`);
		})
		return args;
	}

	private commentifyName = (): string[] =>
	{
		const name = this.values.name.replace(/([a-z])([A-Z])/g, '$1 $2');
		return [`${name.charAt(0).toUpperCase()}${name.slice(1)}`];
	}

	private commentifyReturn = (): string[] =>
	{
		const returns: string[] = [];
		this.values.retType
		if (this.values.retType.length === 0 || this.values.retType.match(/^(void|undefined)$/)) {
			/* nothing */
		} else {
			returns.push(`@return {${this.values.retType}}`);
		}
		return returns;
	}

	/**
	 * Generate Comment
	 * 
	 * @param {none} none
	 * 
	 * @return {string}
	 */
	private generateComment = (): string =>
	{
		const name = this.commentifyName();
		const args = this.commentifyArgs();
		const ret = this.commentifyReturn();
		const merged: string[] = [];
		merged.push(...name);
		merged.push(...(args.length > 0 ? ['', ...args] : args))
		merged.push(...(ret.length > 0 ? ['', ...ret] : ret))
		const all: string[] = [];
		all.push(this.prepend('/**', ''));
		all.push(...merged.map(m => this.prepend(m)));
		all.push(this.prepend(' */', ''));
		return all.join('\n');
	}
}