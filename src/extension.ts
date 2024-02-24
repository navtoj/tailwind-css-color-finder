import * as vscode from 'vscode';
import { replace } from './commands';
import { setupUtils } from './utilities';

export function activate(context: vscode.ExtensionContext) {
	const utilities = setupUtils({ context });

	let disposable = vscode.commands.registerCommand(
		'tailwind-css-color-finder.replace',
		replace({ utilities }),
	);

	context.subscriptions.push(disposable);
}
