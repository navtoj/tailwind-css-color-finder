import { RGBColor } from 'color-diff';
import colors from 'tailwindcss/colors';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import { hexToRgb, isHexValid } from './functions';

type DefaultColorsKeys = keyof DefaultColors;
const defaultColorsKeys: DefaultColorsKeys[] = [
	// css
	'inherit',
	'current',
	'transparent',
	// hex
	'black',
	'white',
	// shades -> hex
	'slate',
	'gray',
	'zinc',
	'neutral',
	'stone',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
	// deprecated -> shades
	'lightBlue',
	'warmGray',
	'trueGray',
	'coolGray',
	'blueGray',
	// 'debug'
];
type FilteredColors = {
	[Key in DefaultColorsKeys]: DefaultColors[Key] extends string
		? DefaultColors[Key] extends `#${string}`
			? Key extends keyof Omit<
					DefaultColors,
					| 'lightBlue'
					| 'warmGray'
					| 'trueGray'
					| 'coolGray'
					| 'blueGray'
			  >
				? DefaultColors[Key]
				: never
			: never
		: never;
};

// type FinalColors = Pick<DefaultColors, FilteredColors[DefaultColorsKeys]>;

// Testing the type
const test: FilteredColors = {
	black: '#000',
	white: '#fff',
	slate: {
		'50': '#f8fafc',
		'100': '#f1f5f9',
		'200': '#e2e8f0',
		'300': '#cbd5e1',
		'400': '#94a3b8',
		'500': '#64748b',
		'600': '#475569',
		'700': '#334155',
		'800': '#1e293b',
		'900': '#0f172a',
		'950': '#020617',
	},
	// These properties will cause a type error:
	// lightBlue: DefaultColors['sky'],
	// warmGray: DefaultColors['stone'],
	// trueGray: DefaultColors['neutral'],
	// coolGray: DefaultColors['gray'],
	// blueGray: DefaultColors['slate']
};

// create a set of tailwind colors
export const tailwindColorsInRgb: RGBColor[] = [];
// create a map of tailwind colors
export const tailwindColorsByHex = new Map<string, string>();
export const tailwindHexByRgb = new Map<string, string>();
// data structure to hold the tailwind colors
const setTailwindColor = (color: string, hexValue: string) => {
	tailwindColorsByHex.set(hexValue, color);
	const rgb = hexToRgb(hexValue);
	tailwindColorsInRgb.push(rgb);
	tailwindHexByRgb.set(JSON.stringify(rgb), hexValue);
};

console.groupCollapsed('Tailwind CSS Colors');
// loop through the tailwind colors
for (const color in colors) {
	// check if the property is a getter
	const keyDescriptor = Object.getOwnPropertyDescriptor(colors, color);
	// skip if the property is a getter
	if (keyDescriptor && keyDescriptor.get) {
		// inform the user that the color is deprecated
		console.log(`Deprecated: ${color}`);
		continue;
	}
	// get the value of the color
	const colorValue = colors[color as keyof typeof colors];
	// check if the value is a string
	if (typeof colorValue === 'string') {
		// skip if the string is not a hex color
		if (!colorValue.startsWith('#')) {
			// inform the user that the color is unknown
			console.log(`Skipped Color: ${color}`);
			continue;
		}
		// skip if the hex color is not valid
		if (!isHexValid(colorValue)) {
			// inform the user that the color is invalid
			console.log(`Invalid Hex Color: ${color}`);
			continue;
		}
		// add the color to the tailwind colors
		setTailwindColor(color, colorValue);
	} else {
		// loop through the shades of the color
		for (const [shade, shadeValue] of Object.entries(colorValue)) {
		}
	}
}
Object.entries(colors).forEach(([color, colorValue]) => {
	// check if property is a getter
	var keyDescriptor = Object.getOwnPropertyDescriptor(colors, color);
	// make sure the property is not a getter
	if (keyDescriptor && keyDescriptor.get) {
		console.log(`Skipping: ${color}`);
		return;
	}
	// check if the value is a string
	if (typeof colorValue === 'string') {
		// make sure the value is a valid hex color
		if (!isHexValid(colorValue)) {
			console.log(`Skipping: ${color}`);
			return;
		}
		setTailwindColor(color, colorValue);
	} else {
		Object.entries(colorValue).forEach(([shade, shadeValue]) => {
			// make sure the value is a string
			if (typeof shadeValue !== 'string') {
				console.log(`Skipping: ${color}-${shade}`);
				return;
			}
			// make sure the value is a valid hex color
			if (!isHexValid(shadeValue)) {
				console.log(`Skipping: ${color}-${shade}`);
				return;
			}
			setTailwindColor(`${color}-${shade}`, shadeValue);
		});
	}
});
console.groupEnd();
