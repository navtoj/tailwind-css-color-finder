import { closest } from 'color-diff';
import { default as defaultColors } from 'tailwindcss/colors';
import * as vscode from 'vscode';
import { HexColorRegex, hexToRgb } from './functions';
import { colors } from './tailwind';
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

		// create an array of selections and their tailwind colored replacements
		const selectionReplacements: [vscode.Selection, string][] = [];
		// loop through the selections
		for (const selection of editor.selections) {
			// get the text of the selection
			let text = editor.document.getText(selection);
			// find all hex colors
			const matches = [...text.matchAll(HexColorRegex)];
			// skip if no valid hex colors found
			if (matches.length === 0) {
				warn('No valid hex colors found.');
				continue;
			}
			// loop through the hex colors
			for (const match of matches) {
				// get match text
				const matchText = match[0];
				// check if color inside tailwind format: bg-[#ffffff]
				const inTwFormat =
					matchText.startsWith('-[') && matchText.endsWith(']');
				// get hex color from match
				const hexColor = inTwFormat
					? matchText.slice(2, -1)
					: matchText;
				// get the rgb value of the selection text
				const rgbColor = hexToRgb(hexColor);
				// find the closest tailwind color
				const closestRgb = closest(rgbColor, tailwindColorsRgb);
				// find the tailwind color name
				let tailwindColor = tailwindColors.get(
					JSON.stringify(closestRgb),
				);
				// skip if the tailwind color is not available
				if (!tailwindColor) {
					error(`Tailwind color not available: ${match}`, {
						openIssueReporter: true,
					});
					continue;
				}
				// replace the hex color with the tailwind color
				text = text.replace(
					matchText,
					inTwFormat ? `-${tailwindColor}` : tailwindColor,
				);
			}
			// add the selection and its tailwind replacement to the map
			selectionReplacements.push([selection, text]);
		}
		// skip if there are no valid selections
		if (!selectionReplacements.length) {
			return;
		}

		// start editing the document
		await editor.edit(builder => {
			// loop through the selections and their tailwind replacements
			for (const [selection, repacement] of selectionReplacements) {
				// replace the selection with the tailwind counterpart
				builder.replace(selection, repacement);
			}
		});
	};
}
