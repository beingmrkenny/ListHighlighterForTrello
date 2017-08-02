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
		} else {
			hex = DoingColors.getDefaultHex();
		}

		return hex;

	}

	static getTrelloBg () {
		var trelloBg,
			background = (document.body.classList.contains('body-custom-board-background'))
				? 'photo'
				: document.body.style.backgroundColor;

		switch (background) {
			case 'rgb(0, 121, 191)'  : trelloBg = 'blue'; break;
			case 'rgb(210, 144, 52)' : trelloBg = 'orange'; break;
			case 'rgb(81, 152, 57)'  : trelloBg = 'green'; break;
			case 'rgb(176, 70, 50)'  : trelloBg = 'red'; break;
			case 'rgb(137, 96, 158)' : trelloBg = 'purple'; break;
			case 'rgb(205, 90, 145)' : trelloBg = 'pink'; break;
			case 'rgb(75, 191, 107)' : trelloBg = 'lime'; break;
			case 'rgb(0, 174, 204)'  : trelloBg = 'sky'; break;
			case 'rgb(131, 140, 145)': trelloBg = 'gray'; break;
			case 'photo'			 : trelloBg = 'photo'; break;
		}
		return trelloBg;
	}

	static trelloBgHasDoingColor (trelloBg) {
		return (currentDoingColors[trelloBg] !== null && currentDoingColors[trelloBg] !== 'default');
	}

	// Returns the name of a predefined color, like red, blue, green etc.
	static getDefaultColorName () {
		return currentDoingColors['default'];
	}

	static getDefaultHex () {
		var hex,
			colorName = DoingColors.getDefaultColorName();

		if (colorName == 'custom') {
			hex = DoingColors.getCustomHexForTrelloBg('default');
		} else {
			hex = DoingColors.getHexFromName(colorName);
		}

		return hex;
	}

	static getColorNameForTrelloBg (trelloBg) {
		return currentDoingColors[trelloBg] || currentDoingColors['default'];
	}

	static getCustomHexForTrelloBg (trelloBg) {
		var hex = null;

		if (Color.isHex(customDoingColors[trelloBg])) {
			hex = customDoingColors[trelloBg];
		} else {
			hex = DoingColors.getHexFromName('gray');
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
				'gray'   : '#e2e4e6'
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

	static highPriColorStyles () {

		var color = new Color(),
			newColor = new Color(),
			highPri, contrastColor, css, existingStyle;

		DoingColors.init(GLOBAL.colors);

		highPri = (document.body.classList.contains('body-custom-board-background'))
			? DoingColors.getHexForTrelloBg('photo')
			: DoingColors.getHexForTrelloBg(DoingColors.getTrelloBg());

		if (typeof highPri == 'undefined') {
			throw new Error('no high pri color');
		}

		color.fromHex(highPri);
		color.toHSL();

		newColor.fromHSL(
			color.getHue(),
			color.getSaturation() * 0.7,
			45
		);

		contrastColor = (color.isLight()) ? '#292929' : '#ffffff';

		css = `.bmko_high-list {
			--high-pri: ${highPri};
			--high-pri-border: ${newColor.toHex()};
			--high-pri-text: ${contrastColor};
		}`;

		existingStyle = $id('HighPriColorCSS');
		if (existingStyle) {
			existingStyle.textContent = css;
		} else {
			let style = document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.setAttribute('id', 'HighPriColorCSS');
			style.textContent = css;
			document.head.appendChild(style);
		}

	}

}
