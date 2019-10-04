// LHCD = ListHighlightColorDialog
class LHCDColorSelect extends ColorSelect {

	constructor (colorSelectElement) {
		super(colorSelectElement);
		listen( qq('button', colorSelectElement), 'click', LHCDColorSelect.buttonClickHandler);
	}

	static buttonClickHandler () {
		let div = this.closest('div');
		LHCDColorSelect.changeHighlightColor(q('[data-type="highlight-color"] [data-selected]', div));
		LHCDColorSelect.changeTrelloBG(q('[data-type="trello-background"] [data-selected]', div));
		LHCDColorSelect.checkExceptionAndToggleEmpty(this);
	}

	static closeListener (event) {
		if (!event.target.closest('color-select') && event.target.tagName != 'BUTTON') {
			let lhcd = qid('ListHighlightColorDialog');
			if (lhcd) {
				lhcd.removeEventListener('click', ColorSelect.closeListener);
			}
			ColorSelect.closeAll(); // TODO this belongs in super
		}
	}

	static checkExceptionAndToggleEmpty (select) {
		var exception = select.closest('.highlight-color-exceptions > li');
		var numberOfSelectedBlank = 0;
		for (let selected of qq('[data-selected]', exception)) {
			if (/fill-(?:trello-)?blank/.test(selected.className)) {
				numberOfSelectedBlank++;
			}
		}
		if (numberOfSelectedBlank == 2 && exception == q('.highlight-color-exceptions').lastElementChild) {
			exception.dataset.status = 'empty';
		}
		if (numberOfSelectedBlank == 1) {
			exception.dataset.status = 'incomplete';
		}
		if (numberOfSelectedBlank == 0) {
			exception.dataset.status = 'complete';
		}
	}

	static closeAll() {
		super.closeAll();
	}

	static changeTrelloBG (button) {
		let buttonClass = ovalue(button.className.match(/(fill-trello-[a-z]+)/), 0);
		if (buttonClass != 'fill-trello-blank') {
			let board = q('.dummy-board');
			board.classList.remove(ovalue(board.className.match(/(fill-trello-[a-z]+)/), 0));
			board.classList.add(ovalue(button.className.match(/(fill-trello-[a-z]+)/), 0));
		}
	}

	static changeHighlightColor (button) {
		let buttonClass = ovalue(button.className.match(/(fill-[a-z]+)/), 0);
		if (buttonClass == 'fill-blank') {
			buttonClass = 'fill-normal';
		}
		let list = q('.dummy-board_demo-list');
		list.classList.remove(
			ovalue(list.className.match(/(fill-[a-z]+)/), 0));
		if (buttonClass == 'fill-custom') {
			let color = new Color(button.value);
			list.style.backgroundColor = button.value;
			list.classList.toggle('mod-light-background', color.isLight());
		} else {
			list.style.backgroundColor = '';
			list.classList.add(buttonClass);
			list.classList.toggle('mod-light-background', button.classList.contains('mod-light-background'));
		}
	}

}
