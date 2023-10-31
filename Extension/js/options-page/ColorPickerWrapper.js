class ColorPickerWrapper {
	constructor(options) {
		this.target = options.target || null;
		this.initialColor = options.initialColor;
		this.place = options.place;
		this.colorUpdateHandler = options.colorUpdateHandler;
		this.save = options.save;
		this.cancel = options.cancel;
		this.cp = null;
		this.opener = options.opener;
		options.opener.addEventListener('click', ColorPickerWrapper.closeCheck);
		this.open();
	}

	open() {
		var existing = q('dialog.color-picker'),
			previousColor = this.initialColor,
			colorPicker = getTemplate('ColorPicker');

		if (existing) {
			existing.remove();
		}

		this.place(colorPicker);

		colorPicker.show();

		ColorPickerInitialise();

		this.cp = ColorPicker(
			q('.hue-range'),
			q('.sv-range'),
			(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) => {
				const hueIndicator = q('.hue-indicator'),
					svIndicator = q('.sv-indicator');
				ColorPicker.positionIndicators(
					hueIndicator,
					svIndicator,
					sliderCoordinate,
					pickerCoordinate
				);
				svIndicator.style.backgroundColor = hex;
				qid('ColorHexDisplay').value = hex;
				this.colorUpdateHandler(hex);
			}
		);

		this.cp.setHex(previousColor);

		qid('CancelColor').addEventListener('click', (event) => {
			event.preventDefault();
			this.cancel(this);
			q('dialog.color-picker').remove();
		});

		qid('SaveColor').addEventListener('click', (event) => {
			event.preventDefault();
			this.save(qid('ColorHex').value);
			ColorPickerWrapper.saveRecentColor(qid('ColorHex').value);
			q('dialog.color-picker').remove();
		});

		const hexOutput = qid('ColorHexDisplay');
		const hexInput = qid('ColorHex');

		listen(hexOutput, ['focus', 'click'], () => {
			hexInput.value = hexOutput.value;
			hexInput.classList.remove('remove');
			hexInput.focus();
			hexOutput.classList.add('remove');
		});

		hexInput.addEventListener('input', () => {
			if (hexInput.checkValidity()) {
				let hex = hexInput.value;
				console.log(hex);
				hex = hex.replace('#', '');
				if (hex.length == 3) {
					hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
				}
				hex = '#' + hex;
				this.cp.setHex(hex);
			}
		});

		hexInput.addEventListener('focusout', () => {
			hexInput.classList.add('remove');
			hexOutput.classList.remove('remove');
		});

		var cp = this.cp;

		chrome.storage.sync.get('recentColors', (results) => {
			this.createRecentColorButtons(results);
			for (let button of qq('.custom-color-picker-button')) {
				button.addEventListener('click', function () {
					cp.setHex(this.value);
				});
			}
		});

		let focussed = q(':focus');
		if (focussed) {
			focussed.blur();
		}
	}

	static close() {
		var colorPicker = q('dialog.color-picker');
		if (colorPicker && colorPicker.open) {
			colorPicker.remove();
		}
		qid('ListHighlightColorDialog').removeEventListener(
			'click',
			ColorPickerWrapper.closeCheck
		);
	}

	static closeCheck(event) {
		var colorPickerParentSearch = event.target.closest('dialog.color-picker');
		if (!colorPickerParentSearch && event.target.tagName != 'BUTTON') {
			ColorPickerWrapper.close();
		}
	}

	static getExistingColors() {
		return [
			'#ec2f2f',
			'#ffab4a',
			'#f2d600',
			'#61bd4f',
			'#0ed4f3',
			'#00a2ff',
			'#30458a',
			'#ba55e2',
			'#ff80ce',
			'#000000',
			'#c4c9cc',
			'#b04632',
			'#d29034',
			'#4bbf6b',
			'#519839',
			'#00aecc',
			'#0779bf',
			'#89609e',
			'#cd5a91',
			'#838c91',
		];
	}

	static saveRecentColor(hex) {
		hex = hex.toLowerCase();
		if (ColorPickerWrapper.getExistingColors().indexOf(hex) > -1) {
			return;
		}
		chrome.storage.sync.get('recentColors', (results) => {
			var recentColors = results.recentColors;
			if (!recentColors) {
				recentColors = [];
			}
			if (recentColors.indexOf(hex) == -1) {
				while (recentColors.length > 19) {
					recentColors.shift();
				}
				recentColors.push(hex);
				chrome.storage.sync.set({ recentColors: recentColors });
			}
		});
	}

	createRecentColorButtons(results) {
		var container = q('.custom-color-picker-button-container');

		if (!container) {
			return;
		}

		var recentColors = results.recentColors;
		if (!recentColors) {
			recentColors = [];
		}

		var existing = qq('.recent-color-button');
		if (existing) {
			for (let button of existing) {
				button.remove();
			}
		}

		for (let hex of recentColors) {
			let button = getTemplate('ColorPickerButton');
			button.value = hex;
			button.style.backgroundColor = hex;
			container.appendChild(button);
		}
	}
}
