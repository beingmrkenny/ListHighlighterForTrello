function getListTitle (element) {
	if (element) {
		let list = (element.classList.contains('list'))
			? element
			: element.closest('.list');
		if (list) {
			return list.querySelector('.list-header-name').value;
		}
	}
}

function flash (element) {

	if (element.length) {
		for (let el of element) {
			el.style.outline = '10px solid red';
		}
	} else if (element.card) {
		element.card.style.outline = '10px solid red';
	} else {
		element.style.outline = '10px solid red';
	}

	setTimeout(
		function (element) {
			if (element.length) {
				for (let el of element) {
					el.style.outline = null;
				}
			} else if (element.card) {
				element.card.style.outline = '10px solid red';
			} else {
				element.style.outline = null;
			}
		},
		500,
		element
	);
}

Options.prototype.dump = function (asString = false) {
	chrome.storage.sync.get(null, function (existingSettings) {
		var dump = (asString) ? JSON.stringify(existingSettings) : existingSettings
		console.log(dump);
	});
}

Options.prototype.createRemoveObject = function (obj, path) {
	var props = path.split("."), prop, i, x = props.length - 1;
	for(i = 0; i < x; i++) {
		prop = props[i];
		if (typeof obj[prop] == 'undefined') {
			obj[prop] = {};
		}
		obj = obj[prop];
	}
	delete obj[props[i]];
}

Options.prototype.remove = function (path) {
	Options.load(null, function (allOptions) {
		Options.createRemoveObject(allOptions, path);
		chrome.storage.sync.set(saveObject);
	});
}

Options.prototype.clear = function () {
	chrome.storage.sync.clear();
}
