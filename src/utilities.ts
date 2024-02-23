import * as vscode from 'vscode';

const output = vscode.window.createOutputChannel('Tailwind CSS Color Finder', {
	log: true,
});

export const setupUtils = (options: { context: vscode.ExtensionContext }) => {
	const { context } = options;

	const isDebugMode =
		context.extensionMode !== vscode.ExtensionMode.Production;

	if (isDebugMode) {
		output.show();
		output.clear();
	}

	function log(
		message: string,
		options?: { group: string; collapsed?: boolean },
	) {
		output.appendLine(options ? `${options.group}: ${message}` : message);
		if (isDebugMode) {
			if (options) {
				if (options.collapsed) {
					console.groupCollapsed(options.group);
				} else {
					console.group(options.group);
				}
			}
			console.log(message);
			if (options) {
				console.groupEnd();
			}
		}
	}

	function warn(message: string) {
		vscode.window.showWarningMessage(message);
		output.warn(message);
		if (isDebugMode) {
			console.warn(message);
		}
	}

	function error(message: string) {
		vscode.window.showErrorMessage(message);
		output.error(message);
		if (isDebugMode) {
			console.error(message);
		}
	}

	log(
		JSON.stringify(
			{
				'Extension Mode': vscode.ExtensionMode[context.extensionMode],
				'Log Level': vscode.LogLevel[output.logLevel],
			},
			null,
			2,
		),
		{
			group: 'Tailwind CSS Color Finder',
			// collapsed: true,
		},
	);

	const showOutput = () => output.show();

	return { log, warn, error, isDebugMode, showOutput };
};
