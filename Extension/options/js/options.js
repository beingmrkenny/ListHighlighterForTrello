Options.resetIfEmpty();

Options.load('colorBlindFriendlyMode', function (result) {
	document.body.classList.toggle(
		'color-blind-friendly-mode',
		(typeof result.colorBlindFriendlyMode !== 'undefined' && result.colorBlindFriendlyMode === true)
	);
});

Options.load('colors', function (result) {

	if (result.colors) {

		DoingColors.init(result.colors);

		let fallbackDefaultCustom = DoingColors.getHexFromName('grey'),
			defaultColorName      = DoingColors.getDefaultColorName(),
			defaultCustomHex      = DoingColors.getCustomHexForTrelloBg('default') || fallbackDefaultCustom,
			doingColorForBlue     = DoingColors.getColorNameForTrelloBg('blue'),
			blueCustomHex         = DoingColors.getCustomHexForTrelloBg('blue') || fallbackDefaultCustom;

		DefaultColorBar.setCustomColorName (defaultColorName);
		DefaultColorBar.setCustomColorHex (defaultCustomHex);

		Dummy.setCustomTileColorName (defaultColorName);
		Dummy.setCustomTileColorHex (blueCustomHex);

		if (defaultColorName == 'custom') {
			Dummy.setDefaultTileColorHex (defaultCustomHex);
		} else {
			Dummy.setDefaultTileColorName (defaultColorName);
		}

		DefaultColorBar.selectByColorName (defaultColorName);

		Dummy.selectTile (doingColorForBlue);
		Dummy.setListColorName (doingColorForBlue);
		Dummy.setDoingListColorName (doingColorForBlue);

		let tiles = document.querySelectorAll('.color-tile-label');
		for (let i = tiles.length-1; i>-1; i--) {
			tiles[i].addEventListener('click', function () {

				var tile = this,
					input = $id(tile.getAttribute('for')),
					colorName = input.value,
					tileIsDefault = j(tile.dataset.default),
					tileIsCustom = tile.classList.contains('custom'),
					listColorName = $id('DummyBoard').dataset.listColorName,
					trelloBg = (tileIsDefault) ? 'default' : $id('DummyBoard').dataset.trelloBg,
					customHex;

				if (tileIsCustom) {
					customHex = input.dataset.value;
				}

				if (tileIsDefault == true) {
					if (tileIsCustom) {
						Dummy.setDefaultTileColorHex (customHex);
					}
					Dummy.setDefaultTileColorName (colorName);
				}

				if ( (tileIsDefault == true && listColorName == 'default') || tileIsDefault == false ) {
					let listColor = (tileIsDefault) ? 'default' : colorName;
					Dummy.setListColorName (listColor);
					if (tileIsCustom) {
						Dummy.setDoingListColorHex (customHex);
					}
					Dummy.setDoingListColorName (colorName);
				}

				saveColor(trelloBg, colorName);

			});
		}

		let trelloBackgroundColorButtons = document.querySelectorAll('.trello-bg-color-button');
		for (let i=trelloBackgroundColorButtons.length-1; i>-1; i--) {
			trelloBackgroundColorButtons[i].addEventListener('click', function () {
				var trelloBg = this.dataset.trelloBg;
				Dummy.changeBackgroundColor(trelloBg);
				Dummy.setCustomTileColorHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
			});
		}

		let editCustomColorLinks = document.querySelectorAll('.edit-link');
		for (let i=editCustomColorLinks.length-1; i>-1; i--) {
			let link = editCustomColorLinks[i];
			link.addEventListener('click', function (event) {
				event.preventDefault();
				setupColorPicker(this.closest('.color-tile-label'));
			});
		}

	}

	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);

});

function saveColor (trelloBg, colorName) {
	customDoingColors[ trelloBg ] = colorName;
	Options.save(`colors.current.${trelloBg}`, colorName);
}

function saveCustomColor (trelloBg, hex) {
	customDoingColors[ trelloBg ] = hex;
	Options.save(`colors.custom.${trelloBg}`, hex);
}
