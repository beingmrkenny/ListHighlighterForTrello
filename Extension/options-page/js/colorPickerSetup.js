var cp;

function setupColorPicker (colorTileLabel) {

	var input = colorTileLabel.parentNode.querySelector('input'),
		boundingRect = colorTileLabel.getBoundingClientRect(),
		top = boundingRect.top + window.scrollY,
		left = boundingRect.left + window.scrollX + colorTileLabel.offsetWidth + 10;

	var existing = q('color-picker'),
		previousColor = input.dataset.value,
		colorPicker = getTemplate('ColorPicker'),
		colorTilebar = input.closest('.color-tile-bar');

	if (existing) {
		existing.remove();
	}

	colorPicker.hidden = false;
	colorTilebar.appendChild(colorPicker);

	ColorPickerInitialise();

	cp = ColorPicker (
		q('.hue-range'),
		q('.sv-range'),
		function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
			var hue = q('.hue-indicator'),
				sv = q('.sv-indicator');
			ColorPicker.positionIndicators(hue, sv, sliderCoordinate, pickerCoordinate);
			sv.style.backgroundColor = hex;
			qid('ColorHex').value = hex;
			changeAllTheColors (hex);
		}
	);

	cp.setHex(input.dataset.value);

	qid('CancelColor').addEventListener('click', function () {
		changeAllTheColors (previousColor);
		q('color-picker').remove();
	});

	qid('SaveColor').addEventListener('click', function () {
		var trelloBg = qid('DummyBoard').dataset.trelloBg,
			hex = input.dataset.value;
		saveCustomColor(trelloBg, hex);
		Dummy.activateTrelloBgButtonIndicator(trelloBg, hex);
		if (trelloBg == 'default') {
			setTodoListColorForPage(hex);
		}
		q('color-picker').remove();
	});

	qid('ColorHex').addEventListener('change', function (event) {
		var input = this;
		if (input.checkValidity()) {
			let hex = input.value;
			hex = hex.replace('#', '');
			if (hex.length == 3) {
				let hexes = hex.split();
				hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
			}
			hex = '#'+hex;
			cp.setHex(hex);
		}
	});

	displayRecentColors();

	var customColorPickers = qq('.custom-color-picker-button');
	for (let picker of customColorPickers) {
		recentButtonSetupClick(picker);
	}

}

function recentButtonSetupClick(button) {
	button.addEventListener('click', function (event) {
		cp.setHex(this.dataset.color);
	});
}

function saveRecentColor(hex) {
	Options.load('recentColors', function (results) {
		var recentColors = results.recentColors;
		if (!recentColors) {
			recentColors = [];
		}
		if (recentColors.indexOf(hex) == -1) {
			while (recentColors.length > 9) {
				recentColors.shift();
			}
			recentColors.push(hex);
			Options.save({ 'recentColors' : recentColors});
		}
	});
}

function displayRecentColors (recentColors) {
	if (recentColors) {
		actuallyDisplayRecentColors (recentColors);
	} else {
		Options.load('recentColors', actuallyDisplayRecentColors);
	}
}

function actuallyDisplayRecentColors (results) {

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

	var container = q('.custom-color-picker-button-container');
	for (let hex of recentColors) {
		let button = getTemplate('CustomColorPickerButton');
		button.dataset.color = hex;
		button.style.backgroundColor = hex;
		recentButtonSetupClick(button);
		container.appendChild(button);
	}

}

function changeAllTheColors (hex) {
	var listColorName = qid('DummyBoard').dataset.listColorName;

	Dummy.setCustomTileColorByHex(hex);

	if (qid('DummyBoard').dataset.trelloBg == 'default' && listColorName == 'default') {
		Dummy.setDoingListColorByHex (hex);
	} else if (listColorName == 'custom') {
		Dummy.setDoingListColorByHex (hex);
	}
}
