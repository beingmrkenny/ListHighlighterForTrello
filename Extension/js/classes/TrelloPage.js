'use strict';

class TrelloPage {

	static isBoard() {
		var body = getTrelloBody();
		if (body) {
			return body.classList.contains('body-board-view');
		} else {
			return false;
		}
	}

	static isCustomBackground() {
		var body = getTrelloBody();
		if (body) {
			return body.classList.contains('body-custom-board-background');
		}
	}

	static getBoardBackground () {
		var body = getTrelloBody();
		if (body) {
			let color = body.style.backgroundColor;
			if (typeof color != 'string') {
				color = null;
			}
			return color;
		}
	}

	static isHighlighted () {
		var body = getTrelloBody();
		if (body) {
			return body.classList.contains('bmko_list-highlighter-applied');
		}
	}

	static getDetails () {
		return {
			isBoard: TrelloPage.isBoard(),
			backgroundColor: TrelloPage.getBoardBackground(),
			isCustomBackground: TrelloPage.isCustomBackground(),
			highlighted: TrelloPage.isHighlighted()
		}
	}

}
