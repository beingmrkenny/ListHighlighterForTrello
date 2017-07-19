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
					Dummy.setDefaultTileColorName (colorName); // QUESTION Is this working? produces null, which is a shittence
					if (tileIsCustom) {
						Dummy.setDefaultTileColorHex (customHex);
					}
				}

				if ( (tileIsDefault == true && listColorName == 'default') || tileIsDefault == false ) {
					let listColor = (tileIsDefault) ? 'default' : colorName;
					Dummy.setListColorName (listColor);
					Dummy.setDoingListColorName (colorName); // QUESTION This might be a problem, does it produce null? why is it here?
					if (tileIsCustom) {
						Dummy.setDoingListColorHex (customHex);
					}
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

Options.load('options', function (result) {

	let options = result.options;
	for (let name in options) {
		let value = options[name];
		if (typeof value == 'boolean') {
			$id(name).checked = value;
		} else {
			$id(name+value).checked = true;
		}
	}

	var textSwitchers = document.querySelectorAll('text-switcher');
	for (let i = textSwitchers.length-1; i>-1; i--) {
		let textSwitcher = textSwitchers[i],
			trigger = $id(textSwitcher.dataset.trigger);
		processTextSwitcherTrigger.call(trigger);
		trigger.addEventListener('change', processTextSwitcherTrigger);
	}

	var subSettings = document.querySelectorAll('.sub-setting');
	for (let i = subSettings.length-1; i>-1; i--) {
		let master = $id(subSettings[i].dataset.master);
		processSubSettings.call(master);
		master.addEventListener('change', processSubSettings);
	}

	var optionInputs = document.querySelectorAll('.options-input');
	for (let i = optionInputs.length-1; i>-1; i--) {
		optionInputs[i].addEventListener('change', function () {
			let input = this,
				name = input.name,
				value = (input.type == 'radio')
					? document.querySelector(`input[name="${input.name}"]:checked`).value
					: input.checked;
			Options.save(`options.${name}`, value);
		});
	}

});

function processTextSwitcherTrigger () {
	var trigger = this,
		switchers = document.querySelectorAll(`[data-trigger='${trigger.id}']`);
	for (let i = switchers.length-1; i>-1; i--) {
		let switcher = switchers[i];
		if (trigger.checked) {
			switcher.textContent = switcher.dataset.on;
		} else {
			switcher.textContent = switcher.dataset.off
		}
	}
}

function processSubSettings () {
	let master = this,
		isDisabled = (!master.checked),
		settingContainer = document.querySelector(`[data-master="${master.id}"]`),
		inputs = settingContainer.querySelectorAll('input');
	for (let i = inputs.length-1; i>-1; i--) {
		inputs[i].disabled = isDisabled;
	}
	settingContainer.classList.toggle('disabled', isDisabled);
}

function saveColor (trelloBg, colorName) {
	customDoingColors[ trelloBg ] = colorName;
	Options.save(`colors.current.${trelloBg}`, colorName);
}

function saveCustomColor (trelloBg, hex) {
	customDoingColors[ trelloBg ] = hex;
	Options.save(`colors.custom.${trelloBg}`, hex);
}
