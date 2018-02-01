'use strict';

const HIGH   = 'high';
const NORMAL = 'normal';
const LOW    = 'low';
const IGNORE = 'ignore';
const TRASH  = 'trash';

class ListHighlighter {

    // Removes first #tag and first [\d] from the textarea content
	static detagHeaderTextarea (header) {

		let hideTags = (GLOBAL.HighlightTags && GLOBAL.HideHashtags),
			hideWipNumbers = (GLOBAL.EnableWIP);

		if (header && header.textContent && (hideTags || hideWipNumbers)) {

			let textarea = header.nextElementSibling,
				title = header.textContent;

			if (textarea && textarea.tagName == 'TEXTAREA') {

				let tagList = 'to ?do\\b|today\\b|doing\\b|trash\\b|done\\b|normal\\b|low\\b|high\\b|ignore\\b',
					r;

				if (hideTags && hideWipNumbers) {

					r = `#(?:${tagList})|(?:\[[0-9]+\])`;

				} else if (!hideTags && hideWipNumbers) {

					r = `(?:\[[0-9]+\])`;

				} else if (hideTags && !hideWipNumbers) {

					r = `#(?:${tagList})`;

				}

				let regex = new RegExp(r, 'gi'),
					matches = title.match(regex);

				if (matches && typeof matches[0] == 'string') {

					let countTagDone = false,
						hashTagDone = false;

					for (let match of matches) {

						if (countTagDone == false && match.startsWith('[')) {
							match = match.replace(/(\[|\])/g, '\\$1');
							title = title.replace(new RegExp(`\\s*${match}\\s*`), ' ').trim();
							countTagDone = true;
						}

						if (hashTagDone == false && match.startsWith('#')) {
							title = title.replace(new RegExp(`\\s*${match}\\b\\s*`), ' ').trim();
							hashTagDone = true;
						}

					}

				}

				textarea.value = title;

			}

			textarea.style.height = ListHighlighter.getNewHeight(textarea, title);

		}

	}

	static detagHeaderTextareaTimeout () {
		var textarea = this;
		var header = textarea.previousElementSibling;
		window.setTimeout(function () {
			ListHighlighter.detagHeaderTextarea(header);
		}, 10);
	}

	// puts textContent from the h2 tag back into the textarea
	// called when a header textarea is focussed on
    // called when list highlighting is switched off on one or all lists
	static retagHeaderTextarea () {

		var textarea;

		if (arguments[0] instanceof HTMLTextAreaElement) {
			textarea = arguments[0];
		} else if (arguments[0] instanceof Event) {
			textarea = arguments[0].target;
		}

		var newValue = textarea.previousElementSibling.textContent,
			hasFocus = (document.hasFocus() && textarea === document.activeElement);
		console.log(hasFocus);
		if (GLOBAL.EnableWIP && !hasFocus) {
			newValue = newValue.replace(/\s*\[[0-9]+\]\s*/, ' ');
		}

		textarea.value = newValue;
		textarea.style.height = ListHighlighter.getNewHeight(textarea, newValue);

	}

	static getNewHeight(textarea, text) {

		var height,
			reference = document.createElement('textarea'),
			styles = window.getComputedStyle(textarea);

		reference.className = textarea.className;
		reference.setAttribute('rows', 1);
		reference.value = text;

		var styleProps = {
			position: 'absolute',
			top: '-1000px',
			left: '-1000px',
			width: styles.width
		};

		for (let prop in styleProps) {
			reference.style[prop] = styleProps[prop];
		}

		document.body.appendChild(reference);
		autosize(reference);
		autosize.update(reference);
		var height = reference.style.height;
		reference.remove();

		return height;

	}

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
			return LOW;
		}

	}

	static toggleHighlight (highlight) {
		if (typeof highlight === 'boolean') {
			if (highlight) {
				ListHighlighter.highlight('override');
			} else {
				ListHighlighter.dehighlight('override');
			}
			document.body.classList.toggle('bmko_list-highlighter-toggled-off', !highlight);
		}
	}

	static highlight(override) {

		if (document.body.classList.contains('bmko_list-highlighter-toggled-off') && typeof override === 'undefined') {
			return;
		}

		document.body.classList.add('bmko_list-highlighter-applied');

		var lists = document.querySelectorAll('.list');

		for (let list of lists) {

			let header = list.querySelector('.list-header h2');

			list.classList.remove('bmko_high-list', 'bmko_normal-list', 'bmko_low-list', 'bmko_ignore-list', 'bmko_trash-list');

			// COMBAK is there ever not a header??
			if (header) {

				let type = ListHighlighter.getListTypeFromHeader(header);

				switch (type) {
					case 'high':
					case 'normal':
					case 'low':
					case 'ignore':
					case 'trash':
						list.classList.add(`bmko_${type}-list`);
						break;
				}

				if ((GLOBAL.HighlightTags && GLOBAL.HideHashtags) || GLOBAL.EnableWIP) {
					let textarea = header.nextElementSibling;
					if (textarea && textarea.tagName == 'TEXTAREA') {
						textarea.addEventListener('focus', ListHighlighter.retagHeaderTextarea);
						textarea.addEventListener('blur', ListHighlighter.detagHeaderTextareaTimeout);
						ListHighlighter.detagHeaderTextarea(header);
					}
				}

			}

		}

		if (
			document.querySelectorAll('.bmko_normal-list').length > 0 ||
			document.querySelectorAll('.bmko_high-list').length > 0
		) {
			document.body.classList.remove('bmko_do-not-dim-lists');
		} else {
			document.body.classList.add('bmko_do-not-dim-lists');
		}

	}

	static dehighlight(override) {

		if (document.body.classList.contains('bmko_list-highlighter-toggled-off') && typeof override === 'undefined') {
			return;
		}

		document.body.classList.remove('bmko_list-highlighter-applied');

		var lists = document.querySelectorAll('.list');

		for (let list of lists) {

			list.classList.remove('bmko_high-list', 'bmko_normal-list', 'bmko_low-list', 'bmko_ignore-list', 'bmko_trash-list');

			if ((GLOBAL.HighlightTags && GLOBAL.HideHashtags) || GLOBAL.EnableWIP) {
				let textarea = list.querySelector('.list-header h2 + textarea');
				if (textarea) {
					ListHighlighter.retagHeaderTextarea(textarea);
					textarea.removeEventListener('focus', ListHighlighter.retagHeaderTextarea);
					textarea.removeEventListener('blur', ListHighlighter.detagHeaderTextareaTimeout);
				}
			}

		}

	}

	static toggleHideHashtags (hide) {
		var lists = document.querySelectorAll('.list');
		for (let list of lists) {
			let textarea = list.querySelector('.list-header h2 + textarea');
			if (textarea) {
				if (hide) {
					ListHighlighter.detagHeaderTextarea(textarea);
				} else {
					ListHighlighter.retagHeaderTextarea(textarea);
				}
			}
		}
	}

}
