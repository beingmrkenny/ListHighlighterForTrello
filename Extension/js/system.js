'use strict';

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
