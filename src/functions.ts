import type { RGBColor } from 'color-diff';

// starts with # and contains either 3 or 6 or 4 or 8 hexadecimal characters
// and/or starts with -[ and ends with ]
export const HexColorRegex =
	/(?:#(?:(?:[a-f\d]{3}){1,2}|(?:[a-f\d]{4}){1,2}))|(?:-\[#(?:(?:[a-f\d]{3}){1,2}|(?:[a-f\d]{4}){1,2})\])/gi;

// https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color#syntax
export const hexToRgb = (value: string): RGBColor => {
	// remove the hash
	let hex = value.substring(1);

	// check if the hex is in short form
	if (hex.length === 3 || hex.length === 4) {
		// get all the characters
		let chars = hex.split('');
		// duplicate each character
		chars = chars.map(char => char + char);
		// convert the characters back to a string
		hex = chars.join('');
	}

	// hexadecimal to decimal converter
	const convert = (hex: string) => parseInt(hex, 16);

	// get the decimal values
	const R = convert(hex.substring(0, 2));
	const G = convert(hex.substring(2, 4));
	const B = convert(hex.substring(4, 6));

	// get the alpha value if it exists
	const A = hex.length === 8 ? convert(hex.substring(6, 8)) / 255 : undefined;

	// return the rgba values
	return { R, G, B, A };
};
