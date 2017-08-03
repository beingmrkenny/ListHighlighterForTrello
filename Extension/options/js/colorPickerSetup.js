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

	var cp = ColorPicker(
		document.querySelector('.hue-range'),
		document.querySelector('.sv-range'),
		function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
			var hue = document.querySelector('.hue-indicator'),
				sv = document.querySelector('.sv-indicator');
			ColorPicker.positionIndicators(hue, sv, sliderCoordinate, pickerCoordinate);
			sv.style.backgroundColor = hex;
			document.getElementById('ColorHex').textContent = hex;
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
		Dummy.activateTrelloBgButtonIndicator(trelloBg, hex);
		if (isDefaultColorBar) {
			setTodoListColorForPage(hex);
		}
		$('color-picker').remove();
	});

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
