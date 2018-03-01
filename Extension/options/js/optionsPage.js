var GLOBAL = {};

Options.resetIfEmpty(function () {

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

			for (let input of document.querySelectorAll('.color-tile-input')) {
				input.addEventListener('change', function () {
					let colorPicker = $('color-picker');
					if (colorPicker) {
						colorPicker.remove();
					}
				});
			}

			for (let tile of document.querySelectorAll('.color-tile-label')) {
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

			for (let button of document.querySelectorAll('.trello-bg-color-button')) {
				button.addEventListener('click', function () {
					var trelloBg = this.dataset.trelloBg;
					Dummy.changeBackgroundColor(trelloBg);
					Dummy.setCustomTileColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
				});
			}

			for (let link of document.querySelectorAll('.edit-link')) {
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

		for (let name in options) {
			let input, value = options[name], id = name;
			if (typeof value != 'boolean') {
				id = name + value;
				value = true;
			}
			input = $id(id);
			if (input) {
				input.checked = value;
			}
		}

		var optionsControls = {
			HighlightTags : {
				disableInputs : [ 'HideHashtags' ],
				textSwitcher : {
					linkedInput: 'HideHashtags',
					targets : [ 'HideHashtagsSwitcher' ]
				}
			},
			HideHashtags : {
				textSwitcher : {
					linkedInput: 'HighlightTags',
					targets : [ 'HideHashtagsSwitcher' ]
				}
			},
			HighlightTitles : {
				disableInputs : [ 'MatchTitleSubstrings' ]
			},
			MatchTitleSubstrings : {
				textSwitcher : {
					targets: [ 'HighlightTitlesSwitcher', 'MatchTitleSubstringsSwitcher' ]
				}
			},
			EnableWIP : {
				disableInputs : [ 'CountAllCards', 'EnablePointsOnCards', 'HideManualCardPoints' ],
				uncheckInputs : [ 'CountAllCards', 'EnablePointsOnCards', 'HideManualCardPoints' ]
			},
			EnablePointsOnCards : {
				disableInputs : [ 'HideManualCardPoints' ],
				uncheckInputs : [ 'HideManualCardPoints' ]
			}
		};

		for (let inputId in optionsControls) {

			let input = $id(inputId);

			input.addEventListener('change', function() {

				let input = this,
					config = optionsControls[this.id];

				if (config) {

					if (input.checked == false && config.uncheckInputs) {
						for (let uncheckInputId of config.uncheckInputs) {
							$id(uncheckInputId).checked = false;
						}
					}

					if (config.disableInputs) {
						for (let disableInput of config.disableInputs) {
							$id(disableInput).disabled = !input.checked;
							document.querySelector(`[for="${disableInput}"]`).classList.toggle('disabled', !input.checked);
						}
					}

					if (config.textSwitcher) {
						let on = input.checked;
						if (config.textSwitcher.linkedInput) {
							on = (on && $id(config.textSwitcher.linkedInput).checked);
						}
						for (let target of config.textSwitcher.targets) {
							let switcher = $id(target);
							switcher.textContent = switcher.dataset[ ( on ? 'on' : 'off' ) ];
						}
					}

				}

			});

		}

		for (let input of $$('input')) {
			input.dispatchEvent(new Event('change'));
		}

		var optionInputs = document.querySelectorAll('.options-input');
		for (let optionInput of optionInputs) {
			optionInput.addEventListener('change', function () {
				let input = this,
					name = input.name,
					value = (input.type == 'radio')
						? document.querySelector(`input[name="${input.name}"]:checked`).value
						: input.checked;

				// FIXME make the sendMessage thing more generic

				if (name == 'EnableWIP' && value == false) {

					Options.save('options.EnablePointsOnCards', false, function () {
						Options.save('options.HideManualCardPoints', false, function () {
							Options.save('options.CountAllCards', false, function () {
								Options.save('options.EnableWIP', false, function () {
									sendMessage('options.EnableWIP');
								});
							});
						});
					});

				} else if (name == 'EnablePointsOnCards' && value == false) {

					Options.save('options.EnablePointsOnCards', false, function () {
						Options.save('options.HideManualCardPoints', false, function () {
							sendMessage('options.EnablePointsOnCards');
						});
					});

				} else {

					Options.save(`options.${name}`, value, function () {
						sendMessage(`options.${name}`);
					});

				}

			});
		}

	});

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
		saveRecentColor(hex);
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
