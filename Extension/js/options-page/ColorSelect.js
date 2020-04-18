class ColorSelect {

	constructor (colorSelectElement) {

		if (colorSelectElement.dataset.type == 'trello-background') {
			for (let selectedButton of qq('[data-type="trello-background"] [data-selected]')) {
				let trelloBGColorClass = ovalue(selectedButton.className.match(/(fill-trello-[a-z]+)/), 0);
				q(`.${trelloBGColorClass}`, colorSelectElement).disabled = (trelloBGColorClass != 'fill-trello-blank');
			}
		}

		listen( qq('button', colorSelectElement), 'click', ColorSelect.buttonClickHandler);

		ColorSelect.disableDropdownsAsAppropes();

		let colorSelectEditColorButton = q('.color-select-edit-custom-color-button', colorSelectElement.parentNode);
		if (colorSelectEditColorButton) {
			colorSelectEditColorButton.addEventListener('click', ColorSelect.openColorPicker);
		}

	}

	static disableDropdownsAsAppropes () {
		for (let trelloButton of qq('li:not(:last-child) [data-type="trello-background"] button')) {
			trelloButton.classList.add('mod-no-dropdown');
		}
	}

	static buttonClickHandler () {
		var colorPicker = q('dialog.color-picker');
		if (colorPicker && colorPicker.open) {
			this.blur();
			return false;
		}
		let colorSelect = this.closest('color-select');
		if (!colorSelect.classList.contains('mod-inline') && !colorSelect.dataset.open) {
			ColorSelect.open(this);
		} else {
			ColorSelect.selectAndClose(this);
		}
	}

	static open (button) {

		var colorSelect = button.closest('color-select'),
			type = colorSelect.dataset.type,
			ul = colorSelect.firstElementChild,
			li = button.parentNode;

		if (!button.classList.contains('mod-no-dropdown')) {
			let top,
				overflow,
				colorSelectBox = colorSelect.getBoundingClientRect();
			colorSelect.dataset.open = 1;
			top = 0 - button.offsetTop + (li == ul.firstElementChild ? 1 : 0);
			ul.style.top = `${top}px`;
			colorSelect.style.width = `${colorSelectBox.width}px`;
			colorSelect.style.height = `${colorSelectBox.height}px`;
			overflow = ul.getBoundingClientRect().bottom - q('.form-dialog-body').getBoundingClientRect().bottom;
			if (overflow > 0) {
				top = parseInt(ul.style.top) - overflow - 10;
				ul.style.top = `${top}px`;
			}
			button.closest('dialog').addEventListener('click', ColorSelect.closeListener);
		}

	}

	static selectAndClose (button) {

		var colorSelect = button.closest('color-select'),
			type = colorSelect.dataset.type,
			ul = colorSelect.firstElementChild;

		q('[data-selected]', colorSelect).removeAttribute('data-selected');
		button.setAttribute('data-selected', 1);
		colorSelect.dataset.value = button.value;

		var editButtonContainer = q('.color-select-edit-custom-color-button-container', colorSelect.parentNode);
		if (editButtonContainer) {
			if (button.classList.contains('fill-custom')) {
				editButtonContainer.style.display = 'inline-block';
				if (!button.value) {
					ColorSelect.openColorPicker.call(q('button', editButtonContainer));
				}
			} else {
				editButtonContainer.removeAttribute('style');
			}
		}

		if (colorSelect.dataset.type == 'trello-background') {
			ColorSelect.disableTrelloBGButtonsSelectedElsewhere();
		}

		ColorSelect.closeAll();
	}

	static disableTrelloBGButtonsSelectedElsewhere () {
		let allTrelloBGButtons = qq('[data-type="trello-background"] button');
		let classesToDisable = [];
		for (let button of allTrelloBGButtons) {
			button.disabled = false;
			if (ovalue(button, 'dataset', 'selected')) {
				let trelloBGColorClass = ovalue(button.className.match(/(fill-trello-[a-z]+)/), 0);
				classesToDisable.push(`[data-type="trello-background"] .${trelloBGColorClass}`);
			}
		}

		let masterSelector = classesToDisable.join(',');
		if (masterSelector) {
			for (let button of qq(masterSelector)) {
				if (!ovalue(button, 'dataset', 'selected')) {
					button.disabled = true;
				}
			}
		}

		for (let trelloButton of qq('li:not(:last-child) [data-type="trello-background"] button')) {
			trelloButton.classList.add('mod-no-dropdown');
		}
	}

	static openColorPicker () {
		var colorSelectEditColorButton = this;
		// QUESTION: can colorSelect be passed into the constructor below (save and cancel), so it doesn't need to be looked up again?
		var colorSelect = q(`[data-name="${colorSelectEditColorButton.dataset.for}"]`);
		var target = q('.fill-custom[data-selected]', colorSelect);
		colorSelectEditColorButton.dataset.colorOnOpen = colorSelect.dataset.value;
		new ColorPickerWrapper({
			target : target,
			opener : colorSelectEditColorButton,
			initialColor : target.value || '#e2e4e6',
			place: function (dialog) {
				let left,
					parent = target.closest('color-select');
				parent.appendChild(dialog);
				left = (dialog.offsetWidth - parent.offsetWidth) / 2;
				dialog.classList.add('position-top');
				dialog.style.left = `-${left}px`;
			},
			colorUpdateHandler : function (hex) {
				ListHighlightColorDialog.updateDemoListColor(hex);
				ColorSelect.setCustomColorButtonValue(target.closest('color-select'), hex);
			},
			save : (color) => {
				let colorSelect = q(`[data-name="${colorSelectEditColorButton.dataset.for}"]`);
				ColorSelect.selectAndClose(q('.fill-custom', colorSelect));
			},
			cancel : (options) => {
				let colorSelect = q(`[data-name="${colorSelectEditColorButton.dataset.for}"]`),
					colorOnOpen = colorSelectEditColorButton.dataset.colorOnOpen,
					buttonToSelect = q(`li > [value="${colorOnOpen}"]`, colorSelect);
				if (!colorOnOpen) {
					ColorSelect.setCustomColorButtonValue(colorSelect);
					buttonToSelect = q('.fill-blank', colorSelect);
				} else if (!buttonToSelect) {
					ColorSelect.setCustomColorButtonValue(colorSelect, colorOnOpen);
					buttonToSelect = q('.fill-custom', colorSelect);
				}
				ColorSelect.selectAndClose(buttonToSelect);
				ListHighlightColorDialog.updateDemoListColor(colorOnOpen || '#e2e4e6');
			}
		});

	}

	static setCustomColorButtonValue (colorSelect, value = null) {
		var customButton = q('.fill-custom', colorSelect);
		if (value == null) {
			customButton.value = '';
			customButton.removeAttribute('style');
			customButton.classList.remove('mod-light-background');
		} else {
			customButton.value = value;
			customButton.classList.toggle('mod-light-background', Color.isLight(value));
			customButton.style.backgroundColor = value;
		}

	}

	// FIXME: This close listener is being applied to the IS dialog cancel button — why?
	static closeListener (event) {
		var colorSelectParentSearch = event.target.closest('color-select');
		if (!colorSelectParentSearch && event.target.tagName != 'BUTTON') {
			ColorSelect.closeAll();
		}
	}

	static closeAll() {
		var selects = qq('color-select');
		for (let select of selects) {
			if (!select.classList.contains('mod-inline')) {
				select.removeAttribute('data-open');
				select.removeAttribute('style');
				q('ul', select).removeAttribute('style');
			}
		}
	}

}
