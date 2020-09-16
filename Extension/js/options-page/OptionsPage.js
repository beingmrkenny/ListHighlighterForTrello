class OptionsPage {

	static setupDefaultListBGColor (results) {
		let normalListColor = Global.getItem('options-HighlightNormalListColor') || Color.getOriginalListBG();
		OptionsPage.insertNormalListColorsInDom(normalListColor);
		listen(
			qq('#NormalListColor div, #NormalListColor color-chooser'),
			'click',
			() => {
				let options = {
					dialogTemplate: 'FormDialogTemplate',
					contentsTemplate: 'ListHighlightColorTemplate',
					content: null,
					fields : {
						FormType : 'ListHighlightColor',
						id : 'NormalListColor'
					}
				};
				options.setup = () => {
					normalListColor = Global.getItem('options-HighlightNormalListColor') || Color.getOriginalListBG();
					ColorDialog.setup(normalListColor, true);
				};
				options.submit = entries => {
					let colorToSave,
						hex;
					if (entries.ColorInputMode == 'colortiles' && Color.isHex(entries.ColorTile)) {
						hex = colorToSave;
						colorToSave = JSON.stringify(entries.ColorTile);
					}
					if (entries.ColorInputMode == 'lightness' && /^\d+(?:\.\d+)?$/.test(entries.LightnessSlider) ) {
						colorToSave = parseFloat(entries.LightnessSlider);
						let newColor = new Color(`hsl(208.2, 6.7%, ${colorToSave}%)`);
						hex = newColor.toHex();
					}
					if (colorToSave) {
						chrome.storage.sync.set( { 'options-HighlightNormalListColor': colorToSave } );
						OptionsPage.insertNormalListColorsInDom(hex);
					}
				};
				Dialogue.open(options);
			}
		);
	}

	static insertNormalListColorsInDom (bgColor) {
		if (/^\d+(?:\.\d+)?$/.test(bgColor)) {
			bgColor = `hsl(208.2, 6.7%, ${bgColor}%)`;
		}
		let style       = qid('BMKONormalListColor'),
			color       = new Color(bgColor),
			isLight     = color.isLight(bgColor),
			fgColor     = (isLight) ? '#474747' : '#fff',
			pencil      = (isLight) ? 'url("/img/pencil.svg")' : 'url("/img/pencil-white.svg")',
			tick        = (isLight) ? 'url("/img/tick.svg")' : 'url("/img/tick-white.svg")',
			buttonColor = (isLight) ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.18)';
		if (!style) {
			style = document.createElement('style');
			style.id = 'BMKONormalListColor';
			document.head.append(style);
		}
		style.textContent = `body {
			--list-bg: ${bgColor};
			--list-fg: ${fgColor};
			--list-pencil: ${pencil};
			--list-tick: ${tick};
			--list-button-bg: ${buttonColor};
		}`;
		document.body.dataset.normalListColor = bgColor;
	}

	static setupDialogs () {
		observe(
			q('body > dialog'),
			{ attributes: true, attributeOldValue: true },
			mutations => {
				for (let mutation of mutations) {
					if (mutation.type == 'attributes') {
						if (mutation.oldValue === "") {
							Dialogue.closeHelper();
						} else if (mutation.oldValue === null) {
							Dialogue.openHelper();
						}
					}
				}
			}
		);
	}

	static checkInputOnClick () {
		let input = this.parentNode.querySelector('input');
		if (input && !input.disabled) {
			input.checked = !input.checked;
			// input.dispatchEvent(new Event('change'));
		}
	}

	static showPanel () {
		let link, pane, li, hashtag = window.location.hash;
		if (hashtag) {
			link = q(`a[href="${hashtag}"]`);
			pane = q(hashtag);
		} else {
			link = q('nav li a');
			pane = q('section');
		}
		li = link.closest('li');
		for (let item of qq('nav li')) { item.classList.remove('active'); }
		for (let pane of qq('section')) { pane.classList.remove('active'); }
		li.classList.add('active');
		pane.classList.add('active');
		document.body.dataset.currentPanel = hashtag;
	}

	static setValuesOnInputs (results) {
		var options = Options.getArrayFromResults(results);
		for (let name in options) {
			let input, value = options[name], id = name;
			if (typeof value != 'boolean') {
				id = name + value;
				value = true;
			}
			input = qid(id);
			if (input) {
				input.checked = value;
			}
		}
	}

	static setupSaveOptionsOnChange () {
		for (let optionInput of qq('.options-input')) {
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
				if (name == 'CountEnableWIP' && value == false) {
					chrome.storage.sync.set({
						'options-CountEnablePointsOnCards' : false,
						'options-CountHideManualCardPoints' : false,
						'options-CountAllCards' : false,
						'options-CountEnableWIP' : false
					});
				} else if (name == 'CountEnablePointsOnCards' && value == false) {
					chrome.storage.sync.set({
						'options-CountEnablePointsOnCards' : false,
						'options-CountHideManualCardPoints' : false
					});
				} else {
					chrome.storage.sync.set( { [`options-${name}`]: value } );
				}
			});
		}
	}

	static processAllControllingInputs () {
		for (let controllingInput of qq('[data-dependents]')) {
			OptionsPage.toggleDependentInputs(controllingInput);
			controllingInput.addEventListener('change', function () {
				OptionsPage.toggleDependentInputs(this);
			});
		}
	}

	static toggleDependentInputs (input) {
		for (let id of JSON.parse(input.dataset.dependents)) {
			if (input.id == 'CountEnableWIP') {
				qid('MoreWIPOptions').classList.toggle('disabled', !input.checked);
			} else {
				let disabled, dependent = qid(id);
				disabled = !input.checked;
				dependent.disabled = disabled;
				dependent.closest('.standard-options').classList.toggle('disabled', disabled);
			}
		}
	}

	static openNewRuleForm () {
		Dialogue.open({
			'dialogTemplate' : 'FormDialogTemplate',
			'contentsTemplate' : 'NewRuleTemplate',
			'classList' : 'rule-related-dialog',

			'setup' : mainDialogContents => {

				new ColorSelect(q('color-select', mainDialogContents));

				q('[name="is"]').addEventListener('keyup', function () {
					if (this.value.includes('#')) {
						q('.hint').classList.add('show');
					}
				});

			},

			'submit' : entries => {
				return Rule.checkNewRuleEntriesAndSaveOrFail(entries, Rule.saveNewRule, Rule.failForm);
			}
		});
	}

}
