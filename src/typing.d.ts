// declare namespace __vessicode
// {
// 	type Context = import('vscode').ExtensionContext
// }

// type Command = (context: __vessicode.Context) => void;

type Command = (context: any, ...args: any[]) => void;

interface AwesomeConfiguration
{
	showInfo: boolean;
	showWarning: boolean;
	showError: boolean;
	showRunning: boolean;
}

interface IExtension
{
	name: ExtensionsKeys;
	command: Command;
	deactivate: () => void;
}

type ExtensionsKeys = "extension.awesomeDoc" | "extension.awesomifyEditor" | "extension.awesomifyExplorer"

interface PositionField
{
	line: number;
	char: number;
}

interface Position
{
	start?: Partial<PositionField>;
	end: PositionField;
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