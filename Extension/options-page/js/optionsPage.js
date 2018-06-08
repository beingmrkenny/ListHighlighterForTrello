var GLOBAL = {};

var lis = $$('nav li');
var panes = $$('section');

listen(document, 'DOMContentLoaded', () => {
	highlightPanel(window.location.hash);
});

listen(window, 'hashchange', () => {
	highlightPanel(window.location.hash);
});

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

function highlightPanel (hashtag) {

	let link, pane, li;

	if (hashtag) {
		link = $(`a[href="${hashtag}"]`);
		pane = $(hashtag);
	} else {
		link = $('nav li a');
		pane = $('section');
	}

	li = link.closest('li');

	for (let item of lis) {
		item.classList.remove('active');
	}
	li.classList.add('active');

	for (let pane of panes) {
		pane.classList.remove('active');
	}
	pane.classList.add('active');

}

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

	for (let textSwitcher of $$('text-switcher')) {
		listen($id(textSwitcher.dataset.listen), 'change', function () {
			let switcher = $(`[data-listen="${this.id}"]`);
			switcher.textContent = switcher.dataset[ ( this.checked ? 'on' : 'off' ) ];
		});
	}

	var optionsControls = {
		HighlightTags : {
			disableInputs : [ 'HideHashtags' ],
			uncheckInputs : [ 'HideHashtags' ],
		},
		HighlightTitles : {
			disableInputs : [ 'MatchTitleSubstrings' ]
		},
		EnableWIP : {
			disableInputs : [ 'CountAllCards', 'EnablePointsOnCards' ],
			uncheckInputs : [ 'CountAllCards', 'EnablePointsOnCards' ]
		},
		EnablePointsOnCards : {
			disableInputs : [ 'HideManualCardPoints' ],
			uncheckInputs : [ 'HideManualCardPoints' ]
		},
		EnableHeaderCards : {
			disableInputs : [ 'HeaderCardsExtraSpace' ],
		},
		EnableSeparatorCards : {
			disableInputs : [ 'SeparatorCardsVisibleLine' ],
		}
	};

	for (let inputId in optionsControls) {

		let input = $id(inputId);

		observe(input, { attributes: true, attributeOldValue: true }, function (mutationRecord) {
			if (mutationRecord && mutationRecord.attributeName == 'disabled') {
				let config = optionsControls[mutationRecord.target.id];
				let disabled = true;
				if (mutationRecord.oldValue === '' && !mutation.target.checked) {
					disabled = false;
				}
				if (config.disableInputs) {
					for (let disableInput of config.disableInputs) {
						$id(disableInput).disabled = disabled;
						document.querySelector(`[for="${disableInput}"]`).classList.toggle('disabled', disabled);
					}
				}
			}
		});

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

			}

		});

	}

	for (let input of $$('input')) {
		input.dispatchEvent(new Event('change'));
	}

}

// listens to change event to trigger shit
// observe change to disable attributess

function saveOptionsOnChange () {
	for (let optionInput of $$('.options-input')) {
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

var excludes = $$('[data-exclude]');
listen(excludes, 'change', function () {
	if (this.checked) {
		for (let exclude of excludes) {
			if (exclude != this) {
				exclude.checked = false;
				exclude.dispatchEvent(new Event('change'));
			}
		}
	}
});

// for (let sub of $$('.sub-option')) {
// 	let input = sub.closest('.option-group').querySelector('input');
// 	input.addEventListener('change', (e) => {
// 		let input = this;
// 		let sub = input.closest('.option-group').querySelector('.sub-option');
// 		if (input.checked) {
// 			sub.style.display = 'block';
// 		} else {
// 			sub.style.display = 'none';
// 		}
// 	}, sub);
// 	if (input.checked) {
// 		sub.style.display = 'block';
// 	} else {
// 		sub.style.display = 'none';
// 	}
// }

function setTodoListColorForPage (color) {
	var hex = (Color.isHex(color))
		? color
		: DoingColors.getHexFromName(color);
	DoingColors.highPriColorStylesOptions(hex);
}
