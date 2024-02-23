// valid and invalid css hex colors
export const TestColors = [
	'#fff', // Valid: white
	'#ffffff',
	'#000000', // Valid: black
	'#000000',
	'#123456', // Valid: a shade of blue
	'#082f49',
	'#ff00ff', // Valid: magenta
	'#d946ef',
	'#abc123', // Valid: a shade of green
	'#84cc16',
	// '#abcdefg', // Invalid: contains 'g' which is not a valid hexadecimal character
	// '#12345', // Invalid: length less than 6
	// '#zzzzzz', // Invalid: contains 'z' which is not a valid hexadecimal character
	'#12345678', // Valid: a shade of blue with alpha value
	'#94a3b8',
	// '#fff1', // Invalid: length less than 6
	'#01234567', // Valid: a shade of blue with alpha value
	'#9ca3af',
	// '#abcdefg1', // Invalid: contains 'g' which is not a valid hexadecimal character
	'#32d090', // https://www.w3docs.com/nx/tailwindcss-closest-color
];
