class Dummy {

	static setCustomTileColorByName (colorName) {
		Tile.setColorByName ($id('Dummy-ColorTile-custom'), colorName);
	}

	static setCustomTileColorByHex (hex) {
		Tile.setCustomTileColorByHex($('[for="Dummy-ColorTile-custom"]'), hex);
	}

	static setDefaultTileColorByName (colorName) {
		Tile.setColorByName ($id('Dummy-ColorTile-default'), colorName);
	}

	static setDefaultTileColorByHex (colorHex) {
		Tile.setColorByHex ($id('Dummy-ColorTile-default'), colorHex);
	}

	static setListColorName (colorName) {
		$id('DummyBoard').dataset.listColorName = colorName;
	}

	static setDoingListColorByName (colorName) {
		Dummy.setDoingListColorByHex(DoingColors.getHexFromName(colorName));
	}

	static setDoingListColorByHex (hex) {
		if (hex) {
			document.querySelector('#DummyBoard .doing-list .list').style.fill = hex;
		} else {
			throw new Error('No hex code provided');
		}
	}

	static selectTile (colorName) {
		Tile.select(false, colorName);
	}

	static changeBackgroundColor (trelloBg) {
		var dummyBoard = $id('DummyBoard'),
			colorName;

		dummyBoard.dataset.trelloBg = trelloBg;

		if (DoingColors.trelloBgHasDoingColor(trelloBg)) {
			colorName = DoingColors.getColorNameForTrelloBg(trelloBg);
		} else {
			colorName = 'default';
		}

		if (colorName == 'custom') {
			Dummy.setDoingListColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
		} else {
			Dummy.setDoingListColorByName(colorName);
		}

		Dummy.selectTile(colorName);
	}

	static activateTrelloBgButtonIndicator(trelloBg, color) {
		let hex, indicator = document.querySelector(`.trello-bg-color-indicator[data-trello-bg="${trelloBg}"]`);
		if (Color.isHex(color)) {
			hex = color;
		} else {
			switch (color) {
				case 'custom'  : hex = DoingColors.getCustomHexForTrelloBg(trelloBg); break;
				case 'default' : hex = 'none'; break;
				default        : hex = DoingColors.getHexFromName(color); break;
			}
		}
		indicator.style.fill = hex || 'none';
	}

}
