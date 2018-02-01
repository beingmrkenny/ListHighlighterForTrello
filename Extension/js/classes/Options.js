class Options {

	static defaults () {
		return {
			colors : {
				current : {
					default : 'red',
					blue    : null,
					orange  : null,
					green   : null,
					red     : null,
					purple  : null,
					pink    : null,
					lime    : null,
					sky     : null,
					gray    : null,
					photo   : null
				},
				custom : {
					default : null,
					blue    : null,
					orange  : null,
					green   : null,
					red     : null,
					purple  : null,
					pink    : null,
					lime    : null,
					sky     : null,
					gray    : null,
					photo   : null
				}
			},
			recentColors : [],
			options : {
				EnableHeaderCards           : false,
				EnableSeparatorCards        : false,
				HideHashtags                : true,
				HighlightTags               : true,
				HighlightTitles             : true,
				MatchTitleSubstrings        : false,
				HeaderCardsExtraSpace       : false,
				SeparatorCardsVisibleLine   : false,
				EnableWIP                   : false,
				IgnorePointsOnCards			: false,
				RefuseNewCards				: false
			},
			colorBlindFriendlyMode : null
		};

	}

	static createLoadObject (obj, props) {
		var prop, i, x = props.length - 1;
		for(i = 0; i < x; i++) {
			prop = props[i];
			if (typeof obj[prop] == 'undefined') {
				obj[prop] = {};
			}
			obj = obj[prop];
		}
		return obj[props[i]];
	}

	static load (path, callback) {

		if (typeof callback !== 'function') {
			throw new Error('Callback must be supplied');
		}

		var key = (typeof path == 'string') ? path.split('.') : null;

		chrome.storage.sync.get(key, function (result) {

			var returnVal = result;

			if (key) {
				returnVal = Options.createLoadObject(returnVal, key);
			}

			if (key == 'colors') {
				GLOBAL.colors = returnVal;
			}

			if (key == 'options') {
				for (let name in returnVal) {
					GLOBAL[name] = returnVal[name];
				}
			}

			if (typeof callback == 'function') {
				callback(returnVal);
			}

		});

	}

	static createSaveObject (obj, path, value) {
		var props = path.split("."), prop, i, x = props.length - 1;
		for(i = 0; i < x; i++) {
			prop = props[i];
			if (typeof obj[prop] == 'undefined') {
				obj[prop] = {};
			}
			obj = obj[prop];
		}
		obj[props[i]] = value;
	}

	static save (path, value, callback) {
		Options.load(null, function (saveObject) {
			Options.createSaveObject(saveObject, path, value);
			chrome.storage.sync.set(saveObject, callback);
		});
	}

	static resetIfEmpty (callback) {

		chrome.storage.sync.get(null, function (existingSettings) {

			var defaults = Options.defaults();
			for (let key in defaults) {
				if (!existingSettings.hasOwnProperty(key)) {
					existingSettings[key] = defaults[key];
				}
			}

			for (let key in existingSettings) {
				chrome.storage.sync.set({
					[key] : existingSettings[key]
				});
			}

			if (typeof callback == 'function') {
				callback();
			}

		});
	}

	static reset () {
		var defaults = Options.defaults();
		for (let key in defaults) {
			chrome.storage.sync.set({
				[key] : defaults[key]
			});
		}
	}

}
