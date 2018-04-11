var GLOBAL = {};

Options.initialise(function (results) {
	document.body.classList.toggle('color-blind-friendly-mode', (results.colorBlindFriendlyMode));
	GLOBAL.colors = Options.processColors(results);
	setupDummy();
	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);
	setValuesOnInputs(results);
	connectInputsToEachOther();
	saveOptionsOnChange();
});

function setValuesOnInputs (results) {
	var options = Options.processOptions(results);
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
}

function connectInputsToEachOther () {

	var optionsControls = {
		HighlightTags : {
			disableInputs : [ 'HideHashtags' ],
			uncheckInputs : [ 'HideHashtags' ],
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

}

function saveOptionsOnChange () {
	var optionInputs = document.querySelectorAll('.options-input');
	for (let optionInput of optionInputs) {
		optionInput.addEventListener('change', function () {
			let input = this,
				name = input.name,
				value = (input.type == 'radio')
					? document.querySelector(`input[name="${input.name}"]:checked`).value
					: input.checked;

			if (name == 'EnableWIP' && value == false) {

				Options.save(
					{
						'options.EnablePointsOnCards' : false,
						'options.HideManualCardPoints' : false,
						'options.CountAllCards' : false,
						'options.EnableWIP' : false
					},
					function () {
						sendMessage('options.EnableWIP');
					}
				);

			} else if (name == 'EnablePointsOnCards' && value == false) {

				Options.save(
					{
						'options.EnablePointsOnCards' : false,
						'options.HideManualCardPoints' : false
					},
					function () {
						sendMessage('options.EnablePointsOnCards');
					}
				);

			} else {

				Options.save(
					{
						[`options.${name}`]: value
					},
					function () {
						sendMessage(`options.${name}`);
					}
				);

			}

		});
	}
}

function setTodoListColorForPage (color) {
	var hex = (Color.isHex(color))
		? color
		: DoingColors.getHexFromName(color);
	DoingColors.highPriColorStylesOptions(hex);
}
