var currentDoingColors,
	customDoingColors,
	fallback = '#ec2f2f';

class DoingColors {

	static init (colors) {
		currentDoingColors = colors.current;
		customDoingColors = colors.custom;
	}

	static getHexForTrelloBg (trelloBg) {

		var hex,
			result = currentDoingColors[trelloBg];

		if (Color.isHex(result)) {
			hex = result;
		} else if (result == 'custom') {
			hex = DoingColors.getCustomHexForTrelloBg(trelloBg);
		} else if (result !== null) {
			hex = DoingColors.getHexFromName(result);
		}

		return hex;

	}

	static trelloBgHasDoingColor (trelloBg) {
		return (currentDoingColors[trelloBg] !== null && currentDoingColors[trelloBg] !== 'default');
	}

	static getDefaultColorName () {
		return currentDoingColors['default'];
	}

	static getDefaultHex () {
		return DoingColors.getHexFromName(currentDoingColors['default']);
	}

	static getColorNameForTrelloBg (trelloBg) {
		return currentDoingColors[trelloBg] || currentDoingColors['default'];
	}

	static getCustomHexForTrelloBg (trelloBg) {
		var hex = null;
		if (Color.isHex(customDoingColors[trelloBg])) {
			hex = customDoingColors[trelloBg];
		} else {
			hex = DoingColors.getHexFromName('grey');
		}
		return hex;
	}

	static getHexFromName (colorName) {

		var hex,
			colors = {
				'red'    : '#ec2f2f',
				'orange' : '#ffab4a',
				'yellow' : '#f2d600',
				'green'  : '#61bd4f',
				'cyan'   : '#0ed4f3',
				'blue'   : '#00a2ff',
				'indigo' : '#30458a',
				'violet' : '#ba55e2',
				'pink'   : '#ff80ce',
				'black'  : '#000000',
				'grey'   : '#e2e4e6'
			};

		if (colorName == 'default') {
			hex = DoingColors.getDefaultHex();
		} else {
			hex = (colors.hasOwnProperty(colorName))
				? colors[colorName]
				: null;
		}

		return hex;

	}

}
