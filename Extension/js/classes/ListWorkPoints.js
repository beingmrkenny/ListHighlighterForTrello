
class ListWorkPoints {

	constructor (list) {
		this.list = list; // NOTE this is .list
	}

	static toggleWIP () {

		var lists = document.querySelectorAll('.list');

		for (let list of lists) {
			let listWorkPoints = new ListWorkPoints(list);
			if (GLOBAL.EnableWIP) {
				listWorkPoints.update();
			} else {
				listWorkPoints.removeAccoutrements();
			}
		}

	}

	static updateLists (lists) {
		if (!lists) {
			lists = document.querySelectorAll('.list');
		} else if (lists instanceof HTMLElement) {
			lists = [lists];
		}
		for (let list of lists) {
			let listWorkPoints = new ListWorkPoints(list);
			listWorkPoints.update();
		}
	}

	static getCardPoints(card) {
		var cardTitle = card.querySelector('.list-card-title');
		if (cardTitle) {
			let title = cardTitle.textContent || '',
				matches = title.match(/\[([0-9]+)\]/);
			if (matches && matches[1]) {
				return parseInt(matches[1]);
			} else {
				return 1;
			}
		}
	}

	getLimitFromTitle () {
		var title = this.list.querySelector('.list-header-name-assist').textContent,
			matches = title.match(/\[([0-9]+)\]/);

		if (matches && matches[1]) {
			return matches[1];
		}
	}

	update () {

		var listLimit = this.getLimitFromTitle();

		if (listLimit) {
			this.list.classList.add('bmko_list-has-limit');
		} else {
			this.list.classList.remove('bmko_list-has-limit');
		}

		this.list.classList.remove('bmko_refuse-new-cards');

		if (listLimit && listLimit !== 0) {
			let cardCount = this.getCardCount();
			listLimit = parseInt(listLimit);
			this.updateCountAndLimit(cardCount, listLimit);
			if (GLOBAL.RefuseNewCards) {
				this.updateRefuseCardStatus(cardCount, listLimit);
			} else {
				this.list.querySelector('.list-cards').classList.add('js-sortable', 'ui-sortable');
				this.list.querySelector('.open-card-composer').classList.remove('hide');
			}
		} else {
			setTimeout(function (self) {
				self.removeAccoutrements();
			}, 0, this);
		}

	}

	getCardCount() {
		let cards = this.list.querySelectorAll('.list-card:not(.bmko_header-card-applied):not(.placeholder)'),
			cardCount = 0;

		if (GLOBAL.IgnorePointsOnCards) {
			cardCount = cards.length;
		} else {
			for (let card of cards) {
				let cardPoints = parseInt(ListWorkPoints.getCardPoints(card)) || 1;
				cardCount += cardPoints;
			}
		}

		return cardCount;
	}

	removeAccoutrements () {
		var notice = this.list.querySelector('.bmko_list-limit-notice');
		if (notice) {
			notice.remove();
		}
		this.list.classList.remove('bmko_list-full', 'bmko_list-over', 'bmko_list-has-limit');
	}

	updateCountAndLimit (cardCount, listLimit) {

		var notice = this.list.querySelector('.bmko_list-limit-notice'),
			className, over, span = document.createElement('span'), toggleButton;

		if (!notice) {
			notice = document.createElement('div');
			notice.classList.add('bmko_list-limit-notice');
			let listHeader = this.list.querySelector('.list-header'),
				numCards = listHeader.querySelector('.list-header-num-cards');
			this.list.insertBefore(notice, this.list.querySelector('.list-cards'));
		}

		notice.textContent = `${cardCount} / ${listLimit}`;

		if (cardCount > listLimit) {
			over = cardCount - listLimit;
			className = 'bmko_list-over';
			toggleButton = true;
		} else if (cardCount == listLimit) {
			toggleButton = true;
			className = 'bmko_list-full';
		} else if (cardCount < listLimit) {
			className = 'bmko_list-under';
			toggleButton = false;
		}

		this.toggleAddCardButton(toggleButton);

		if (typeof over == 'number') {
			notice.textContent = `${over} over ・ ${notice.textContent}`;
		}

		this.list.classList.remove('bmko_list-under', 'bmko_list-full', 'bmko_list-over');
		this.list.classList.add(className);
	}

	toggleAddCardButton(toggle) {
		if (GLOBAL.RefuseNewCards) {
			this.list.querySelector('.open-card-composer').classList.toggle('hide', toggle);
		}
	}

	updateRefuseCardStatus (cardCount, listLimit) {
		var toggle;
		if (cardCount >= listLimit) {
			toggle = true;
		} else if (cardCount < listLimit) {
			toggle = false;
		}
		this.toggleAddCardButton(toggle);
	}

	toggleOriginalList() {

		var toggle = (typeof arguments[0] == 'boolean')
			? arguments[0]
			: this.isOriginalList();

		if (toggle) {
			this.list.dataset.bmkoOriginalList = 'yes';
		} else {
			this.list.removeAttribute('data-bmko-original-list');
		}

	}

	isOriginalList() {
		if (this.list.dataset.bmkoOriginalList) {
			return true;
		} else {
			return false;
		}
	}

	toggleRefuseWhileDragging (draggedCard) {

		if (this.isOriginalList() || draggedCard.classList.contains('bmko_header-card-applied')) {

			this.toggleAddCardButton(false);
			this.list.classList.remove('bmko_refuse-new-cards');

		} else {

			if ((ListWorkPoints.getCardPoints(draggedCard) + this.getCardCount()) > this.getLimitFromTitle()) {

				self.toggleAddCardButton(true);
				self.list.classList.add('bmko_refuse-new-cards');
				let placeholder = self.list.querySelector('.placeholder');
				if (placeholder) {
					// placeholder.remove();
					getListTitle($('[data-bmko-original-list]'));
					$('[data-bmko-original-list]').querySelector('.list-cards').appendChild(placeholder);
				}

			} else {

				this.toggleAddCardButton(false);
				this.list.classList.remove('bmko_refuse-new-cards');

			}

		}

	}

	toggleWouldBeOverWhileDragging (draggedCard) {

		if (this.isOriginalList() || draggedCard.classList.contains('bmko_header-card-applied')) {

			this.list.classList.remove('bmko_list-would-be-over');

		} else {

			let limit = this.getLimitFromTitle();
			this.list.classList.toggle(
				'bmko_list-would-be-over',
				(typeof limit != 'undefined' && (ListWorkPoints.getCardPoints(draggedCard) + this.getCardCount()) > limit)
			);

		}

	}

}
