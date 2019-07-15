export interface IRange
{
	from: number,
	to: number
}

export interface IFieldArgValues
{

}

export interface IFieldValues
{
	name: string;
	args: Array<{
		name: string;
		type: string;
	}>
	retType: string;
}

export type CommentGenerator = (content: string) => string;

export interface ClassCommentGenerator
{
	/**
	 * Generates a Commentary to be inserted before the selection
	 */
	generate: (selectContent: string) => IFieldValues;
}