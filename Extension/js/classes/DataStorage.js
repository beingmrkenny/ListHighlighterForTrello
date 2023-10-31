class DataStorage {
	static initialise(callback = null) {
		chrome.storage.sync.get(null, (results) => {
			var resultsIsEmpty = true;
			for (let propName in results) {
				resultsIsEmpty = false;
				break;
			}

			if (resultsIsEmpty) {
				results = Options.fillBlanksWithDefaults(results);
				results = Rules.addDefaults(results);
			} else {
				results = StorageLegacy.updateIfNecessary(results);
				results = Options.fillBlanksWithDefaults(results);
			}

			for (let propName in results) {
				Global.setItem(propName, results[propName]);
			}
			if (typeof callback == 'function') {
				callback(results);
			}
		});

		chrome.storage.onChanged.addListener((changes, namespace) => {
			for (let key in changes) {
				var storageChange = changes[key];
				if (typeof storageChange.newValue == 'undefined') {
					Global.removeItem(key);
				} else {
					Global.setItem(key, storageChange.newValue);
				}
			}
		});
	}

	static isKeyNameAllowed(keyName) {
		return (
			Object.keys(Options.defaults()).indexOf(keyName) > -1 ||
			keyName.startsWith('rule-')
		);
	}
}
