import { closest } from 'color-diff';
import { default as defaultColors } from 'tailwindcss/colors';
import * as vscode from 'vscode';
import { hexToRgb, isHexValid } from './functions';
import { colors, type TailwindColor } from './tailwind';
import type { setupUtils } from './utilities';

export function replace(options: { utilities: ReturnType<typeof setupUtils> }) {
	const { log, warn, error } = options.utilities;
	const { tailwindColors, tailwindColorsRgb } = colors(defaultColors);
	return async () => {
		// get the active text editor
		const editor = vscode.window.activeTextEditor;
		// make sure there is an active text editor
		if (!editor) {
			log('No active text editor.');
			return;
		}

		// create an array of selections and their tailwind colors
		const selectionsColor: [vscode.Selection, TailwindColor][] = [];
		// loop through the selections
		for (const selection of editor.selections) {
			// get the text of the selection
			const text = editor.document.getText(selection);
			// skip if the text is not a valid hex color
			if (!isHexValid(text)) {
				// warn the user about the invalid hex color
				if (text.trim() && !text.startsWith('#')) {
					warn('Hex color must start with #.');
				}
				continue;
			}
			// get the rgb value of the selection text
			const rgb = hexToRgb(text);
			// find the closest tailwind color
			const closestRgb = closest(rgb, tailwindColorsRgb);
			// find the tailwind color name
			const color = tailwindColors.get(JSON.stringify(closestRgb));
			// skip if the tailwind color is not available
			if (!color) {
				error('Tailwind color not available.', {
					openIssueReporter: true,
				});
				continue;
			}
			// add the selection and its tailwind color to the map
			selectionsColor.push([selection, color]);
		}
		// skip if there are no valid selections
		if (!selectionsColor.length) {
			return;
		}

		// start editing the document
		await editor.edit(builder => {
			// loop through the selections and their tailwind colors
			for (const [selection, tailwindColor] of selectionsColor) {
				// replace the selection with the tailwind color
				builder.replace(selection, tailwindColor);
			}
		});
	};
}
