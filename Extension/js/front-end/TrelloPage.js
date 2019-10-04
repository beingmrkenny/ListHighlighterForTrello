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

	static applyTrelloBackgroundClassNameToTrelloBody () {
		var body = getTrelloBody();
		if (body) {
			let trelloBg,
				background = (body.classList.contains('body-custom-board-background'))
					? 'photo'
					: body.style.backgroundColor;
			switch (background) {
				case 'rgb(0, 121, 191)'  : trelloBg = 'blue'; break;
				case 'rgb(210, 144, 52)' : trelloBg = 'orange'; break;
				case 'rgb(81, 152, 57)'  : trelloBg = 'green'; break;
				case 'rgb(176, 70, 50)'  : trelloBg = 'red'; break;
				case 'rgb(137, 96, 158)' : trelloBg = 'purple'; break;
				case 'rgb(205, 90, 145)' : trelloBg = 'pink'; break;
				case 'rgb(75, 191, 107)' : trelloBg = 'lime'; break;
				case 'rgb(0, 174, 204)'  : trelloBg = 'sky'; break;
				case 'rgb(131, 140, 145)': trelloBg = 'gray'; break;
				case 'photo'			 : trelloBg = 'photo'; break;
				// no default because WHY SHOULD ANY OF US RISK OUR LIVES FOR SUCH FILTH
			}
			for (let className of body.classList) {
				if (className.startsWith('bmko_trello-background-type_')) {
					body.classList.remove(className);
				}
			}
			body.classList.add(`bmko_trello-background-type_${trelloBg}`);
		}
	}

	static toggleUndimOnHover () {
		var body = getTrelloBody();
		if (body) {
			body.classList.toggle('bmko_undim-on-hover', Global.getItem('options-HighlightUndimOnHover'));
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

	static toggleListHighlighting (status) {
		var body = getTrelloBody();
		if (body) {
			body.classList.toggle('bmko_list-highlighter-toggled-off', !status);
			body.classList.toggle('bmko_list-highlighter-applied', status); // FIXME duplicated statuses?
			if (status) {
				HeaderTagging.removeAll(true);
				InsertedCSS.generateRules();
			} else {
				HeaderTagging.reapplyAll(true);
				InsertedCSS.removeRules();
			}
		}
	}

	static isHighlighted () {
		var body = getTrelloBody();
		if (body) {
			return !body.classList.contains('bmko_list-highlighter-toggled-off');
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
