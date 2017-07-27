Options.resetIfEmpty();

Options.load('colorBlindFriendlyMode', function (colorBlindFriendlyMode) {
	document.body.classList.toggle(
		'color-blind-friendly-mode',
		(typeof colorBlindFriendlyMode !== 'undefined' && colorBlindFriendlyMode === true)
	);
});

Options.load('colors', function (colors) {

	if (colors) {

		DoingColors.init(colors);

		let fallbackDefaultCustom = DoingColors.getHexFromName('gray'),
			defaultColorName      = DoingColors.getDefaultColorName(),
			defaultCustomHex      = DoingColors.getCustomHexForTrelloBg('default') || fallbackDefaultCustom,
			doingColorForBlue     = DoingColors.getColorNameForTrelloBg('blue'),
			blueCustomHex         = DoingColors.getCustomHexForTrelloBg('blue') || fallbackDefaultCustom;

		DefaultColorBar.setCustomTileColorByHex (defaultCustomHex);
		Dummy.setCustomTileColorByHex (blueCustomHex);

		if (defaultColorName == 'custom') {
			Dummy.setDefaultTileColorByHex (defaultCustomHex);
			setTodoListIconColor(defaultCustomHex);
		} else {
			Dummy.setDefaultTileColorByName (defaultColorName);
			setTodoListIconColor(defaultColorName);
		}

		DefaultColorBar.selectByColorName (defaultColorName);

		if (DoingColors.trelloBgHasDoingColor('blue')) {
			Dummy.selectTile (doingColorForBlue);
		} else {
			Dummy.selectTile ('default');
		}

		Dummy.setListColorName (doingColorForBlue);
		if (doingColorForBlue == 'custom') {
			Dummy.setDoingListColorByHex (blueCustomHex);
		} else {
			Dummy.setDoingListColorByName (doingColorForBlue);
		}

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
					if (tileIsCustom || colorName == 'custom') {
						Dummy.setDefaultTileColorByHex (customHex);
						setTodoListIconColor(customHex);
					} else {
						Dummy.setDefaultTileColorByName (colorName);
						setTodoListIconColor(colorName);
					}
				}

				if ( (tileIsDefault == true && listColorName == 'default') || tileIsDefault == false ) {
					let listColor = (tileIsDefault) ? 'default' : colorName;
					Dummy.setListColorName (listColor);
					if (tileIsCustom || colorName == 'custom') {
						Dummy.setDoingListColorByHex (customHex);
					} else {
						Dummy.setDoingListColorByName (colorName);
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
				Dummy.setCustomTileColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
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

		let expandHighPriDetails = false;
		for (let key in colors.current) {
			if (key != 'default') {
				let value = colors.current[key];
				if (value && value != 'default') {
					expandHighPriDetails = true;
					break;
				}
			}
		}

		if (expandHighPriDetails) {
			$id('HighPriDetails').open = true;
		}
	}

	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);

});

Options.load('options', function (options) {

	var optionsControls = {
		HighlightTags : {
			disableInputs : ['HideHashtags'],
			textSwitcher : {
				linkedInput: 'HideHashtags',
				targets : ['HideHashtagsSwitcher']
			}
		},
		HideHashtags : {
			textSwitcher : {
				linkedInput: 'HighlightTags',
				targets : ['HideHashtagsSwitcher']
			}
		},
		HighlightTitles : {
			disableInputs : ['MatchTitleSubstrings']
		},
		MatchTitleSubstrings : {
			textSwitcher : {
				targets: ['HighlightTitlesSwitcher', 'MatchTitleSubstringsSwitcher']
			}
		}
	}

	var optionControlInputs = document.querySelectorAll('.option-control');
	for (let i = optionControlInputs.length-1; i>-1; i--) {
		let input = optionControlInputs[i];

		input.addEventListener('change', function() {

			let input = this,
				config = optionsControls[this.id];

			if (config.disableInputs) {
				let disableInputs = config.disableInputs;
				for (let i = disableInputs.length-1; i>-1; i--) {
					let label = document.querySelector(`[for="${disableInputs[i]}"]`);
					$id(disableInputs[i]).disabled = (!input.checked);
					label.classList.toggle('disabled', (!input.checked));
				}
			}

			if (config.textSwitcher) {
				let on = input.checked;
				if (config.textSwitcher.linkedInput) {
					on = (on && $id(config.textSwitcher.linkedInput).checked);
				}
				for (let i = config.textSwitcher.targets.length-1; i>-1; i--) {
					let switcher = $id(config.textSwitcher.targets[i]);
					switcher.textContent = (on)
						? switcher.dataset.on
						: switcher.dataset.off;
				}
			}

		});

	}

	for (let name in options) {
		let input, value = options[name];
		if (typeof value == 'boolean') {
			input = $id(name);
			input.checked = value;
		} else {
			input = $id(name+value);
			input.checked = true;
		}
		input.dispatchEvent(new Event('change'));
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
			sendMessage('rehighlight');
		});
	}

});

function setTodoListIconColor (color) {
	var hex = (Color.isHex(color))
		? color
		: DoingColors.getHexFromName(color)
	$id('TodoList').style.fill = hex;
}

function saveColor (trelloBg, colorName) {
	customDoingColors[ trelloBg ] = colorName;
	Options.save(`colors.current.${trelloBg}`, colorName);
	sendMessage('colorChange');
}

function saveCustomColor (trelloBg, hex) {
	customDoingColors[ trelloBg ] = hex;
	Options.save(`colors.custom.${trelloBg}`, hex);
	sendMessage('colorChange');
}

function sendMessage (message) {
	chrome.tabs.query({}, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{message: message},
			function (response) {}
		);
	});
}
