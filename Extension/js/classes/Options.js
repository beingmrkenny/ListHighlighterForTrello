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
			wip : {
				enabled                  : false,
				pointsCount              : false,
				cardCount                : true,
				blockNewCardsOnFullLists : null
			},
			stripHashTags : true,
			highlightHashTags   : true,
			highlightTitles     : true,
			matchTitleSubstrings : false,
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

	static save (option, value) {

		var opath = option.split('.');

		// TODO At some point it would be nice to do this dynamically
		// QUESTION do what???

		if (opath.length == 1) {

			let saveObject = {
				[option] : value
			};

			chrome.storage.sync.set(saveObject);

		} else if (opath.length > 1) {

			Options.load(opath[0], function (result) {

				var result = (Object.keys(result).length > 0)
					? result
					: Options.defaults();

				if (opath.length == 2) {
					result [opath[0]] [opath[1]] = value;
				} else if (opath.length == 3) {
					result [opath[0]] [opath[1]] [opath[2]] = value;
				}

				chrome.storage.sync.set(result);

			});

		}

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
