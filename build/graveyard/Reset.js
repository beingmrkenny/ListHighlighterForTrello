// NOTE: not used in build, this is spare 'dev' code used to reset options. It may not work any more.
class Reset {

	static all () {
		chrome.storage.sync.clear();
		Reset.options();
		Reset.rules();
	}

	static options (clear = false) {
		Reset.type('options', clear);
	}

	static rules (clear = false) {
		Reset.type('rules', clear);
	}

	static type (type, clear = false) {

		var staticClass, startsWith, defaults;

		if (type == 'options') {
			staticClass = Options;
			startsWith = 'options-';
		} else {
			staticClass = DataStorage;
			startsWith = 'rule-';
		}

		defaults = staticClass.defaults();

		if (clear === true) {
			staticClass.getAll(results => {
				let namesToRemove = [];
				for (let key in results) {
					if (key.startsWith(startsWith)) {
						namesToRemove.push(key);
					}
				}
				chrome.storage.sync.remove(namesToRemove);
			});
		}

		chrome.storage.sync.set(defaults);

	}

}
