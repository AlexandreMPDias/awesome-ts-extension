// declare namespace __vessicode
// {
// 	type Context = import('vscode').ExtensionContext
// }

// type Command = (context: __vessicode.Context) => void;

type Command = (context: any, ...args: any[]) => void;


interface IExtension
{
	name: ExtensionsKeys;
	command: Command;
	deactivate: () => void;
}

type ExtensionsKeys = "extension.awesomeDoc" | "extension.awesomifyEditor" | "extension.awesomifyExplorer"

interface Position
{
	start?: {
		line?: number;
		char?: number;
	}
	end: {
		line: number;
		char: number;
	}
}

interface RequiredPosition
{
	start: {
		line: number;
		char: number;
	}
	end: {
		line: number;
		char: number;
	}
}

interface String
{
	capitalize: () => string;
	uncapitalize: () => string;
}

type RequiredKeys<T, K extends keyof T> = Exclude<T, K> & Required<Pick<T, K>>;