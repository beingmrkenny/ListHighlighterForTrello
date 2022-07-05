class Dialogue {

	static open (options) {

		var dialog = q('body > dialog'),
			mainDialogContents = getTemplate(options.dialogTemplate),
			customDialogContents = getTemplate(options.contentsTemplate),
			header = q('.form-dialog-header', mainDialogContents),
			formBody = q('.form-dialog-body', mainDialogContents);

		dialog.id = options.contentsTemplate.replace('Template', 'Dialog');

		if (customDialogContents instanceof HTMLElement) {
			formBody.appendChild(customDialogContents);
		} else if (customDialogContents instanceof DocumentFragment) {
			for (let node of customDialogContents.childNodes) {
				formBody.appendChild(customDialogContents);
			}
		}

		if (options.content) {
			let content = options.content;
			if (Array.isArray(content)) content = content.join('\n');
			if (content) content += '\n';
			q('input, textarea', formBody).value = content;
		}

		if (options.fields) {
			for (let name in options.fields) {
				formBody.appendChild(
					createElement(`<input type="hidden" name="${name}" value="${options.fields[name]}">`)
				);
			}
		}

		for (let button of qq('.helper', mainDialogContents)) {
			button.addEventListener('click', function () {
				let note = q('.form-field-note', this.parentNode);
				if (ovalue(note, 'style', 'display') == 'block') {
					note.style.display = 'none';
				} else {
					note.style.display = 'block';
				}
			});
		}

		dialog.appendChild(mainDialogContents);

		autosize(qq('textarea', mainDialogContents));
		autosize.update(qq('textarea', mainDialogContents));

		if (options.setup && typeof options.setup == 'function') {
			options.setup(mainDialogContents);
		}

		if (options.classList) {
			if (Array.isArray(options.classList)) {
				dialog.classList.add(...options.classList);
			} else if (typeof options.classList == 'string') {
				dialog.classList.add(options.classList);
			}
		}

		if (options.submit && typeof options.submit == 'function') {
			q('form', dialog).addEventListener('submit', function (event) {
				event.preventDefault();
				event.stopPropagation();
				let formData = new FormData(this);
				let entries = {};
				for (let pair of formData.entries()) {
					entries[pair[0]] = pair[1];
				}
				for (let colorSelect of qq('color-select', this)) {
					if (colorSelect.dataset.name && ovalue(colorSelect, 'dataset', 'disabled') !== 'true') {
						entries[colorSelect.dataset.name] = q('button[data-selected]', colorSelect).value;
					}
				}
				for (let errorMessage of qq('.error', this)) {
					errorMessage.classList.remove('show');
				}
				for (let li of qq('.error li', this)) {
					li.remove();
				}
				if (options.submit(entries) !== false) {
					Dialogue.close();
				}
			});
		}

		dialog.showModal();

	}

	static getValueAndDisabledFromInput (input) {
		let value,
			disabled;
		if (input.type && (input.type == 'radio' || input.type == 'checkbox')) {
			value = input.value + ((input.checked) ? '_true' : '_false');
			disabled = input.disabled;
		} else if (input.tagName == 'COLOR-SELECT') {
			value = ovalue(input, 'dataset', 'value');
			disabled = (ovalue(input, 'dataset', 'disabled') == 'true');
		} else {
			value = input.value;
			disabled = input.disabled;
		}
		return { value: value, disabled: disabled };
	}

	static formHasChanges () {
		return Array.from(qq('.js-check-changed')).some((input) => {
			let inputValues = Dialogue.getValueAndDisabledFromInput(input),
				originalValue = ovalue(input, 'dataset', 'originalValue'),
				originalDisabled = (ovalue(input, 'dataset', 'originalDisabled') == 'true');
			return ( originalValue != inputValues.value || originalDisabled != inputValues.disabled );
		});
	}

	static setupCheckForChanges() {
		for (let input of qq('.js-check-changed:not([data-original-value])')) {
			let inputValues = Dialogue.getValueAndDisabledFromInput(input);
			input.dataset.originalValue = inputValues.value;
			input.dataset.originalDisabled = inputValues.disabled;
		}
	}

	static openHelper () {
		Dialogue.setupCheckForChanges();
		Dialogue.setupClose();
		document.body.classList.add('no-scroll');
		var focus = q(':focus');
		if (focus) {
			focus.blur();
		}
	}

	static setupClose () {
		q('body > dialog[open]').addEventListener ('click', Dialogue.checkBeforeClose);
		document.addEventListener('keyup', Dialogue.closeOnEsc);
		qid('Cancel').addEventListener( 'click',  Dialogue.close);
	}

	static checkBeforeClose (event) {
		if (event.target == this) {
			let changes = Dialogue.formHasChanges();
			// TODO use a better way of confirming this than confirm()
			if (!changes || (changes && confirm('This form has changes. Are you sure you want to close?'))) {
				Dialogue.close();
			}
		}
	}

	static closeOnEsc () {
		if (event.key === 'Escape') {
			Dialogue.close();
		}
	}

	static close () {
		q('body > dialog[open]').close();
	}

	static closeHelper () {
		let dialog = q('body > dialog');
		let dialogContents = q('dialog-contents');
		if (dialogContents) {
			dialogContents.remove();
		}
		document.removeEventListener('keyup', Dialogue.closeOnEsc);
		document.body.classList.remove('no-scroll');
		while(dialog.attributes.length > 0) {
			dialog.removeAttribute(dialog.attributes[0].name);
		}
		for (let focussedRule of qq('.focussed-rule')) {
			focussedRule.classList.remove('focussed-rule');
		}
	}

}
