class OptionsPage {
	static setupDialogs() {
		observe(
			q('body > dialog'),
			{ attributes: true, attributeOldValue: true },
			(mutations) => {
				for (const mutation of mutations) {
					if (mutation.type == 'attributes') {
						if (mutation.oldValue === '') {
							Dialogue.closeHelper();
						} else if (mutation.oldValue === null) {
							Dialogue.openHelper();
						}
					}
				}
			}
		);
	}

	static checkInputOnClick() {
		const input = this.parentNode.querySelector('input');
		if (input && !input.disabled) {
			input.checked = !input.checked;
		}
	}

	static showPanel() {
		OptionsPage.resetTabs();
		const hashtag = window.location.hash,
			link = hashtag ? q(`a[href="${hashtag}"]`) : q('nav li a'),
			pane = hashtag ? q(hashtag) : q('section'),
			li = link.closest('li');
		for (const item of qq('nav li')) {
			item.classList.remove('active');
		}
		for (const pane of qq('section')) {
			pane.classList.remove('active');
		}
		li = link.closest('li');
		for (let item of qq('nav li')) { item.classList.remove('active'); }
		for (let pane of qq('section')) { pane.classList.remove('active'); }
		li.classList.add('active');
		pane.classList.add('active');
		document.body.dataset.currentPanel = hashtag;
		if (hashtag == '#Data') {
			Export.displayRulesToExport();
		}
	}

	static resetTabs() {
		DataSection.resetPage();
		qid('DataPanel').textContent = '';
		Array.from(qq('.success-message')).forEach((div) => div.remove());
	}

	static setValuesOnInputs(results) {
		const options = Options.getArrayFromResults(results);
		for (const name in options) {
			let input,
				value = options[name],
				id = name;
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

	static setupSaveOptionsOnChange() {
		for (const optionInput of qq('.options-input')) {
			optionInput.addEventListener('change', function () {
				const input = this,
					name = input.name;
				let value;
				switch (input.type) {
					case 'radio':
						value = document.querySelector(
							`input[name="${input.name}"]:checked`
						).value;
						break;
					case 'checkbox':
						value = input.checked;
						break;
					default:
						value = input.value;
				}
				if (name == 'CountEnableWIP' && value == false) {
					chrome.storage.sync.set({
						'options-CountEnablePointsOnCards': false,
						'options-CountHideManualCardPoints': false,
						'options-CountAllCards': false,
						'options-CountEnableWIP': false,
					});
				} else if (name == 'CountEnablePointsOnCards' && value == false) {
					chrome.storage.sync.set({
						'options-CountEnablePointsOnCards': false,
						'options-CountHideManualCardPoints': false,
					});
				} else {
					chrome.storage.sync.set({ [`options-${name}`]: value });
				}
			});
		}
	}

	static processAllControllingInputs() {
		for (const controllingInput of qq('[data-dependents]')) {
			OptionsPage.toggleDependentInputs(controllingInput);
			controllingInput.addEventListener('change', function () {
				OptionsPage.toggleDependentInputs(this);
			});
		}
	}

	static toggleDependentInputs(input) {
		for (const id of JSON.parse(input.dataset.dependents)) {
			if (input.id == 'CountEnableWIP') {
				qid('MoreWIPOptions').classList.toggle('disabled', !input.checked);
			} else {
				const disabled = !input.checked,
					dependent = qid(id);
				dependent.disabled = disabled;
				dependent
					.closest('.standard-options')
					.classList.toggle('disabled', disabled);
			}
		}
	}

	static openNewRuleForm() {
		Dialogue.open({
			dialogTemplate: 'FormDialogTemplate',
			contentsTemplate: 'NewRuleTemplate',
			classList: 'rule-related-dialog',

			setup: (mainDialogContents) => {
				new ColorSelect(q('color-select', mainDialogContents));

				q('[name="is"]').addEventListener('keyup', function () {
					if (this.value.includes('#')) {
						q('.hint').classList.add('show');
					}
				});
			},

			submit: (entries) => {
				return Rule.checkNewRuleEntriesAndSaveOrFail(
					entries,
					Rule.saveNewRule,
					Rule.failForm
				);
			},
		});
	}
}
