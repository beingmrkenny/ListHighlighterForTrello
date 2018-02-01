var cp;

function setupColorPicker (colorTileLabel) {

	var input = colorTileLabel.parentNode.querySelector('input'),
		boundingRect = colorTileLabel.getBoundingClientRect(),
		top = boundingRect.top + window.scrollY,
		left = boundingRect.left + window.scrollX + colorTileLabel.offsetWidth + 10;

	var existing = $('color-picker'),
		isDefaultColorBar = j(input.dataset.default),
		previousColor = input.dataset.value,
		colorPicker = getTemplate('ColorPicker'),
		colorTilebar = input.closest('.color-tile-bar');

	if (existing) {
		existing.remove();
	}

	colorPicker.hidden = false;
	colorTilebar.appendChild(colorPicker);

	cp = ColorPicker (
		document.querySelector('.hue-range'),
		document.querySelector('.sv-range'),
		function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
			var hue = document.querySelector('.hue-indicator'),
				sv = document.querySelector('.sv-indicator');
			ColorPicker.positionIndicators(hue, sv, sliderCoordinate, pickerCoordinate);
			sv.style.backgroundColor = hex;
			$id('ColorHex').value = hex;
			changeAllTheColors (hex, isDefaultColorBar)
		}
	);

	cp.setHex(input.dataset.value);

	$id('CancelColor').addEventListener('click', function () {
		changeAllTheColors (previousColor, isDefaultColorBar)
		$('color-picker').remove();
	});

	$id('SaveColor').addEventListener('click', function () {
		var trelloBg = (isDefaultColorBar) ? 'default' : $id('DummyBoard').dataset.trelloBg,
			hex = input.dataset.value;
		saveCustomColor(trelloBg, hex);
		saveRecentColor(hex);
		Dummy.activateTrelloBgButtonIndicator(trelloBg, hex);
		if (isDefaultColorBar) {
			setTodoListColorForPage(hex);
		}
		$('color-picker').remove();
	});

	$id('ColorHex').addEventListener('change', function (event) {
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

	var customColorPickers = $$('.custom-color-picker-button');
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
	Options.load('recentColors', function (recentColors) {
		while (recentColors.length > 9) {
			recentColors.shift();
		}
		recentColors.push(hex);
		Options.save('recentColors', recentColors);
	});
}

function displayRecentColors (recentColors) {
	if (recentColors) {
		actuallyDisplayRecentColors (recentColors);
	} else {
		Options.load('recentColors', actuallyDisplayRecentColors);
	}
}

function actuallyDisplayRecentColors (recentColors) {

	var container = $('.custom-color-picker-button-container');

	var existing = $$('.recent-color-button');
	if (existing) {
		for (let button of existing) {
			button.remove();
		}
	}

	for (let hex of recentColors) {
		let button = getTemplate('CustomColorPickerButton');
		button.dataset.color = hex;
		button.style.backgroundColor = hex;
		recentButtonSetupClick(button);
		container.appendChild(button);
	}

}

function changeAllTheColors (hex, isDefaultColorBar) {
	var listColorName = $id('DummyBoard').dataset.listColorName;
	if (isDefaultColorBar) {
		DefaultColorBar.setCustomTileColorByHex(hex);
		Dummy.setDefaultTileColorByHex (hex);
		if (listColorName == 'default') {
			Dummy.setDoingListColorByHex (hex);
		}
	} else {
		Dummy.setCustomTileColorByHex(hex);
		if (listColorName == 'custom') {
			Dummy.setDoingListColorByHex (hex);
		}
	}
}
