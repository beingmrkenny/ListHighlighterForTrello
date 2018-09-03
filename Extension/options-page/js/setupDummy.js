function setupDummy () {

	DoingColors.init(GLOBAL.colors);

	let fallbackDefaultCustom = DoingColors.getHexFromName('gray'),
		defaultColorName      = DoingColors.getDefaultColorName(),
		defaultCustomHex      = DoingColors.getCustomHexForTrelloBg('default') || fallbackDefaultCustom;
	Dummy.setCustomTileColorByHex (defaultCustomHex);

	if (defaultColorName == 'custom') {
		setTodoListColorForPage(defaultCustomHex);
	} else {
		setTodoListColorForPage(defaultColorName);
	}

	Dummy.selectTile (defaultColorName);

	if (defaultColorName == 'custom') {
		Dummy.setDoingListColorByHex (defaultCustomHex);
	} else {
		Dummy.setDoingListColorByName (defaultColorName);
	}

	for (let input of document.querySelectorAll('.color-tile-input')) {
		input.addEventListener('change', function () {
			let colorPicker = q('color-picker');
			if (colorPicker) {
				colorPicker.remove();
			}
		});
	}

	if (qid('DummyBoard').dataset.trelloBg == 'default') {
		qid('DefaultDummyTile').style.display = 'none';
	}

	let labelMcGee = q('#DefaultDummyTile label');
	listen (labelMcGee, 'transitionend', function () {
 		qid('DefaultDummyTile').style.display = (getComputedStyle(labelMcGee).width == '0px') ? 'none' : null;
	});

	for (let tile of document.querySelectorAll('.color-tile-label')) {
		tile.addEventListener('click', function () {

			var tile               = this,
				input              = qid(tile.getAttribute('for')),
				colorName          = input.value,
				listColorName      = qid('DummyBoard').dataset.listColorName,
				trelloBg           = qid('DummyBoard').dataset.trelloBg,
				customHex;

			customHex = input.dataset.value;

			Dummy.setListColorName (colorName);
			if (colorName == 'custom') {
				Dummy.setDoingListColorByHex (customHex);
			} else {
				Dummy.setDoingListColorByName (colorName);
			}

			if (qid('DummyBoard').dataset.trelloBg == 'default') {
				DoingColors.highPriColorStylesOptions (customHex);
			} else {
				Dummy.activateTrelloBgButtonIndicator(trelloBg, colorName);
			}

			saveColor(trelloBg, colorName);

		});
	}

	for (let button of document.querySelectorAll('.trello-bg-color-button')) {
		button.addEventListener('click', function () {
			var trelloBg = this.dataset.trelloBg;
			if (trelloBg != 'default') {
				qid('DefaultDummyTile').style.display = null;
			}
			setTimeout(function () {
				Dummy.changeBackgroundColor(trelloBg);
				Dummy.setCustomTileColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
			}, 0);
		});
	}

	for (let link of document.querySelectorAll('.edit-link')) {
		link.addEventListener('click', function (event) {
			event.preventDefault();
			event.stopPropagation();
			let parent = this.closest('.color-tile-label');
			if (parent.classList.contains('custom')) {
				setupColorPicker(parent);
			} else {
				Dummy.changeBackgroundColor('default');
			}

		});
	}

	for (let trelloBg in GLOBAL.colors.current) {
		let colorName = GLOBAL.colors.current[trelloBg];
		if (colorName && colorName != 'default' && trelloBg != 'default') {
			Dummy.activateTrelloBgButtonIndicator(trelloBg, colorName);
		}
	}

}
