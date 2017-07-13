class Dummy {

	static setCustomTileColorName (colorName) {
		Tile.setColorName ($id('Dummy-ColorTile-custom'), colorName);
	}

	static setCustomTileColorHex (hex) {
		Tile.setCustomColorHex($('[for="Dummy-ColorTile-custom"]'), hex);
	}

	static setDefaultTileColorName (colorName) {
		Tile.setColorName ($id('Dummy-ColorTile-default'), colorName);
	}

	static setDefaultTileColorHex (colorHex) {
		Tile.setColorHex ($id('Dummy-ColorTile-default'), colorHex);
	}

	static setListColorName (colorName) {
		$id('DummyBoard').dataset.listColorName = colorName;
	}

	static setDoingListColorName (colorName) {
		Dummy.setDoingListColorHex(DoingColors.getHexFromName(colorName));
	}

	static setDoingListColorHex (hex) {
		var doing = document.querySelector('#DummyBoard .doing-list .list');
		if (doing) {
			doing.style.fill = hex;
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

		Dummy.setDoingListColorName(colorName);
		Dummy.selectTile(colorName);
	}

}
