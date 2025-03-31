import { RGBColor } from 'color-diff';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import { hexToRgb } from './functions';

type InvalidColors<T> = {
	[K in keyof T]: T[K] extends { [key: string]: `#${string}` }
		? K extends
				| 'lightBlue'
				| 'warmGray'
				| 'trueGray'
				| 'coolGray'
				| 'blueGray'
			? K
			: never
		: K;
}[keyof T];
type Color = Exclude<keyof DefaultColors, InvalidColors<DefaultColors>>;
type Shade = keyof DefaultColors[Color];
type TailwindColor = `${Color}-${Shade}`;

export function colors(defaultColors: DefaultColors) {
	// create an array of tailwind colors in rgb
	const tailwindColorsRgb: RGBColor[] = [];
	// create a map of tailwind colors by their stringified rgb values
	const tailwindColors = new Map<string, TailwindColor>();
	// loop through the default colors
	for (const color in defaultColors) {
		// skip if the color is deprecated
		if (Object.getOwnPropertyDescriptor(defaultColors, color)?.get) {
			continue;
		}
		// get the shades of the color
		const shades = defaultColors[color as Color];
		// skip if the color does not have shades
		if (typeof shades === 'string') {
			continue;
		}
		// loop through the shades of the color
		for (const [shade, hex] of Object.entries(shades)) {
			// get the rgb value of the color
			const rgb = hexToRgb(hex);
			// add the color to the array
			tailwindColorsRgb.push(rgb);
			// add the color to the set
			tailwindColors.set(
				JSON.stringify(rgb),
				`${color}-${shade}` as TailwindColor,
			);
		}
	}
	// return the tailwind colors
	return { tailwindColors, tailwindColorsRgb };
}
