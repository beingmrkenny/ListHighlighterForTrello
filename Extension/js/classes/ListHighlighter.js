'use script';

const HIGH   = 'high';
const NORMAL = 'normal';
const LOW    = 'low';
const IGNORE = 'ignore';
const TRASH  = 'trash';

class ListHighlighter {

	static detagHeader (header) {

		if (header && header.textContent) {

			let tagList = 'to ?do|today|doing|trash|done|normal|low|high|ignore';
			let r = new RegExp(`(?:\\s*(?:\{(${tagList})\}|#(?:${tagList})))\\s*`, 'i');
			let matches = header.textContent.match(r);
			let textarea = header.nextElementSibling;
			let title = header.textContent;

			if (textarea && textarea.tagName == 'TEXTAREA') {
				let newValue;
				if (matches && typeof matches[0] == 'string') {
					title = header.textContent.replace(matches[0], ' ').trim();
					textarea.value = title;
				} else {
					title = textarea.value;
				}
			}

			textarea.style.height = ListHighlighter.getNewHeight(textarea, title);

		}

	}

	static detagHeaderTimeout () {

		var textarea;

		if (arguments[0] instanceof HTMLTextAreaElement) {
			textarea = arguments[0];
		} else if (arguments[0] instanceof Event) {
			textarea = arguments[0].target;
		}

		var textarea = this;
		var header = textarea.previousElementSibling;
		window.setTimeout(function () {
			ListHighlighter.detagHeader(header);
		}, 10);

	}

	static retagHeader () {

		var textarea;

		if (arguments[0] instanceof HTMLTextAreaElement) {
			textarea = arguments[0];
		} else if (arguments[0] instanceof Event) {
			textarea = arguments[0].target;
		}

		var newValue = textarea.previousElementSibling.textContent;

		textarea.value = newValue;
		textarea.style.height = ListHighlighter.getNewHeight(textarea, newValue);

	}

	static getNewHeight(textarea, text) {

		var height, reference = document.createElement('textarea');
		var styles = window.getComputedStyle(textarea);

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

		let listTitle = header.textContent.toLowerCase().trim();

		if (listTitle.includes('{low}') ||
			/#low(?:\s|$)/.test(listTitle)
		) {
			return LOW;
		}

		else if (listTitle == 'todo' ||
			listTitle == 'to do' ||
			listTitle.includes('{normal}') ||
			listTitle.includes('{todo}') ||
			listTitle.includes('{to do}') ||
			/#(normal|to ?do)(?:\s|$)/.test(listTitle)
		) {
			return NORMAL;
		}

		else if (listTitle == 'today' ||
			listTitle == 'doing' ||
			listTitle.includes('{high}') ||
			listTitle.includes('{today}') ||
			listTitle.includes('{doing}') ||
			/#(high|today|doing)(?:\s|$)/.test(listTitle)
		) {
			return HIGH;
		}

		else if (listTitle == 'trash' ||
			listTitle == 'done' ||
			listTitle.includes('{trash}') ||
			listTitle.includes('{done}') ||
			/#(trash|done)(?:\s|$)/.test(listTitle)
		) {
			return TRASH;
		}

		else if (listTitle.includes('{ignore}') || /#ignore(?:\s|$)/.test(listTitle)) {
			return IGNORE;
		}

		else {
			return LOW;
		}

	}

	static toggleHighlight (highlight) {
		if (typeof highlight === 'boolean') {
			if (highlight) {
				ListHighlighter.highlight();
			} else {
				ListHighlighter.dehighlight();
			}
		}
	}

	static highlight() {

		document.body.classList.add('bmko_list-highlighter-applied');

		var lists  = document.querySelectorAll('.list');

		for (var i = 0, len = lists.length; i < len; i++) {

			let list = lists[i],
				header = list.querySelector('.list-header h2');

			list.classList.remove('bmko_high-list', 'bmko_normal-list', 'bmko_low-list', 'bmko_ignore-list', 'bmko_trash-list');

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

				if (GLOBAL.HideHashtags) {
					let textarea = header.nextElementSibling;
					if (textarea && textarea.tagName == 'TEXTAREA') {
						textarea.addEventListener('focus', ListHighlighter.retagHeader);
						textarea.addEventListener('blur', ListHighlighter.detagHeaderTimeout);
						ListHighlighter.detagHeader(header);
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

	static dehighlight() {

		document.body.classList.remove('bmko_list-highlighter-applied');

		var lists = document.querySelectorAll('.list');

		for (var i = 0, len = lists.length; i < len; i++) {

			let list = lists[i];
			list.classList.remove('bmko_high-list', 'bmko_normal-list', 'bmko_low-list', 'bmko_ignore-list', 'bmko_trash-list');

			if (GLOBAL.HideHashtags) {
				let textarea = list.querySelector('.list-header h2 + textarea');
				if (textarea) {
					ListHighlighter.retagHeader(textarea);
					textarea.removeEventListener('focus', ListHighlighter.retagHeader);
					textarea.removeEventListener('blur', ListHighlighter.detagHeaderTimeout);
				}
			}

		}

	}

}
