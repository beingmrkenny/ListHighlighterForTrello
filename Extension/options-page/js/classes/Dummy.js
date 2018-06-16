class Dummy {

	static setCustomTileColorByName (colorName) {
		Tile.setColorByName ($id('Dummy-ColorTile-custom'), colorName);
	}

	static setCustomTileColorByHex (hex) {
		Tile.setCustomTileColorByHex($('[for="Dummy-ColorTile-custom"]'), hex);
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
		Tile.select(colorName);
	}

	static changeBackgroundColor (trelloBg) {

		var dummyBoard = $id('DummyBoard'),
			color = new Color(),
			listColorName;

		dummyBoard.dataset.trelloBg = trelloBg;

		if (DoingColors.trelloBgHasDoingColor(trelloBg)) {
			listColorName = DoingColors.getColorNameForTrelloBg(trelloBg);
		} else {
			listColorName = 'default';
		}

		dummyBoard.dataset.listColorName = listColorName;

		if (listColorName == 'custom') {
			Dummy.setDoingListColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
		} else {
			Dummy.setDoingListColorByName(listColorName);
		}

		let label = $('.dummy-board-color-tile-bar p');

		switch (trelloBg) {
			case 'default':
				label.textContent = `Choose the default highlight colour:`;
				$id('DummyBoard').classList.toggle(
					'mod-light-background',
					Color.isLight( DoingColors.getHexForTrelloBg(DoingColors.getTrelloBg()) )
				);
				break;
			case 'photo':
				label.textContent = `Choose the highlight colour for boards with a photo background:`;
				break;
			default:
				let a = (trelloBg == 'orange') ? 'an' : 'a';
				let color = (trelloBg == 'gray') ? 'grey' : trelloBg;
				label.textContent = `Choose the highlight colour for boards with ${a} ${color} background:`;
				$id('DummyBoard').classList.toggle(
					'mod-light-background',
					Color.isLight( DoingColors.getHexFromName(trelloBg) )
				);
		}

		Dummy.selectTile(listColorName);
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
		if (indicator) {
			indicator.style.fill = hex || 'none';
		}
	}

}
