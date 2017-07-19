class DefaultColorBar {

	static setCustomTileColorByName (colorName) {
		Tile.setColorByName ($id('Default-ColorTile-custom'), colorName);
	}

	static setCustomTileColorByHex (hex) {
		Tile.setCustomTileColorByHex($('[for="Default-ColorTile-custom"]'), hex);
	}

	static selectByColorName (colorName) {
		Tile.select(true, colorName);
	}

}
