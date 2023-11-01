function qid(id) {
	return document.getElementById(id);
}

function q(query, context = document) {
	return context.querySelector(query);
}

function qq(query, context = document) {
	return context.querySelectorAll(query);
}

function setBackgroundColor(element, bgColor) {
	if (bgColor) {
		element.style.backgroundColor = bgColor;
	} else {
		element.removeAttribute('style');
	}
	let fillClassName = getFirstRegexMatch(
		element.className.match(/(fill-[a-z]+)/)
	);
	// NB is commenting this out a disaster?
	// if (fillClassName != 'fill-custom' && fillClassName != 'fill-normal') {
	// 	element.classList.remove(fillClassName);
	// }
	if (!element.matches('label[for="ColorTile-custom"]')) {
		element.classList.remove(fillClassName);
	}
	if (bgColor) {
		element.classList.toggle('mod-light-background', Color.isLight(bgColor));
	} else {
		element.classList.remove('mod-light-background');
	}
}

function removeClassesFromMatchingElements(classname, except = null) {
	for (let element of qq(`.${classname}`)) {
		if (except && element === except) {
			continue;
		}
		element.classList.remove(classname);
	}
}

function findElementByLeftPosition(left, classname, callback) {
	left = parseInt(left);

	if (left) {
		let desiredElement,
			top = 100;

		for (let i = 3; i > 0 && desiredElement == null; i--) {
			top += 50;
			for (let el of document.elementsFromPoint(left, top)) {
				if (el.classList.contains(classname)) {
					desiredElement = el;
					break;
				}
			}
		}

		if (desiredElement) {
			callback(desiredElement);
		}
	}
}

function createElement(string) {
	if (typeof string != 'string') {
		throw 'String must be passed to createElement';
	}

	string = string.trim();

	var container,
		tag = string.match(/<\s*([a-z0-9-]+)/i)[1];

	switch (tag) {
		case 'thead':
		case 'tbody':
			container = document.createElement('table');
			break;
		case 'tr':
			container = document.createElement('table');
			break;
		case 'td':
		case 'th':
			container = document.createElement('table');
			container.appendChild(document.createElement('tr'));
			break;
		default:
			container = document.createElement('div');
	}

	switch (tag) {
		case 'tr':
			container.innerHTML = string;
			return container.firstElementChild.firstElementChild;
			break;

		case 'th':
		case 'td':
			container.firstElementChild.innerHTML = string;
			return container.firstElementChild.firstElementChild;
			break;

		default:
			container.innerHTML = string;
			return container.firstElementChild;
			break;
	}
}

function escapeHTML(unsafeText) {
	let div = document.createElement('div');
	div.innerText = unsafeText;
	return div.innerHTML;
}

function removeElement(element) {
	var styles = {
		overflow: 'hidden',
		margin: '0',
		padding: '0',
		opacity: '0',
		height: '0',
	};

	var result;

	if (element instanceof HTMLElement) {
		element.style.height = element.offsetHeight + 'px';
		element.style.width = element.offsetWidth + 'px';
		element.style.transition =
			'margin 85ms ease-in, padding 85ms ease-in, opacity 85ms ease-in, height 85ms ease-in';

		element.addEventListener('transitionend', function (event) {
			var element = this;
			if (event.propertyName == 'height') {
				element.remove();
			}
		});

		window.setTimeout(function () {
			for (let property in styles) {
				element.style[property] = styles[property];
			}
		}, 10);
	}

	return result;
}

function listen(elements, events, callback) {
	if (
		elements instanceof HTMLElement ||
		elements == document ||
		elements == window
	) {
		elements = [elements];
	}

	if (elements instanceof NodeList || Array.isArray(elements)) {
		for (let el of elements) {
			if (typeof events == 'string') {
				events = [events];
			}
			events.forEach((event) => {
				el.addEventListener(event, callback);
			});
		}
	}
}

function observe() {
	var targets,
		callback,
		options = {
			childList: false,
			attributes: false,
			characterData: false,
			subtree: false,
			attributeOldValue: false,
			characterDataOldValue: false,
		};

	for (let arg of arguments) {
		let isFunction = typeof arg == 'function';
		let isArrayIsh = arg instanceof NodeList || Array.isArray(arg);
		let isHTMLElement = arg instanceof HTMLElement;

		if (isFunction) {
			callback = arg;
		} else if (isArrayIsh) {
			targets = arg;
		} else if (isHTMLElement) {
			targets = [arg];
		} else if (!isFunction && !isArrayIsh && !isHTMLElement) {
			for (let key in arg) {
				options[key] = arg[key];
			}
		}
	}

	if (targets) {
		var observer = new MutationObserver(function (mutations) {
			callback(mutations, observer);
		});

		for (let target of targets) {
			if (target instanceof HTMLElement) {
				observer.observe(target, options);
			}
		}

		return observer;
	}
}

function keepCounting(callback, countQuery, limit, interval, oldCount) {
	interval = isNaN(interval) ? 500 : interval;
	limit = isNaN(limit) ? 5 : --limit;

	var newCount = document.querySelectorAll(countQuery).length;

	if (limit > 0 && (typeof oldCount == 'undefined' || newCount !== oldCount)) {
		window.setTimeout(function () {
			keepCounting(callback, countQuery, limit, interval, newCount);
		}, interval);
	} else {
		if (newCount > 0) {
			callback();
		}
	}
}

function getFirstRegexMatch(matches) {
	if (matches && matches[0]) {
		return matches[0];
	}
}

function getTemplate(id) {
	var template = qid(id);
	if (template) {
		let templateContent = document.importNode(qid(id).content, true);
		if (templateContent.childElementCount == 1) {
			return templateContent.firstElementChild;
		} else if (templateContent.childElementCount > 1) {
			return templateContent;
		}
	}
}
