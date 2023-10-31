// LHCD = ListHighlightColorDialog
class LHCDColorSelect extends ColorSelect {
	constructor(colorSelectElement) {
		super(colorSelectElement);
		listen(
			qq('button', colorSelectElement),
			'click',
			LHCDColorSelect.buttonClickHandler
		);
	}

	static buttonClickHandler() {
		let div = this.closest('div');
		LHCDColorSelect.changeHighlightColor(
			q('[data-type="highlight-color"] [data-selected]', div)
		);
		LHCDColorSelect.changeTrelloBG(
			q('[data-type="trello-background"] [data-selected]', div)
		);
	}

	static closeListener(event) {
		if (
			!event.target.closest('color-select') &&
			event.target.tagName != 'BUTTON'
		) {
			let lhcd = qid('ListHighlightColorDialog');
			if (lhcd) {
				lhcd.removeEventListener('click', ColorSelect.closeListener);
			}
			ColorSelect.closeAll(); // TODO this belongs in super
		}
	}

	static closeAll() {
		super.closeAll();
	}

	static changeTrelloBG(button) {
		let buttonClass = getFirstRegexMatch(
			button.className.match(/(fill-trello-[a-z]+)/)
		);
		if (buttonClass != 'fill-trello-blank') {
			let board = q('.dummy-board');
			board.classList.remove(
				getFirstRegexMatch(board.className.match(/(fill-trello-[a-z]+)/))
			);
			board.classList.add(
				getFirstRegexMatch(button.className.match(/(fill-trello-[a-z]+)/))
			);
		}
	}

	static changeHighlightColor(button) {
		let buttonClass = getFirstRegexMatch(
			button.className.match(/(fill-[a-z]+)/)
		);
		if (buttonClass == 'fill-blank') {
			buttonClass = 'fill-normal';
		}
		let list = q('.dummy-board_demo-list');
		list.classList.remove(
			getFirstRegexMatch(list.className.match(/(fill-[a-z]+)/))
		);
		if (buttonClass == 'fill-custom') {
			setBackgroundColor(list, button.value);
		} else {
			list.classList.add(buttonClass);
			list.classList.toggle(
				'mod-light-background',
				button.classList.contains('mod-light-background')
			);
		}
	}
}
