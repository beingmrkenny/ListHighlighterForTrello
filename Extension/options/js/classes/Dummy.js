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

		Dummy.setDoingListColorByName(colorName);
		Dummy.selectTile(colorName);
	}

}
