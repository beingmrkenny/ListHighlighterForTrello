class HeaderTagging {

	// Removes first #tag and first [\d] from the textarea content
	static detagHeaderTextarea (textarea) {

		let hideTags = (GLOBAL.HighlightTags && GLOBAL.HideHashtags),
			hideWipNumbers = (GLOBAL.EnableWIP);

		if (textarea && textarea.value && (hideTags || hideWipNumbers)) {

			let title = textarea.value;

			if (textarea && textarea.tagName == 'TEXTAREA') {

				let tagList = 'to ?do\\b|today\\b|doing\\b|trash\\b|done\\b|normal\\b|low\\b|high\\b|ignore\\b|count\\b',
					r;

				if (hideTags && hideWipNumbers) {

					r = `#(?:${tagList})|(?:\\[[0-9]+\\])`;

				} else if (!hideTags && hideWipNumbers) {

					r = `(?:\\[[0-9]+\\])`;

				} else if (hideTags && !hideWipNumbers) {

					r = `#(?:${tagList})`;

				}

				let regex = new RegExp(r, 'gi'),
					matches = title.match(regex);

				if (matches && typeof matches[0] == 'string') {

					let countTagDone = false,
						countHashTagDone = false,
						hashTagDone = false;

					for (let match of matches) {

						if (countTagDone == false && match.startsWith('[')) {
							match = match.replace(/(\[|\])/g, '\\$1');
							title = title.replace(new RegExp(`\\s*${match}\\s*`), ' ').trim();
							countTagDone = true;
						}

						if (countHashTagDone == false && match == '#count') {
							title = title.replace('#count', ' ').trim();
							countHashTagDone = true;
						}

						if (hashTagDone == false && match.startsWith('#') && match != '#count') {
							title = title.replace(new RegExp(`\\s*${match}\\b\\s*`), ' ').trim();
							hashTagDone = true;
						}

					}

				}

				textarea.value = title;

			}

			textarea.style.height = HeaderTagging.getNewHeight(textarea, title);

		}

	}

	static detagHeaderTextareaTimeout () {
		var textarea = this;
		window.setTimeout(function () {
			HeaderTagging.detagHeaderTextarea(textarea);
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

		var newValue = textarea.previousElementSibling.textContent;
		textarea.value = newValue;
		textarea.style.height = HeaderTagging.getNewHeight(textarea, newValue);

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

	static toggleTags (hide) {
		var lists = document.querySelectorAll('.list');
		for (let list of lists) {
			let textarea = list.querySelector('.list-header h2 + textarea');
			if (textarea) {
				if (hide) {
					HeaderTagging.detagHeaderTextarea(textarea);
				} else {
					HeaderTagging.retagHeaderTextarea(textarea);
				}
			}
		}
	}

	static remove (header) {
		if ((GLOBAL.HighlightTags && GLOBAL.HideHashtags) || GLOBAL.EnableWIP) {
			let textarea = header.nextElementSibling;
			if (textarea && textarea.tagName == 'TEXTAREA') {
				textarea.addEventListener('focus', HeaderTagging.retagHeaderTextarea);
				textarea.addEventListener('blur', HeaderTagging.detagHeaderTextareaTimeout);
				HeaderTagging.detagHeaderTextarea(textarea);
			}
		}
	}

	static reapply (list) {
		if ((GLOBAL.HighlightTags && GLOBAL.HideHashtags) || GLOBAL.EnableWIP) {
			let textarea = list.querySelector('.list-header h2 + textarea');
			if (textarea) {
				HeaderTagging.retagHeaderTextarea(textarea);
				textarea.removeEventListener('focus', HeaderTagging.retagHeaderTextarea);
				textarea.removeEventListener('blur', HeaderTagging.detagHeaderTextareaTimeout);
			}
		}
	}

}
