class Options {

	static load (optionKey, callback) {
	    if (typeof callback !== 'function') {
	        throw new Error('Callback must be supplied');
	    }
	    chrome.storage.sync.get(optionKey, function (results) {
			callback(results);
	    });
	}

	static save (object, callback = function(){}) {
		chrome.storage.sync.set(object, callback);
	}

	static initialise (callback = null) {

		chrome.storage.sync.get(null, function (results) {

			let resave = false;

			if (results.colors) {
				for (let bg in results.colors.current) {
					results[`colors.current.${bg}`] = results.colors.current[bg];
				}
				for (let bg in results.colors.custom) {
					results[`colors.custom.${bg}`] = results.colors.custom[bg];
				}
				delete results.colors;
				chrome.storage.sync.remove('colors');
				resave = true;
			}

			if (results.options) {
				for (let opt in results.options) {
					results[`options.${opt}`] = results.options[opt];
				}
				delete results.options;
				chrome.storage.sync.remove('options');
				resave = true;
			}

			let defaults = Options.defaults();

			// remove options that are no longer supported
			for (let key in results) {
				if (key.startsWith('options.') && !defaults.hasOwnProperty(key)) {
					delete results[key];
					chrome.storage.sync.remove(key);
				}
			}

			// if there's no setting, return the default
			for (let key in defaults) {
				if (!results.hasOwnProperty(key)) {
					results[key] = defaults[key];
				}
			}

			Options.processColors(results);
			Options.processOptions(results);

			if (resave == true) {
				Options.save(results);
			}

			if (typeof callback == 'function') {
				callback(results);
			}

		});

	}

	static defaults (prefix = false) {

		var defaults = {
			'colors.current.default':            'red',
			'colors.current.blue':               null,
			'colors.current.orange':             null,
			'colors.current.green':              null,
			'colors.current.red':                null,
			'colors.current.purple':             null,
			'colors.current.pink':               null,
			'colors.current.lime':               null,
			'colors.current.sky':                null,
			'colors.current.gray':               null,
			'colors.current.photo':              null,

			'colors.custom.default':             null,
			'colors.custom.blue':                null,
			'colors.custom.orange':              null,
			'colors.custom.green':               null,
			'colors.custom.red':                 null,
			'colors.custom.purple':              null,
			'colors.custom.pink':                null,
			'colors.custom.lime':                null,
			'colors.custom.sky':                 null,
			'colors.custom.gray':                null,
			'colors.custom.photo':               null,

			'options.EnableHeaderCards':         false,
			'options.EnableSeparatorCards':      false,
			'options.HideHashtags':              true,
			'options.HighlightTags':             true,
			'options.HighlightTitles':           true,
			'options.MatchTitleSubstrings':      false,
			'options.HeaderCardsExtraSpace':     false,
			'options.SeparatorCardsVisibleLine': false,
			'options.EnableWIP':                 false,
			'options.CountAllCards':             false,
			'options.EnablePointsOnCards':       false,
			'options.HideManualCardPoints':      false,

			'recentColors':                      [],
			'colorBlindFriendlyMode':            null
		}

		if (prefix) {
			for (let key of Object.keys(defaults)) {
				if (!key.startsWith(prefix)) {
					delete defaults[key];
				}
			}
		}

		return defaults;
	}

	static loadColors (callback) {
		var	defaultColors = Options.defaults('colors'),
			colorKeys = Object.keys(defaultColors);
		Options.load(colorKeys, function (results) {
			for (let colorKey in defaultColors) {
				if (!results.hasOwnProperty(colorKey)) {
					results[colorKey] = defaultColors[colorKey];
				}
			}
			callback(Options.processColors(results));
		});
	}

	static loadOptions (callback) {
		var defaultOptions = Options.defaults('options'),
			optionKeys = Object.keys(defaultOptions);
		Options.load(optionKeys, function (results) {
			for (let optionKey in defaultOptions) {
				if (!results.hasOwnProperty(optionKey)) {
					results[optionKey] = defaultOptions[optionKey];
				}
			}
			callback(Options.processOptions(results));
		});
	}

	static processColors (results) {
		var colors = { current: {}, custom : {} };
		for (let key in results) {
			if (key.startsWith('colors.custom.')) {
				colors.custom[key.replace('colors.custom.', '')] = results[key];
			}
			if (key.startsWith('colors.current.')) {
				colors.current[key.replace('colors.current.', '')] = results[key];
			}
		}
		GLOBAL.colors = colors;
		return colors;
	}

	static processOptions (results) {
		var options = {};
		for (let key in results) {
			let k = key.replace('options.', '');
			options[k] = results[key];
			GLOBAL[k] = results[key];
		}
		return options;
	}

}
