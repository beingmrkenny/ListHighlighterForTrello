function $id (id) {
	return document.getElementById(id);
}

function $(query, context = document) {
	return context.querySelector(query);
}

function $$(query, context = document) {
	return context.querySelectorAll(query);
}

function removeClasses(classname, except = null) {
	for (let el of $$(`.${classname}`)) {
		if (except !== null && el !== except) {
			el.classList.remove(classname);
		} else if (except === null) {
			el.classList.remove(classname);
		}
	}
}

function findElementByLeftPosition (left, classname, callback) {

	left = parseInt(left);

	if (left) {

		let desiredElement,
			elements,
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

// REVIEW: is this needed?
function listen (els, ev, callback) {

	if (els instanceof HTMLElement || els == document || els == window) {
		els = [els];
	}

	if (els instanceof NodeList || Array.isArray(els)) {
		for (let el of els) {
			el.addEventListener(ev, callback);
		}
	}

}

function observe() {

	var targets, callback, options = {
		childList: false,
		attributes: false,
		characterData: false,
		subtree: false,
		attributeOldValue: false,
		characterDataOldValue: false
	};

	for (let arg of arguments) {

		let isFunction = (typeof arg == 'function');
		let isArrayIsh = (arg instanceof NodeList || Array.isArray(arg));
		let isHTMLElement = (arg instanceof HTMLElement);

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

	var observer = new MutationObserver(function (nodes) {
		if (nodes.length == 1) {
			nodes = nodes[0];
		}
		callback(nodes, observer);
	});

	for (var i = targets.length - 1; i > -1; i--) {
		observer.observe(targets[i], options);
	}

	return observer;

}

function keepTrying(callback, limit, interval) {

	interval = (isNaN(interval) ? 500 : interval);
	limit = (isNaN(limit) ? 5 : --limit);

	try {
		callback();
	} catch(error) {
		if (limit > 0) {
			window.setTimeout(function () {
				keepTrying(callback, limit, interval);
			}, interval);
		}
	}

}

function keepChecking(callback, checker, limit, interval) {

	interval = (isNaN(interval) ? 500 : interval);
	limit = (isNaN(limit) ? 5 : --limit);

	if (checker()) {
		callback();
	} else if (limit > 0) {
		window.setTimeout(function () {
			keepTrying(callback, checker, limit, interval);
		}, interval);
	}

}

function keepCounting(callback, countQuery, limit, interval, oldCount) {

	interval = (isNaN(interval) ? 500 : interval);
	limit = (isNaN(limit) ? 5 : --limit);

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

function ovalue(obj) {
	var base = obj;
	if (typeof base == 'object' && base !== null) {
		for (var i=1, x=arguments.length; i<x; i++) {
			if (typeof base[arguments[i]] == 'object' && base[arguments[i]] !== null) {
				base = base[arguments[i]];
			} else {
				base = base[arguments[i--]];
				break;
			}
		}
	}
	return base;
}

function getTemplate (id) {
	var templateContent = document.importNode($id(id).content, true);
	return templateContent.firstElementChild;
}

function j (string) {
	return JSON.parse(string);
}

function getTrelloBody () {
	return document.getElementById('classic-body');
}
