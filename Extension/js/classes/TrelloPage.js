'use strict';

class TrelloPage {

	static isBoard() {
		return document.body.classList.contains('body-board-view');
	}

	static getBoardBackground () {
		var color = document.body.style.backgroundColor;
		if (typeof color != 'string') {
			color = null;
		}
		return color;
	}

	static isHighlighted () {
		return document.body.classList.contains('bmko_list-highlighter-applied');
	}

	static getDetails () {
		return {
			isBoard: TrelloPage.isBoard(),
			backgroundColor: TrelloPage.getBoardBackground(),
			highlighted: TrelloPage.isHighlighted()
		}
	}

}
