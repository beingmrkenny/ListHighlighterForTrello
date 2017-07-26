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
					gray    : null
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
					gray    : null
				},
			},
			options : {
				EnableWIP            : false,
				EnableHeaderCards    : false,
				EnableSeparatorCards : false,
				HideHashtags         : true,
				HighlightTags        : true,
				HighlightTitles      : true,
				MatchTitleSubstrings : false
			},
			colorBlindFriendlyMode : null
		};

	}

	static load (option, callback) {

		if (typeof callback !== 'function') {
			throw new Error('Callback must be supplied');
		}

		var opath = option.split('.');

		chrome.storage.sync.get(opath[0], function (result) {

			var returnVal = result;

			if (opath.length == 2) {
				returnVal = result[opath[1]];
			}

			callback(returnVal);
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

	static save (option, value) {
		var saveObject = {};
		Options.createSaveObject (saveObject, option, value);
		chrome.storage.sync.set(saveObject);
	}

	static resetIfEmpty () {
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
