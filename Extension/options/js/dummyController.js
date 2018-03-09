function setupDummy () {

	DoingColors.init(GLOBAL.colors);

	let fallbackDefaultCustom = DoingColors.getHexFromName('gray'),
		defaultColorName      = DoingColors.getDefaultColorName(),
		defaultCustomHex      = DoingColors.getCustomHexForTrelloBg('default') || fallbackDefaultCustom,
		doingColorForBlue     = DoingColors.getColorNameForTrelloBg('blue'),
		blueCustomHex         = DoingColors.getCustomHexForTrelloBg('blue') || fallbackDefaultCustom;

	DefaultColorBar.setCustomTileColorByHex (defaultCustomHex);
	Dummy.setCustomTileColorByHex (blueCustomHex);

	if (defaultColorName == 'custom') {
		Dummy.setDefaultTileColorByHex (defaultCustomHex);
		setTodoListColorForPage(defaultCustomHex);
	} else {
		Dummy.setDefaultTileColorByName (defaultColorName);
		setTodoListColorForPage(defaultColorName);
	}

	DefaultColorBar.selectByColorName (defaultColorName);

	if (DoingColors.trelloBgHasDoingColor('blue')) {
		Dummy.selectTile (doingColorForBlue);
		Dummy.setListColorName (doingColorForBlue);
	} else {
		Dummy.selectTile ('default');
	}

	if (doingColorForBlue == 'custom') {
		Dummy.setDoingListColorByHex (blueCustomHex);
	} else {
		Dummy.setDoingListColorByName (doingColorForBlue);
	}

	for (let input of document.querySelectorAll('.color-tile-input')) {
		input.addEventListener('change', function () {
			let colorPicker = $('color-picker');
			if (colorPicker) {
				colorPicker.remove();
			}
		});
	}

	for (let tile of document.querySelectorAll('.color-tile-label')) {
		tile.addEventListener('click', function () {

			var tile               = this,
				input              = $id(tile.getAttribute('for')),
				colorName          = input.value,
				tileIsOnDefaultBar = j(tile.dataset.default),
				tileIsCustom       = tile.classList.contains('custom'),
				listColorName      = $id('DummyBoard').dataset.listColorName,
				trelloBg           = (tileIsOnDefaultBar) ? 'default' : $id('DummyBoard').dataset.trelloBg,
				customHex;

			if (tileIsCustom) {
				customHex = input.dataset.value;
			}

			if (tileIsOnDefaultBar == true) {
				if (tileIsCustom || colorName == 'custom') {
					Dummy.setDefaultTileColorByHex (customHex);
					setTodoListColorForPage(customHex);
				} else {
					Dummy.setDefaultTileColorByName (colorName);
					setTodoListColorForPage(colorName);
				}
			}

			if ( (tileIsOnDefaultBar == true && listColorName == 'default') || tileIsOnDefaultBar == false ) {

				let listColor = (tileIsOnDefaultBar) ? 'default' : colorName;
				Dummy.setListColorName (listColor);
				if (tileIsCustom || colorName == 'custom') {
					Dummy.setDoingListColorByHex (customHex);
				} else {
					Dummy.setDoingListColorByName (colorName);
				}
			}

			Dummy.activateTrelloBgButtonIndicator(trelloBg, colorName);

			saveColor(trelloBg, colorName);

		});
	}

	for (let button of document.querySelectorAll('.trello-bg-color-button')) {
		button.addEventListener('click', function () {
			var trelloBg = this.dataset.trelloBg;
			Dummy.changeBackgroundColor(trelloBg);
			Dummy.setCustomTileColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
		});
	}

	for (let link of document.querySelectorAll('.edit-link')) {
		link.addEventListener('click', function (event) {
			event.preventDefault();
			setupColorPicker(this.closest('.color-tile-label'));
		});
	}

	let expandHighPriDetails = false;
	for (let trelloBg in GLOBAL.colors.current) {
		if (trelloBg != 'default') {
			let colorName = GLOBAL.colors.current[trelloBg];
			if (colorName && colorName != 'default') {
				Dummy.activateTrelloBgButtonIndicator(trelloBg, colorName);
				expandHighPriDetails = true;
			}
		}
	}

	if (expandHighPriDetails) {
		$id('HighPriDetails').open = true;
	}
}
