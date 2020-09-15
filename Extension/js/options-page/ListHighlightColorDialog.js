class ListHighlightColorDialog extends ColorDialog {

	static setup () {
		var rule = Global.getItem(this.fields.id),
			editCustomColorLink = q('.color-tile-edit-color');
		ListHighlightColorDialog.updateDemoListColor(ListHighlightColorDialog.getListColor(rule.highlighting.color));
		ListHighlightColorDialog.setupExceptions(rule.highlighting.exceptions);
		listen(qid('AddNewException'), 'click', ListHighlightColorDialog.addExceptionLiElement);
		ListHighlightColorDialog.setOpacityValue(rule.highlighting.opacity, true);
		listen(qid('Opacity'), 'input', function () {
			ListHighlightColorDialog.setOpacityValue(this.value);
		});
		ColorDialog.setup(rule.highlighting.color);
	}

	static setOpacityValue (value, updateInput = false) {
		if (updateInput) {
			qid('Opacity').value = value;
		}
		q('[name="opacity-value"]').textContent = Math.round(value * 100) + '%';
		q('.dummy-board_demo-list').style.opacity = value;
	}

	static setupExceptions (exceptions) {
		let exceptionsElement = q('.highlight-color-exceptions'),
			i = 0;
		for (let trelloBgColor in exceptions) {
			i++;
			q('.highlight-color-exception-section').open = true;
			exceptionsElement.appendChild(ListHighlightColorDialog.createExceptionLi(
				trelloBgColor,
				exceptions[trelloBgColor],
				true
			));
		}
		qid('AddNewException').disabled = (i > 9);
	}

	static createExceptionLi (trelloBgColor, highlightColor, noDropdown = false) {
		var li = getTemplate('ExceptionLiTemplate'),
			i = qq('.highlight-color-exceptions > li').length,
			deleteButton = q('.highlight-exception-delete', li);

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
						setBackgroundColor(selectedButton, highlightColor)
						q('.color-select-edit-custom-color-button-container', li).style.display = 'inline-block';
					}
					selectedButton.dataset.selected = "yes";
				}
				colorSelectElement.dataset.value = selectedButton.value;
				colorSelectElement.dataset.lastValidColor = selectedButton.value;
			}
			li.dataset.status = 'complete';
		} else {
			li.dataset.new = 'new';
			deleteButton.textContent = 'Delete immediately';
		}

		for (let colorSelect of qq('color-select', li)) {
			colorSelect.dataset.name = colorSelect.dataset.name.replace('[]', `[${i}]`);
		}

		var colorButton = q('.color-select-edit-custom-color-button', li);
		colorButton.dataset.for = colorButton.dataset.for.replace('[]', `[${i}]`);

		for (let colorSelectElement of qq('color-select', li)) {
			new LHCDColorSelect(colorSelectElement);
		}

		deleteButton.addEventListener('click', function () {
			let exceptionLi = this.closest('li');
			if (exceptionLi.dataset.status == 'empty' || exceptionLi.dataset.new == 'new') {
				exceptionLi.remove();
			} else {
				let buttons = qq('color-select button', exceptionLi),
					markedForDeletion = !(exceptionLi.classList.contains('mod-marked-for-deletion'));
				q('color-select', exceptionLi).dataset.disabled = markedForDeletion;
				exceptionLi.classList.toggle('mod-marked-for-deletion', markedForDeletion);
				for (let button of buttons) {
					button.disabled = markedForDeletion;
				}
				this.textContent = (markedForDeletion) ? 'Don’t delete' : 'Delete';
				this.classList.toggle('mod-delete', !markedForDeletion);
				q('.highlight-exceptions-marked-for-deletion').classList.toggle('invisible', !(q('.mod-marked-for-deletion')));
			}
		});

		return li;

	}

	static addExceptionLiElement () {
		const max = 10;
		let incompleteOrEmptyElement = q(
			'.highlight-color-exception-section li[data-status="incomplete"],' +
			'.highlight-color-exception-section li[data-status="empty"]'
		);
		if (incompleteOrEmptyElement) {
			incompleteOrEmptyElement.classList.remove('flash');
			setTimeout(() => {
				incompleteOrEmptyElement.classList.add('flash');
			}, 50);
		} else {
			let completeCount = qq('.highlight-color-exception-section li[data-status="complete"]').length;
			if (completeCount < max) {
				q('.highlight-color-exceptions').appendChild(ListHighlightColorDialog.createExceptionLi(null, null));
				qid('AddNewException').disabled = (++completeCount == max);
				ColorSelect.disableDropdownsAsAppropes();
				Dialogue.setupCheckForChanges();
			}
		}
	}

}
