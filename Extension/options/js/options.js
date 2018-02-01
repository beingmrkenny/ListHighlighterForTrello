var GLOBAL = {};

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
			setTodoListColorForPage(defaultCustomHex);
		} else {
			Dummy.setDefaultTileColorByName (defaultColorName);
			setTodoListColorForPage(defaultColorName);
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

		let inputs = document.querySelectorAll('.color-tile-input');
		for (let input of inputs) {
			input.addEventListener('change', function () {
				let colorPicker = $('color-picker');
				if (colorPicker) {
					colorPicker.remove();
				}
			});
		}

		let tiles = document.querySelectorAll('.color-tile-label');
		for (let tile of tiles) {
			tile.addEventListener('click', function () {

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
						setTodoListColorForPage(customHex);
					} else {
						Dummy.setDefaultTileColorByName (colorName);
						setTodoListColorForPage(colorName);
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

				Dummy.activateTrelloBgButtonIndicator(trelloBg, colorName);

				saveColor(trelloBg, colorName);

			});
		}

		let trelloBackgroundColorButtons = document.querySelectorAll('.trello-bg-color-button');
		for (let button of trelloBackgroundColorButtons) {
			button.addEventListener('click', function () {
				var trelloBg = this.dataset.trelloBg;
				Dummy.changeBackgroundColor(trelloBg);
				Dummy.setCustomTileColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
			});
		}

		let editCustomColorLinks = document.querySelectorAll('.edit-link');
		for (let link of editCustomColorLinks) {
			link.addEventListener('click', function (event) {
				event.preventDefault();
				setupColorPicker(this.closest('.color-tile-label'));
			});
		}

		let expandHighPriDetails = false;
		for (let trelloBg in colors.current) {
			if (trelloBg != 'default') {
				let colorName = colors.current[trelloBg];
				if (colorName && colorName != 'default') {
					Dummy.activateTrelloBgButtonIndicator(trelloBg, colorName);
					expandHighPriDetails = true;
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
	};

	var optionControlInputs = document.querySelectorAll('.option-control');
	for (let input of optionControlInputs) {

		input.addEventListener('change', function() {

			let input = this,
				config = optionsControls[this.id];

			if (config && config.disableInputs) {
				let disableInputs = config.disableInputs;
				for (let disableInput of disableInputs) {
					let label = document.querySelector(`[for="${disableInputs}"]`);
					$id(disableInput).disabled = (!input.checked);
					label.classList.toggle('disabled', (!input.checked));
				}
			}

			if (config && config.textSwitcher) {
				let on = input.checked;
				if (config.textSwitcher.linkedInput) {
					on = (on && $id(config.textSwitcher.linkedInput).checked);
				}
				for (let target of config.textSwitcher.targets) {
					let switcher = $id(target);
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
			if (input) {
				input.checked = value;
			}

		} else {
			input = $id(name+value);
			if (input) {
				input.checked = true;
			}
		}
		if (input) {
			input.dispatchEvent(new Event('change'));
		}
	}

	var optionInputs = document.querySelectorAll('.options-input');
	for (let optionInput of optionInputs) {
		optionInput.addEventListener('change', function () {
			let input = this,
				name = input.name,
				value = (input.type == 'radio')
					? document.querySelector(`input[name="${input.name}"]:checked`).value
					: input.checked;
			Options.save(`options.${name}`, value, function () {
				sendMessage('rehighlight');
			});
		});
	}

});

function setTodoListColorForPage (color) {
	var hex = (Color.isHex(color))
		? color
		: DoingColors.getHexFromName(color);
	DoingColors.highPriColorStylesOptions(hex);
}

function saveColor (trelloBg, colorName) {
	currentDoingColors[ trelloBg ] = colorName;
	Options.save(`colors.current.${trelloBg}`, colorName, function () {
		sendMessage('colorChange');
	});

}

function saveCustomColor (trelloBg, hex) {
	if (hex == 'custom') {
		throw new Error('Provided color is not a hex code');
	}
	customDoingColors[ trelloBg ] = hex;
	Options.save(`colors.custom.${trelloBg}`, hex, function () {
		sendMessage('colorChange');
	});
}

function sendMessage (message) {
	chrome.tabs.query({}, function (tabs) {
		for (let tab of tabs) {
			chrome.tabs.sendMessage(
				tab.id,
				{message: message},
				function (response) {}
			);
		}
	});
}
