'use strict';

const HeaderStripRegex = /^(?:[/-]{2,}|#+\s)(.+?)(?:\s*[#/-]+)?$/;
const RuleRegex = /^(?:==+|--|__)$/;
const HeaderRegex = /^(?:[/-]{2,}|#+\s)[^#/-].*/;
const AppliedClass = 'bmko_header-card-applied';
const HeaderClass = 'bmko_header-card';
const RuleClass = 'bmko_horizontal-rule-card';

class HeaderSeparatorCard {

	constructor (card) {
		this.card = card;
	}

	static processListCardTitle () {
		if (arguments[0] && arguments[0][0] && arguments[0][0] instanceof MutationRecord) {
			let card = new HeaderSeparatorCard(arguments[0][0].target.closest('.list-card'));
			card.process();
		}
	}

	static processCards (cards) {

		if (cards instanceof HTMLElement) {
			cards = [cards];
		}

		if (Array.isArray(cards) || cards instanceof NodeList) {
			for (let card of cards) {
				card = new HeaderSeparatorCard(card);
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

		if (Global.getItem('options-CountHideManualCardPoints') && countString != '1') {

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

		if (Global.getItem('options-OrganisingEnableHeaderCards') && this.shouldBeHeader()) {
			this.makeHeader();
		} else {
			this.unmakeHeader();
		}

		if (Global.getItem('options-OrganisingEnableSeparatorCards') && this.shouldBeRule()) {
			this.makeRule();
		} else {
			this.unmakeRule();
		}

		if (Global.getItem('options-CountEnableWIP')) {
			ListWorkPoints.updateLists(this.card.closest('.list'));
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
		return HeaderRegex.test(this.getTitle());
	}

	isHeader () {
		return this.card.classList.contains(HeaderClass);
	}

	makeHeader () {
		this.card.classList.add(AppliedClass);
		this.card.classList.add(HeaderClass);
		let listCardTitle = this.card.querySelector('.list-card-title');
		if (listCardTitle.parentNode.parentNode) {
			let matches = listCardTitle.lastChild.textContent.match(HeaderStripRegex),
				title = matches[1],
				h3 = this.card.querySelector('h3') || document.createElement('h3');
			h3.textContent = title.trim();
			// HACK: the whole of .list-card-details is replaced, so the original one with the new h3 no longer
			// exists. This timeout hack solves the problem by finding it anew: an observer might be the better way
			// to do this, but goodt lordt, a lot of faff
			setTimeout(function (card, h3) {
				if (!card.querySelector('h3')) {
					card.querySelector('.list-card-details').prepend(h3);
				}
			}, 200, this.card, h3);
		}
	}

	unmakeHeader () {
		this.card.classList.remove(HeaderClass);
		this.clearApplied();
		let h3 = this.card.querySelector('h3');
		if (h3) {
			h3.remove();
		}
	}

	shouldBeRule () {
		return RuleRegex.test(this.getTitle());
	}

	isRule () {
		return this.card.classList.contains(RuleClass);
	}

	makeRule () {
		this.card.classList.add(AppliedClass);
		this.card.classList.add(RuleClass);
		if (!this.card.querySelector('hr')) {
			let hr = document.createElement('hr');
			this.card.appendChild(hr);
		}
	}

	unmakeRule () {
		this.card.classList.remove(RuleClass);
		this.clearApplied();
		let hr = this.card.querySelector('hr');
		if (hr) {
			hr.remove();
		}
	}

	clearApplied () {
		if (!this.isHeader() && !this.isRule()) {
			this.card.classList.remove(AppliedClass);
		}
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

}
