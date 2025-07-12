'use strict';

class TrelloPage {
	static getBody() {
		return document.getElementById('trello-root');
	}

	static isBoard() {
		var body = TrelloPage.getBody();
		if (body) {
			return body.classList.contains('body-board-view');
		} else {
			return false;
		}
	}

	static isCustomBackground() {
		var body = TrelloPage.getBody();
		if (body) {
			return body.classList.contains('body-custom-board-background');
		}
	}

	static toggleUndimOnHover() {
		var body = TrelloPage.getBody();
		if (body) {
			body.classList.toggle(
				'bmko_undim-on-hover',
				Global.getItem('options-HighlightUndimOnHover')
			);
		}
	}

	static getBoardBackground() {
		var body = TrelloPage.getBody();
		if (body) {
			let color = body.style.backgroundColor;
			if (typeof color != 'string') {
				color = null;
			}
			return color;
		}
	}

	static toggleListHighlighting(status) {
		var body = TrelloPage.getBody();
		if (body) {
			body.classList.toggle('bmko_list-highlighter-toggled-off', !status);
			body.classList.toggle('bmko_list-highlighter-applied', status); // FIXME duplicated statuses?
			if (status) {
				InsertedCSS.generateRules();
			} else {
				InsertedCSS.removeRules();
			}
		}
	}

	static isHighlighted() {
		var body = TrelloPage.getBody();
		if (body) {
			return !body.classList.contains('bmko_list-highlighter-toggled-off');
		}
	}

	static getDetails() {
		return {
			isBoard: TrelloPage.isBoard(),
			backgroundColor: TrelloPage.getBoardBackground(),
			isCustomBackground: TrelloPage.isCustomBackground(),
			highlighted: TrelloPage.isHighlighted(),
		};
	}

	static getTrellement(className, context = document, domTreeDirection) {
		if (!context.querySelector || !context.closest) {
			return;
		}

		let trellement;

		if (className == 'lists') {
			trellement = qid('board');
			if (trellement) {
				return trellement;
			}
		}

		trellement =
			domTreeDirection == UP
				? context.closest(`.${className}`)
				: context.querySelector(`.${className}`);
		if (trellement) {
			return trellement;
		}

		const obfuscatedSelector =
			TrelloPage.getSelectorFromPlain(className);
		if (obfuscatedSelector) {
			trellement =
				domTreeDirection == UP
					? context.closest(`${obfuscatedSelector}`)
					: context.querySelector(`${obfuscatedSelector}`);
			if (trellement) {
				return trellement;
			}
		}

		trellement =
			domTreeDirection == UP
				? context.closest(`[data-testid="${className}"]`)
				: context.querySelector(`[data-testid="${className}"]`);
		if (trellement) {
			return trellement;
		}
	}

	static getTrellements(className, context = document) {
		let trellements;

		const obfuscatedSelector =
			TrelloPage.getSelectorFromPlain(className);

		if (obfuscatedSelector) {
			trellements = context.querySelectorAll(`${obfuscatedSelector}`);
			if (trellements) {
				return trellements;
			}
		}

		trellements = context.querySelectorAll(`[data-testid="${className}"]`);
		if (trellements) {
			return trellements;
		}
	}

	static getObfuscatedClassNameFromPlain(className) {
		let obfuscated;
		switch (className) {
			case 'lists':
				// ol#board, contains all the li.list-wrapper
				// obfuscated = 'KduRxx1lW4ExLH';
				// zj2JnDaAFGfZcN _3zcUgV3VaWFBs4
				break;

			case 'list-wrapper':
				// <li> element, parent for each list
				// obfuscated = 'bi0h3HALKXjfDq';
				obfuscated = 'Iq1byT5o1KoAi6';
				break;
			case 'list':
				// <div>, first child of .list-wrapper
				// obfuscated = 'Sb_QqNKeadm2oq';
				obfuscated = 'cYogZfEaHc9LfO';
				break;

			case 'list-header':
				// <div> element, the parent for the list header
				// obfuscated = 'bPNGI_VbtbXQ8v';
				obfuscated = 'aqP9FqumyLvTg5';
				break;
			case 'list-name':
				// <h2> element, button > span > "list header text"
				obfuscated = 'b4Keujk7X4O23A';
				break;
			case 'list-edit-menu-button':
				// <button> in the top right corner of each list, content ultimately is an ellipsis
				// bfVCcMmB0Iiute ybVBgfOiuWZJtD mUpWqmjL4CZBvn Yt_v_LmarJM9ZS _St8_YSRMkLv07
				// obfuscated = 'bxgKMAm3lq5BpA';
				break;

			case 'list-cards':
				// <ol> element which contains the cards
				// B27wN5INCjrQTV LcFnJFfQdwDOsP
				// obfuscated = 'RD2CmKQFZKidd6';
				break;

			case 'list-card':
				// <li> element which ultimately contains the card
				// obfuscated = 'T9JQSaXUsHTEzk';
				obfuscated = 'csCxU7M5teCNNl';
				break;
			case 'card-name':
				// <a> element which contains the card text
				// obfuscated = 'NdQKKfeqJDDdX3';
				obfuscated = 'Ns0Sj0nEGMQ7un';
				break;

			case 'list-card-drop-preview':
				// TBD
				// obfuscated = 's84vHdvXUJLQdS';
				break;
			case 'quick-card-editor-button':
				// The edit <button> that appears when you hover over the card
				// Y6PO3DDdkP2fnA ybVBgfOiuWZJtD Yt_v_LmarJM9ZS _St8_YSRMkLv07
				// obfuscated = 'o0opcYgoysGMA4';
				break;
		}
		return obfuscated;
	}

	static getSelectorFromPlain(className) {
		return `[data-testid="${className}"]`;
	}
}
