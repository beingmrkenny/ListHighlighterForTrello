class Tile {

	static setColorByName (input, colorName) {
		Tile.setColorByHex(input, DoingColors.getHexFromName(colorName));
	}

	static setColorByHex (input, hex) {
		if (hex) {
			var label = document.querySelector(`[for="${input.id}"]`),
				colorCheck = new Color(hex);
			input.dataset.value = hex;
			label.dataset.value = hex;
			label.style.backgroundColor = hex;
			label.classList.toggle('mod-light-background', colorCheck.isLight());
		} else {
			throw new Error('No hex code provided');
		}
	}

	static setCustomTileColorByHex (colorTile, hex) {
		if (hex) {
			var colorInput = colorTile.parentNode.querySelector('input'),
				colorCheck = new Color(hex);
			colorTile.style.backgroundColor = hex;
			colorTile.classList.toggle('mod-light-background', colorCheck.isLight());
			colorInput.dataset.value = hex;
		} else {
			throw new Error('No hex code provided');
		}
	}

	static select (defaultBar, colorName) {
		var parent = (defaultBar)
			? $id('DefaultColorBar')
			: $id('DummyBoard');
		var appropriateColorInput = (colorName == 'default')
			? $id('Dummy-ColorTile-default')
			: parent.querySelector(`[value="${colorName}"]`);
		if (appropriateColorInput) {
			appropriateColorInput.checked = true;
		}
	}

}
