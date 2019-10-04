class ListHighlightColorDialog {

	static setup () {
		var rule = Global.getItem(this.fields.id),
			editCustomColorLink = q('.color-tile-edit-color');
		ListHighlightColorDialog.setOpacityValue(rule.highlighting.opacity, true);
		ListHighlightColorDialog.selectColorTile(rule.highlighting.color);
		ListHighlightColorDialog.setupExceptions(rule.highlighting.exceptions);
		ListHighlightColorDialog.updateDemoListColor(rule.highlighting.color || '#e2e4e6');
		listen(qq('[name="ColorTile"]'), 'change', function () {
			if (this.value) {
				this.closest('.color-tile-bar').dataset.lastValidColor = this.value;
			}
			let color = this.value || '#e2e4e6';
			ListHighlightColorDialog.updateDemoListColor(color);
			if (this.id == 'ColorTile-custom' && this.value == '') {
				ListHighlightColorDialog.editCustomColor.call(editCustomColorLink);
			}
		});
		listen(qid('Opacity'), 'input', function () {
			ListHighlightColorDialog.setOpacityValue(this.value);
		});
		listen(editCustomColorLink, 'click', ListHighlightColorDialog.editCustomColor);
		listen(qid('AddNewException'), 'click', ListHighlightColorDialog.addExceptionLiElement);
		Dialogue.setupCheckForChanges();
	}

	static updateDemoListColor (hex) {
		let demoList = q('.dummy-board_demo-list');
		demoList.className = 'dummy-board_list dummy-board_demo-list';
		demoList.style.backgroundColor = hex;
		demoList.classList.toggle('mod-light-background', Color.isLight(hex));
	}

	static selectColorTile (color) {
		color = color || '#e2e4e6';
		let input = q(`[value="${color}"]:not(#ColorTile-custom)`);
		if (!input) {
			input = qid('ColorTile-custom');
			input.value = color;
			q('[for="ColorTile-custom"]').style.backgroundColor = color;
		}
		q('.color-tile-bar').dataset.lastValidColor = color;
		input.checked = true;
	}

	static setOpacityValue (value, updateInput = false) {
		if (updateInput) {
			qid('Opacity').value = value;
		}
		q('[name="opacity-value"]').textContent = Math.round(value * 100) + '%';
		q('.dummy-board_demo-list').style.opacity = value;
	}

	static setupExceptions (exceptions) {
		let exceptionsElement = q('.highlight-color-exceptions');
		for (let trelloBgColor in exceptions) {
			q('.highlight-color-exception-section').open = true;
			exceptionsElement.appendChild(ListHighlightColorDialog.createExceptionLi(
				trelloBgColor,
				exceptions[trelloBgColor],
				true
			));
		}
	}

	static createExceptionLi (trelloBgColor, highlightColor, noDropdown = false) {
		var li = getTemplate('ExceptionLiTemplate'),
			i = qq('.highlight-color-exceptions > li').length;

		if (trelloBgColor && highlightColor) {
			for (let colorSelectElement of qq('color-select', li)) {
				let selectedButton;
				delete q('[data-selected]', colorSelectElement).dataset.selected;
				if (colorSelectElement.dataset.type == 'trello-background') {
					selectedButton = q(`.fill-trello-${trelloBgColor}`, colorSelectElement);
					if (noDropdown) {
						selectedButton.classList.add('mod-no-dropdown');
					}
					selectedButton.dataset.selected = "yes";
				} else {
					selectedButton = q(`[value="${highlightColor}"]`, colorSelectElement);
					if (!selectedButton) {
						selectedButton = q('.fill-custom', colorSelectElement);
						selectedButton.value = highlightColor;
						selectedButton.style.backgroundColor = highlightColor;
						let color = new Color(highlightColor);
						selectedButton.classList.toggle('mod-light-background', color.isLight());
						q('.color-select-edit-custom-color-button-container', li).style.display = 'inline-block';
					}
					selectedButton.dataset.selected = "yes";
				}
				colorSelectElement.dataset.value = selectedButton.value;
				colorSelectElement.dataset.lastValidColor = selectedButton.value;
			}
			li.dataset.status = 'complete';
		}

		for (let colorSelect of qq('color-select', li)) {
			colorSelect.dataset.name = colorSelect.dataset.name.replace('[]', `[${i}]`);
		}

		var colorButton = q('.color-select-edit-custom-color-button', li);
		colorButton.dataset.for = colorButton.dataset.for.replace('[]', `[${i}]`);

		for (let colorSelectElement of qq('color-select', li)) {
			new LHCDColorSelect(colorSelectElement);
		}

		q('.highlight-exception-delete', li).addEventListener('click', function () {
			let exceptionLi = this.closest('li'),
				buttons = qq('color-select button', exceptionLi),
				markForDeletion = !(exceptionLi.classList.contains('mod-marked-for-deletion'));
			q('color-select', exceptionLi).dataset.disabled = markForDeletion;
			exceptionLi.classList.toggle('mod-marked-for-deletion', markForDeletion);
			for (let button of buttons) {
				button.disabled = markForDeletion;
			}
			this.textContent = (markForDeletion) ? 'Undo' : 'Delete';
		});

		return li;

	}

	static addExceptionLiElement (event) {
		let exceptionsElement = q('.highlight-color-exceptions');
		if (!q('.highlight-color-exception-section li[data-status="incomplete"]')) {
			exceptionsElement.appendChild(ListHighlightColorDialog.createExceptionLi(null, null));
			ColorSelect.disableDropdownsAsAppropes();
			Dialogue.setupCheckForChanges();
		}
	}

	static editCustomColor () {
		this.dataset.colorOnOpen = qid('ColorTile-custom').value;

		new ColorPickerWrapper({
			opener : this,
			initialColor : qid('ColorTile-custom').value || '#e2e4e6',
			place: function (dialog) {
				let parent = q('[for="ColorTile-custom"]'),
					right = parent.offsetWidth + 10;
				parent.appendChild(dialog);
				dialog.classList.add('position-left');
				dialog.style.right = `${right}px`;
			},
			colorUpdateHandler : function (hex) {
				let customLabel = q('[for="ColorTile-custom"]');
				ListHighlightColorDialog.updateDemoListColor(hex);
				customLabel.classList.toggle('mod-light-background', Color.isLight(hex));
				customLabel.style.backgroundColor = hex;
				qid('ColorTile-custom').value = hex;
			},
			save : () => {
				q('.color-tile-bar').dataset.lastValidColor = qid('ColorTile-custom').value
			},
			cancel : () => {
				let colorOnOpen = this.dataset.colorOnOpen || '#e2e4e6',
					lastValidColor = this.closest('.color-tile-bar').dataset.lastValidColor,
					customLabel = q('[for="ColorTile-custom"]');
				qid('ColorTile-custom').value = this.dataset.colorOnOpen;
				if (this.dataset.colorOnOpen == '') {
					customLabel.removeAttribute('style');
					customLabel.classList.remove('mod-light-background');
				} else {
					customLabel.style.backgroundColor = colorOnOpen;
					customLabel.classList.toggle('mod-light-background', Color.isLight(colorOnOpen));
				}
				ListHighlightColorDialog.updateDemoListColor(lastValidColor);
				ListHighlightColorDialog.selectColorTile(lastValidColor);
			}
		});
	}

}
