function $id (id) {
	return document.getElementById(id);
}

function $(query) {
	return document.querySelector(query);
}

function createElement (string) {

		var element, events;

		var container = document.createElement('div');

		if (typeof (string) != 'string') {
			throw 'First parameter must be a string';
		}

		else if (typeof arguments[1] !== 'undefined') {
			events = arguments[1];
		}

		string = string.trim();

		switch (true) {
			case /^<(:?th|td)\b/.test(string) :
			case /^<tr\b/.test(string) :
			case /^<t(:?r|head|body)/.test(string) :
				console.warn('Table elements do not work with this function');
				break;
		}

		container.innerHTML = string;

		element = container.firstElementChild;

		return element;
	}

function observe(params) {

	var observer = new MutationObserver(function (node) { params.callback(node, observer); });

	if (!params.targets && params.target) {
		params.targets = params.target;
	}

	if (params.targets instanceof NodeList || Array.isArray(params.targets)) {

		for (let i = params.targets.length - 1; i > -1; i--) {
			observer.observe(params.targets[i], params.options);
		}

	} else if (params.targets instanceof HTMLElement) {

		observer.observe(params.targets, params.options);

	}

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

// NOTE This function uses a checker function which returns a boolean, rather than relying on try/catch
// function keepChecking(callback, checker, limit, interval) {
//
// 	interval = (isNaN(interval) ? 500 : interval);
// 	limit = (isNaN(limit) ? 5 : --limit);
//
// 	if (checker()) {
// 		callback();
// 	} else if (limit > 0) {
// 		window.setTimeout(function () {
// 			keepTrying(callback, checker, limit, interval);
// 		}, interval);
// 	}
//
// }

// NOTE This function counts something, and applies the callback once the count has stopped changing
function keepCounting(callback, counter, limit, interval, oldCount) {

	interval = (isNaN(interval) ? 500 : interval);
	limit = (isNaN(limit) ? 5 : --limit);

	var newCount = counter();

	if (
		limit > 0 &&
		(typeof oldCount == 'undefined' || newCount !== oldCount)
	) {

		window.setTimeout(function () {
			keepCounting(callback, counter, limit, interval, newCount);
		}, interval);

	} else {

		if (newCount > 0) {
			callback();
		}

	}

}

function getTemplate (id) {
	var templateContent = document.importNode($id(id).content, true);
	return templateContent.firstElementChild;
}

function j (string) {
	return JSON.parse(string);
}
