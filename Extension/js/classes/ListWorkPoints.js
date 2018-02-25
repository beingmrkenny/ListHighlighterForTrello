
class ListWorkPoints {

	constructor (list) {
		this.list = list; // NOTE this is .list
		this.cardSelector = '.list-card:not(.bmko_header-card-applied):not(.placeholder):not(.js-composer)';
	}

	static toggleWIP () {
		if (GLOBAL.EnableWIP) {
			ListWorkPoints.updateLists();
		} else {
			for (let list of document.querySelectorAll('.list')) {
				let listWorkPoints = new ListWorkPoints(list);
				listWorkPoints.removeAccoutrements();
			}
		}
	}

	static updateLists (lists) {

		ListWorkPoints.handlePointsOnCards();

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
				let count = parseInt(matches[1]);
				return count;
			}
		}
	}

	static editLimit (event) {

		var target    = this,
			list      = this.closest('.list'),
			cardCount = list.querySelector('.card-count'),
			rect;

		if (list.classList.contains('bmko_list-over')) {
			rect = list.querySelector('.bmko_list-limit-notice').getBoundingClientRect();
		} else {
			let box = cardCount.getBoundingClientRect();
			rect = {
				left   : box.left - 10,
				right  : box.right + 10,
				top    : box.top - 10,
				bottom : box.bottom + 10
			};
		}

		if (
			(event.clientX >= rect.left && event.clientX <= rect.right)
			&& (event.clientY >= rect.top && event.clientY <= rect.bottom)
		) {

			let matches = list.querySelector('h2').textContent.match(/(#count)|\[([0-9]+)\]/);
			if (matches) {
				let tag,
					start;
				if (matches[1]) {
					tag = matches[1];
					start = matches.index;
				} else if (matches[2]) {
					tag = matches[2];
					start = matches.index + 1;
				}
				setTimeout(function () {
					list.querySelector('textarea').setSelectionRange(start, start + tag.length);
				}, 50);
			}
		}

	}

	getLimitFromTitle () {

		var title = this.list.querySelector('.list-header-name-assist').textContent.toLowerCase(),
			matches = title.match(/(#count)|\[([0-9]+)\]/),
			ret;

		if (matches && matches[0]) {
			if (matches[1] && matches[1] == '#count') {
				ret = '#count';
			} else if (matches[2]) {
				ret = parseInt(matches[2]);
			}
		}

		return ret;
	}

	update () {

		var remove = false;

		if (GLOBAL.EnableWIP) {

			let listLimit = this.getLimitFromTitle(),
				cardCount = this.getCardCount();

			if (listLimit) {
				this.list.classList.add('bmko_list-has-limit');
			} else {
				this.list.classList.remove('bmko_list-has-limit');
			}

			this.updateCountAndLimit(cardCount, listLimit);

			if (!GLOBAL.CountAllCards && typeof listLimit == 'undefined') {
				remove = true;
			}

		} else {

			remove = true;

		}

		if (remove) {
			setTimeout(function (self) {
				self.removeAccoutrements();
			}, 0, this);
		}

	}

	getCardCount() {

		let cards = this.list.querySelectorAll(this.cardSelector),
			cardCount = 0;

		if (GLOBAL.EnablePointsOnCards) {
			for (let card of cards) {
				let cardPoints = ListWorkPoints.getCardPoints(card);
				if (typeof cardPoints != 'number') {
					cardPoints = 1;
				}
				cardCount += cardPoints;
			}
		} else {
			cardCount = cards.length;
		}

		return cardCount;
	}

	removeAccoutrements () {
		var notice = this.list.querySelector('.bmko_list-limit-notice');
		if (notice) {
			notice.remove();
		}
		this.removeCardBadges();
		for (let cardElement of $$(this.cardSelector, this.list)) {
			let card = new Card(cardElement);
			card.showPointsTag();
			card.updatePointsBadge(null);
		}
		this.list.classList.remove('bmko_list-full', 'bmko_list-over', 'bmko_list-has-limit');
		this.list.querySelector('.list-header-target').removeEventListener('click', ListWorkPoints.editLimit);
	}

	static handlePointsOnCards () {

		// FIXME be nice to have this enormous selector available in one place
		for (let cardElement of $$('.list-card:not(.bmko_header-card-applied):not(.placeholder):not(.js-composer)')) {
			let card = new Card(cardElement);
			if (GLOBAL.EnablePointsOnCards && !card.isHeader() && !card.isRule()) {
				let cardPoints = ListWorkPoints.getCardPoints(cardElement);
				if (typeof cardPoints == 'number') {
					card.hidePointsTag(cardPoints.toString());
					card.updatePointsBadge(cardPoints);
				}
			} else {
				if (cardElement.querySelector('bmko_hide')) {
					card.showPointsTag();
				}
				card.updatePointsBadge(null);
			}
		}

	}

	removeCardBadges () {
		for (let badge of this.list.querySelectorAll('.bmko_card-count-badge')) {
			badge.remove();
		}
	}

	updateCountAndLimit (cardCount, listLimit) {

		if (typeof listLimit != 'undefined' || GLOBAL.CountAllCards) {

			var className, over, noticeText,
				notice = this.list.querySelector('.bmko_list-limit-notice'),
				listHeader = this.list.querySelector('.list-header');

			if (!notice) {
				notice = document.createElement('div');
				notice.classList.add('bmko_list-limit-notice');
				listHeader.querySelector('.list-header-target').addEventListener('click', ListWorkPoints.editLimit);
				listHeader.appendChild(notice);
			}

			if (typeof listLimit == 'number' && cardCount > listLimit) {
				over = cardCount - listLimit;
			}

			var cards = (cardCount == 1) ? 'card' : 'cards',
				cardCountString = `${cardCount} ${cards}`;

			if (listLimit === '#count' || (GLOBAL.CountAllCards && typeof listLimit == 'undefined')) {

				noticeText = cardCountString;
				notice.classList.add('card-count-only');

			} else {

				noticeText = `${cardCountString} / ${listLimit}`;
				notice.classList.remove('card-count-only');

				if (cardCount > listLimit) {
					className = 'bmko_list-over';
				} else if (cardCount == listLimit) {
					className = 'bmko_list-full';
				} else if (cardCount < listLimit) {
					className = 'bmko_list-under';
				}

			}

			let strong = notice.querySelector('strong');

			if (typeof over == 'number') {

				let refresh = (strong),
					overText = `${over} over`;

				if (!refresh || overText != strong.textContent) {

					notice.textContent = '';

					strong = document.createElement('strong');
					strong.textContent = overText;

					if (refresh) {
						strong.classList.add('updated');
					}

					notice.appendChild(strong);

				}

			} else if (strong) {

				strong.remove();

			}

			let span = notice.querySelector('.card-count');
			if (!span) {
				span = document.createElement('span');
				span.classList.add('card-count');
				notice.appendChild(span);
			}
			span.textContent = noticeText;

			this.list.classList.remove('bmko_list-under', 'bmko_list-full', 'bmko_list-over');
			if (className) {
				this.list.classList.add(className);
			}

		}

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

	toggleWouldBeOverWhileDragging (draggedCard) {

		if (this.isOriginalList() || draggedCard.classList.contains('bmko_header-card-applied')) {

			this.list.classList.remove('bmko_list-would-be-over');

		} else {

			let limit = this.getLimitFromTitle();
			let cardPoints = ListWorkPoints.getCardPoints(draggedCard);
			if (typeof cardPoints != 'number') {
				cardPoints = 1;
			}
			this.list.classList.toggle(
				'bmko_list-would-be-over',
				(typeof limit != 'undefined' && (cardPoints + this.getCardCount()) > limit)
			);

		}

	}

}
