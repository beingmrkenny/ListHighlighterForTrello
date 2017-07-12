class DefaultColorBar {

    static setCustomColorName (colorName) {
        Tile.setColorName ($id('Default-ColorTile-custom'), colorName);
    }

    static setCustomColorHex (hex) {
        Tile.setCustomColorHex($('[for="Default-ColorTile-custom"]'), hex);
    }

    static selectByColorName (colorName) {
        Tile.select(true, colorName);
    }

}
