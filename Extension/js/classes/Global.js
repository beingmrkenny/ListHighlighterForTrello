class Global {
	static getItem(key) {
		var value = sessionStorage.getItem(key);
		value = JSON.parse(value);
		if (value && key.startsWith('rule-')) {
			value.id = key;
		}
		return value;
	}

	static getAllRules() {
		var rules = {};
		for (var prop in sessionStorage) {
			if (sessionStorage.hasOwnProperty(prop) && prop.startsWith('rule-')) {
				rules[prop] = JSON.parse(sessionStorage[prop]);
				rules[prop].id = prop;
			}
		}
		return rules;
	}

	static setItem(key, value) {
		// Don't save null values
		if (typeof value == 'undefined') {
			// QUESTION Global.setItem(key, null) - remove? or set null?
			// This happened in trello.com tab when a rule was deleted in the options tab
			// What does that mean?
			console.log(`removing a null value, key is [${key}]`);
			// Global.removeItem(key);
		} else {
			if (key.startsWith('rule-')) {
				value = JSON.stringify(value);
			}
			sessionStorage.setItem(key, value);
		}
	}

	static removeItem(key) {
		sessionStorage.removeItem(key);
	}
}
