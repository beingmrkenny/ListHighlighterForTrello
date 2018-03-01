'use strict';

class Card {

	constructor (card) {
		this.card = card;
		this.appliedClass = 'bmko_header-card-applied';
		this.headerClass = 'bmko_header-card';
		this.ruleClass = 'bmko_horizontal-rule-card';
	}

	static processListCardTitle () {
		if (arguments[0] && arguments[0][0] && arguments[0][0] instanceof MutationRecord) {
			let card = new Card(arguments[0][0].target.closest('.list-card'));
			card.process();
		}
	}

	static processCards (cards) {

		if (cards instanceof HTMLElement) {
			cards = [cards];
		}

		if (Array.isArray(cards) || cards instanceof NodeList) {
			for (let card of cards) {
				card = new Card(card);
				card.process();
			}
		}

	}

	updatePointsBadge (points) {

		let remove = false,
			badge = this.card.querySelector('.bmko_card-count-badge');

		if (typeof points == 'number' && points != 1) {

			if (badge) {
				badge.textContent = '× '+points;
			} else {
				badge = document.createElement('span');
				badge.classList.add('bmko_card-count-badge');
				badge.textContent = '× '+points;
				this.card.querySelector('.js-custom-field-badges').appendChild(badge);
			}

		} else {

			remove = true;

		}

		if (remove && badge) {
			badge.remove();
		}

	}

	showPointsTag () {
		var bmkoHide = this.card.querySelector('.bmko_hide');
		if (bmkoHide) {
			bmkoHide.replaceWith(document.createTextNode(bmkoHide.textContent));
		}
	}

	hidePointsTag (countString) {

		if (GLOBAL.HideManualCardPoints && countString != '1') {

			var title = this.card.querySelector('.list-card-title'),
				tag = `[${countString}]`, found = false, node, nodeText, parentNode;

			for (let i = 0, x = title.childNodes.length; i<x; i++) {
				if (title.childNodes[i].nodeType == Node.TEXT_NODE && title.childNodes[i].textContent.includes(tag)) {
					found = true;
					node = title.childNodes[i];
					nodeText = node.textContent;
					parentNode = node.parentNode;
					break;
				}
			}

			if (found) {

				var splits = nodeText.split(tag),
					firstTextNode = document.createTextNode(''),
					hiddenTagNode = document.createElement('span'),
					remainingNode = document.createTextNode('');

				hiddenTagNode.classList.add('bmko_hide');
				hiddenTagNode.textContent = tag;

				for (let i in splits) {
					if (i == 0) {
						firstTextNode.textContent = splits[i];
					} else if (i == 1) {
						remainingNode.textContent += splits[i];
					} else {
						remainingNode.textContent += `${tag}${splits[i]}`;
					}
				}

				parentNode.insertBefore(hiddenTagNode, node);
				parentNode.insertBefore(firstTextNode, hiddenTagNode);
				if (remainingNode.textContent.length > 0) {
					parentNode.insertBefore(remainingNode, node);
				}
				node.remove();

			}

		}

	}

	process () {

		if (GLOBAL.EnableHeaderCards && this.shouldBeHeader()) {
			this.makeHeader();
		} else {
			this.unmakeHeader();
		}

		if (GLOBAL.EnableSeparatorCards && this.shouldBeRule()) {
			this.makeRule();
		} else {
			this.unmakeRule();
		}

		if (GLOBAL.EnableWIP) {
			let listWorkPoints = new ListWorkPoints(this.card.closest('.list'));
		}

	}

	isListCard () {
		return (
			this.card.classList.contains('list-card') &&
			!this.card.classList.contains('placeholder') &&
			!this.card.classList.contains('js-composer')
		);
	}

	getTitle () {
		return (this.isListCard())
			? this.card.querySelector('.list-card-title').lastChild.textContent.trim()
			: '';
	}

	shouldBeHeader () {
		var title = this.getTitle();
		var regex = this.getHeaderRegex();
		return regex.test(title);
	}

	isHeader () {
		return this.card.classList.contains(this.headerClass);
	}

	makeHeader () {
		this.apply();
		this.card.classList.add(this.headerClass);
		var listCardTitle = this.card.querySelector('.list-card-title');
		if (listCardTitle.parentNode.parentNode) {
			let re = this.getHeaderStripRegex();
			let matches = listCardTitle.lastChild.textContent.match(re);
			let title = matches[1];
			let h3 = this.card.querySelector('h3') || document.createElement('h3');
			h3.textContent = title;
			if (!this.card.querySelector('h3')) {
				let listCardDetails = listCardTitle.parentNode;
				listCardDetails.insertBefore(h3, listCardDetails.firstElementChild);
			}
		}
	}

	unmakeHeader () {
		this.card.classList.remove(this.headerClass);
		this.clearApplied();
		let h3 = this.card.querySelector('h3');
		if (h3) {
			h3.remove();
		}
	}

	shouldBeRule () {
		var title = this.getTitle();
		var regex = this.getRuleRegex();
		return regex.test(title);
	}

	isRule () {
		return this.card.classList.contains(this.ruleClass);
	}

	makeRule () {
		this.apply();
		this.card.classList.add(this.ruleClass);
		if (!this.card.querySelector('hr')) {
			let hr = document.createElement('hr');
			this.card.appendChild(hr);
		}
	}

	unmakeRule () {
		this.card.classList.remove(this.ruleClass);
		this.clearApplied();
		let hr = this.card.querySelector('hr');
		if (hr) {
			hr.remove();
		}
	}

	clearApplied () {
		if (!this.isHeader() && !this.isRule()) {
			this.card.classList.remove(this.appliedClass);
		}
	}

	apply () {
		this.card.classList.add(this.appliedClass);
	}

	disableStickers () {
		if (this.card.classList.contains('is-stickered')) {
			this.card.classList.remove('is-stickered');
			this.card.classList.add('bmko_is-not-stickered');
		}
	}

	reenableStickers () {
		if (this.card.classList.contains('bmko_is-not-stickered')) {
			this.card.classList.add('is-stickered');
			this.card.classList.remove('bmko_is-not-stickered');
		}
	}

	getHeaderStripRegex() {
		// var originalRe = /^[^\p{L}\d\s]{3,}\s*/u;
		var re = /^(?:[/-]{2,}|#+\s)(.+?)(?:\s*[#/-]+)?$/;
		return re;
	}

	getRuleRegex () {
		// var originalRe = /^[^\p{L}\d\s]{3,}$/u;
		var re = /^[=_-]{2,}$/;
		return re;
	}

	getHeaderRegex () {
		// var originalRe = /^[^\p{L}\d\s]{3,}.+$/u;
		// There's this too but it might be overkill
		// var re = /^(?:\/\/+[^/].*|--+[^-].*|#+ [^#].*)/;
		var re = /^(?:[/-]{2,}|#+\s)[^#/-].*/;
		return re;
	}

}
