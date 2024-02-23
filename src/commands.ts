import { closest } from 'color-diff';
import * as vscode from 'vscode';
import { hexToRgb, isHexValid } from './functions';
import {
	tailwindColorsByHex,
	tailwindColorsInRgb,
	tailwindHexByRgb,
} from './tailwind';
import type { setupUtils } from './utilities';

export function replace(options: {
	utilities: ReturnType<typeof setupUtils>;
	context?: vscode.ExtensionContext;
}) {
	const { log, warn, error, isDebugMode, showOutput } = options.utilities;
	return async () => {
		// get the active text editor
		const editor = vscode.window.activeTextEditor;
		// make sure there is an active text editor
		if (!editor) {
			log('No active text editor.');
			return;
		}

		// create a map of selections by their text
		const selectionsByText = new Map<string, vscode.Selection>();
		// loop through the selections
		for (const selection of editor.selections) {
			// get the text of the selection
			const selectionText = editor.document.getText(selection);
			// make sure the selection is a valid hex color
			if (selectionText && !isHexValid(selectionText)) {
				// skip the invalid selection
				continue;
			}
			// map the selection text to the selection
			selectionsByText.set(selectionText, selection);
		}
		// make sure there are selections
		if (selectionsByText.size) {
			warn('No valid hex color selected.');
			return;
		}

		// create a map of tailwind colors by their selection text
		const tailwindColorsBySelectionText = new Map<string, string>();
		// loop through the selections
		for (const [selectionText, selection] of selectionsByText) {
			// get the rgb value of the selection text
			const selectionRgb = hexToRgb(selectionText);
			// find the closest tailwind color
			const closestRgb = closest(selectionRgb, tailwindColorsInRgb);
			// find the tailwind color name
			let tailwindColor = tailwindHexByRgb.get(
				JSON.stringify(closestRgb),
			);
			// error if the tailwind color is not found
			if (!tailwindColor) {
				error(`Tailwind Color Not Found: ${selectionText}`);
				continue;
			}
			tailwindColor = tailwindColorsByHex.get(tailwindColor);
			// error if the tailwind color name is not found
			if (!tailwindColor) {
				error(`Tailwind Color Not Found: ${selectionText}`);
				continue;
			}
			// map the selection text to the tailwind color
			tailwindColorsBySelectionText.set(selectionText, tailwindColor);
			// log(JSON.stringify([selectionText, tailwindColor], null, 2));
		}

		// replace the selection with the closest tailwind color
		await editor.edit((editBuilder) => {
			for (const [
				selectionText,
				tailwindColor,
			] of tailwindColorsBySelectionText) {
				// get the selection using the text
				const selection = selectionsByText.get(selectionText);
				// error if the selection is empty
				if (!selection) {
					error(`Selection Not Found: ${selectionText}`);
					continue;
				}
				// replace the selection with the tailwind color
				editBuilder.replace(selection, tailwindColor);
			}
		});
	};
}
