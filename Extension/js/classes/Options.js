class Options {
	static fillBlanksWithDefaults(results) {
		var defaults = Options.defaults('options'),
			newDefaults = {};
		for (let key of Object.keys(defaults)) {
			if (results.hasOwnProperty(key) === false) {
				results[key] = defaults[key];
				newDefaults[key] = defaults[key];
			}
		}
		chrome.storage.sync.set(newDefaults);
		return results;
	}

	static dump(asString = false) {
		chrome.storage.sync.get(null, function (existingSettings) {
			console.log(JSON.stringify(existingSettings, null, 2));
		});
	}

	static defaults(prefix = false) {
		var defaults = {
			'options-HighlightChangeTextColor': true,
			'options-HighlightUndimOnHover': false,

			// these three belong in DataStorage
			recentColors: [],
			colorBlindFriendlyMode: null,
			version: 4,
		};

		if (prefix) {
			for (let propName of Object.keys(defaults)) {
				if (!propName.startsWith(prefix)) {
					delete defaults[propName];
				}
			}
		}

		return defaults;
	}

	static getArrayFromResults(results) {
		var options = {};
		for (let key in results) {
			if (key.startsWith('options-')) {
				let name = key.replace('options-', '');
				options[name] = results[key];
			}
		}
		return options;
	}
}
