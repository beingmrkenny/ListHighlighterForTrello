function $id (id) {
	return document.getElementById(id);
}

function $(query) {
	return document.querySelector(query);
}

function $$(query) {
	return document.querySelectorAll(query);
}

function observe(params) {

	var observer = new MutationObserver(function (node) { params.callback(node, observer); });

	if (!params.targets && params.target) {
		params.targets = params.target;
	}

	if (params.targets instanceof NodeList || Array.isArray(params.targets)) {

		for (let target of params.targets) {
			observer.observe(target, params.options);
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

function getTemplate (id) {
	var templateContent = document.importNode($id(id).content, true);
	return templateContent.firstElementChild;
}

function j (string) {
	return JSON.parse(string);
}
