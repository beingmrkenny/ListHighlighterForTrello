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
			case 'card-name':
				obfuscated = 'NdQKKfeqJDDdX3';
				break;
			case 'list-card-drop-preview':
				obfuscated = 's84vHdvXUJLQdS';
				break;
			case 'list-card':
				obfuscated = 'T9JQSaXUsHTEzk';
				break;
			case 'list-cards':
				obfuscated = 'RD2CmKQFZKidd6';
				break;
			case 'list-edit-menu-button':
				obfuscated = 'bxgKMAm3lq5BpA';
				break;
			case 'list-header':
				obfuscated = 'bPNGI_VbtbXQ8v';
				break;
			case 'list-name':
				obfuscated = 'KLvU2mDGTQrsWG';
				break;
			case 'list-wrapper':
				obfuscated = 'bi0h3HALKXjfDq';
				break;
			case 'list':
				obfuscated = 'Sb_QqNKeadm2oq';
				break;
			case 'lists':
				// ol#board
				obfuscated = 'KduRxx1lW4ExLH';
				break;
			case 'quick-card-editor-button':
				obfuscated = 'o0opcYgoysGMA4';
				break;
		}
		return obfuscated;
	}

	static getSelectorFromPlain(className) {
		return `[data-testid="${className}"]`;
	}
}
