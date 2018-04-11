'use strict';

const HIGH   = 'high';
const NORMAL = 'normal';
const LOW    = 'low';
const IGNORE = 'ignore';
const TRASH  = 'trash';
const UNTAGGED  = 'untagged';

class ListHighlighter {

	static getListTypeFromHeader (header) {

		let listTitle = header.textContent.toLowerCase();

		if (GLOBAL.EnableWIP) {
			listTitle = listTitle.replace(/\s*\[[0-9]+\]\s*/, ' ');
		}

		listTitle = listTitle.trim();

		if (
			GLOBAL.HighlightTags && (listTitle.includes('{low}') || /#low(?:\s|$)/.test(listTitle))
		) {
			return LOW;
		}

		else if (
			(GLOBAL.HighlightTitles && !GLOBAL.MatchTitleSubstrings && (listTitle == 'todo' || listTitle == 'to do')) ||
			(GLOBAL.HighlightTitles && GLOBAL.MatchTitleSubstrings  && /(?:^|[^#\S])to ?do\b/.test(listTitle)) ||
			(GLOBAL.HighlightTags   && (/\{(?:normal|to ?do)\}/.test(listTitle) || /#(?:normal|to ?do)\b/.test(listTitle)))
		) {
			return NORMAL;
		}

		else if (
			(GLOBAL.HighlightTitles && !GLOBAL.MatchTitleSubstrings && (listTitle == 'today' || listTitle == 'doing')) ||
			(GLOBAL.HighlightTitles && GLOBAL.MatchTitleSubstrings  && /(?:^|[^#\S])(?:today|doing)\b/.test(listTitle)) ||
			(GLOBAL.HighlightTags   && (/\{(?:high|today|doing)\}/.test(listTitle) || /#(?:high|today|doing)\b/.test(listTitle)))
		) {
			return HIGH;
		}

		else if (
			(GLOBAL.HighlightTitles && !GLOBAL.MatchTitleSubstrings && (listTitle == 'trash' || listTitle == 'done')) ||
			(GLOBAL.HighlightTitles && GLOBAL.MatchTitleSubstrings  && /(?:^|[^#\S])(?:trash|done)\b/.test(listTitle)) ||
			(GLOBAL.HighlightTags   && (/\{(?:trash|done)\}/.test(listTitle) || /#(?:trash|done)\b/.test(listTitle)))
		) {
			return TRASH;
		}

		else if (
			GLOBAL.HighlightTags && (listTitle.includes('{ignore}') || /#ignore(?:\s|$)/.test(listTitle))
		) {
			return IGNORE;
		}

		else {
			return UNTAGGED;
		}

	}

	static toggleHighlight (highlight) {
		if (typeof highlight === 'boolean') {
			let body = getTrelloBody();
			if (body) {
				if (highlight) {
					ListHighlighter.highlight('override');
				} else {
					ListHighlighter.dehighlight('override');
				}
				body.classList.toggle('bmko_list-highlighter-toggled-off', !highlight);
			}
		}
	}

	static highlight(override) {

		var body = getTrelloBody();

		if (!body || (body.classList.contains('bmko_list-highlighter-toggled-off') && typeof override === 'undefined')) {
			return;
		}

		body.classList.add('bmko_list-highlighter-applied');

		var lists = document.querySelectorAll('.list');

		for (let list of lists) {

			let header = list.querySelector('.list-header h2'),
				type = ListHighlighter.getListTypeFromHeader(header);

			list.classList.remove('bmko_high-list', 'bmko_normal-list', 'bmko_low-list', 'bmko_ignore-list', 'bmko_trash-list', 'bmko_untagged-list');

			switch (type) {
				case 'high':
				case 'normal':
				case 'low':
				case 'ignore':
				case 'trash':
				case 'untagged':
					list.classList.add(`bmko_${type}-list`);
					break;
			}

			HeaderTagging.remove(header);

		}

		if (
			(GLOBAL.DimUntaggedNormal && document.querySelectorAll('.bmko_normal-list').length > 0) ||
			(GLOBAL.DimUntaggedHigh && document.querySelectorAll('.bmko_high-list').length > 0)
		) {
			body.classList.remove('bmko_do-not-dim-lists');
		} else {
			body.classList.add('bmko_do-not-dim-lists');
		}

	}

	static dehighlight(override) {

		var body = getTrelloBody();

		if (!body || (body.classList.contains('bmko_list-highlighter-toggled-off') && typeof override === 'undefined')) {
			return;
		}

		body.classList.remove('bmko_list-highlighter-applied');

		var lists = document.querySelectorAll('.list');

		for (let list of lists) {

			list.classList.remove('bmko_high-list', 'bmko_normal-list', 'bmko_low-list', 'bmko_ignore-list', 'bmko_trash-list');

			HeaderTagging.reapply(list);

		}

	}

}
