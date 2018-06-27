var GLOBAL = {};

var lis = $$('nav li');
var panes = $$('section');

listen(document, 'DOMContentLoaded', () => {
	highlightPanel(window.location.hash);
});

listen(window, 'hashchange', () => {
	highlightPanel(window.location.hash);
});

listen($$('.standard-options div'), 'click', function () {
	let input = this.previousElementSibling.querySelector('input');
	if (!input.disabled) {
		input.checked = !input.checked;
		input.dispatchEvent(new Event('change'));
	}
});

var opacityRanges = document.querySelectorAll('.opacity-range');
listen(opacityRanges, 'input', function () {
	$(`[data-value-label-for="${this.name}"]`).textContent = Math.round(this.value * 100) + '%';
	$id(this.name + 'Example').style.opacity = this.value;
});

Options.initialise(function (results) {
	document.body.classList.toggle('color-blind-friendly-mode', (results.colorBlindFriendlyMode));
	GLOBAL.colors = Options.processColors(results);
	DoingColors.setupDimmingCSS();
	setupDummy();
	setValuesOnInputs(results);
	connectInputsToEachOther();
	saveOptionsOnChange();
	setupDimmingExample();
	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);
});

function setupDimmingExample () {
	$id('DimmingLow').value = GLOBAL.DimmingLow;
	$('[data-value-label-for="DimmingLow"]').textContent = Math.round(GLOBAL.DimmingLow * 100) + '%';

	$id('DimmingDone').value = GLOBAL.DimmingDone;
	$('[data-value-label-for="DimmingDone"]').textContent = Math.round(GLOBAL.DimmingDone * 100) + '%';

	DoingColors.setupDimmingCSS();
}

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
		let subject = $id(textSwitcher.dataset.listen);
		listen(subject, 'change', function () {
			for (let switcher of $$(`[data-listen="${this.id}"]`)) {
				switcher.textContent = switcher.dataset[ ( this.checked ? 'on' : 'off' ) ];
			}
		});
		subject.dispatchEvent(new Event('change'));
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
				if (mutationRecord.oldValue === '' && !mutationRecord.target.checked) {
					disabled = false;
				}
				if (config.disableInputs) {
					disableInputs (config.disableInputs, disabled)
				}
			}
		});

		input.addEventListener('change', function() {
			let config = optionsControls[this.id];
			if (config) {
				if (this.checked == false && config.uncheckInputs) {
					for (let uncheckInputId of config.uncheckInputs) {
						$id(uncheckInputId).checked = false;
					}
				}
				if (config.disableInputs) {
					disableInputs (config.disableInputs, !this.checked);
				}
			}
		});

		setTimeout(function () {
			input.dispatchEvent(new Event('change'));
		}, 0);

	}

}

function disableInputs (disableInputs, status) {
	for (let disableInput of disableInputs) {
		$id(disableInput).disabled = status;
		let label = document.querySelector(`[for="${disableInput}"]`),
			widget = label.closest('option-widget');
		label.classList.toggle('disabled', status);
		if (widget) {
			widget.classList.toggle('disabled', status);
		}
	}
}

function saveOptionsOnChange () {
	for (let optionInput of $$('.options-input')) {
		optionInput.addEventListener('change', function () {
			let input = this,
				name = input.name,
				value;

			switch (input.type) {
				case 'radio' :
					value = document.querySelector(`input[name="${input.name}"]:checked`).value;
					break;
				case 'checkbox' :
					value = input.checked;
					break;
				default :
					value = input.value;
			}

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
						if (name == 'DimmingLow' || name == 'DimmingDone') {
							DoingColors.setupDimmingCSS();
						}
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

function setTodoListColorForPage (color) {
	var hex = (Color.isHex(color))
		? color
		: DoingColors.getHexFromName(color);
	DoingColors.highPriColorStylesOptions(hex);
}
