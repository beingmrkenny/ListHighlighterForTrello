class Rule {
	constructor(rule) {
		var ruleObject;
		if (typeof rule == 'string') {
			ruleObject = Global.getItem(rule);
			this.id = rule;
		} else {
			ruleObject = rule;
		}
		for (let propName in ruleObject) {
			this[propName] = ruleObject[propName];
		}
	}

	static getDataObjectFromEntries(entries) {
		var data = {
			id: null,
		};

		if (entries.hasOwnProperty('id')) data.id = entries.id;
		if (entries.hasOwnProperty('name')) data.name = entries.name;
		if (entries.hasOwnProperty('highlightColor'))
			data.highlightColor = entries.highlightColor;
		if (entries.hasOwnProperty('is'))
			data.is = Rule.getTreatedArrayFromString(entries.is);
		if (entries.hasOwnProperty('contains'))
			data.contains = Rule.getTreatedArrayFromString(entries.contains);

		if (entries.FormType == 'ListHighlightColor') {
			data.highlighting = Rule.mapEntriesToHighlighting(entries);
		}

		if (entries.FormType == 'MoreOptions') {
			data.options = {
				strikethrough: typeof entries.strikethrough != 'undefined',
				grayscale: typeof entries.grayscale != 'undefined',
				unmatchedLists: Rules.idExists(entries.unmatchedLists)
					? entries.unmatchedLists
					: null,
			};
		}

		return data;
	}

	static mapEntriesToHighlighting(entries) {
		let highlighting = {};

		for (let propName in entries) {
			if (propName == 'ColorTile') {
				highlighting.color = entries[propName];
			}

			if (propName == 'Opacity') {
				highlighting.opacity = entries[propName];
			}
		}

		return highlighting;
	}

	static checkNameErrors(data) {
		let errors = {};
		if (data.hasOwnProperty('name')) {
			if (data.name == '') {
				errors.name = 'empty';
			}
			if (Rules.nameExists(data.name)) {
				errors.name = 'exists';
			}
		}
		return errors;
	}

	static checkIsContainsErrors(data) {
		let errors = {},
			existingRule;

		if (data.id) {
			existingRule = new Rule(data.id);
		}

		if (data.hasOwnProperty('is') && data.hasOwnProperty('contains')) {
			if (data.is.length == 0 && data.contains.length == 0) {
				errors.criteria = 'empty';
			}

			let alreadyUsed = [];
			for (let item of data.is) {
				if (data.contains.indexOf(item) > -1) {
					alreadyUsed.push(item);
				}
			}
			for (let item of data.contains) {
				if (data.is.indexOf(item) > -1) {
					alreadyUsed.push(item);
				}
			}
			alreadyUsed = alreadyUsed.filter((val, i, self) => {
				return self.indexOf(val) === i;
			});

			if (alreadyUsed.length > 0) {
				errors.criteria = 'exists';
				errors.criteriaAlreadyUsed = alreadyUsed;
			}
		}

		if (
			data.hasOwnProperty('is') &&
			!data.hasOwnProperty('contains') &&
			!existingRule?.contains?.length &&
			data.is.length == 0
		) {
			errors.is = 'empty';
		}

		if (
			!data.hasOwnProperty('is') &&
			data.hasOwnProperty('contains') &&
			!existingRule?.is?.length &&
			data.contains.length == 0
		) {
			errors.contains = 'empty';
		}

		if (data.hasOwnProperty('is')) {
			let alreadyUsed = Rules.getStringAlreadyUsed('is', data.is, data.id);
			if (alreadyUsed.length > 0) {
				errors.is = 'exists';
				errors.isAlreadyUsed = alreadyUsed;
			}
		}

		if (data.hasOwnProperty('contains')) {
			let alreadyUsed = Rules.getStringAlreadyUsed(
				'contains',
				data.contains,
				data.id
			);
			if (alreadyUsed.length > 0) {
				errors.contains = 'exists';
				errors.containsAlreadyUsed = alreadyUsed;
			}
		}

		return errors;
	}

	static checkNewRuleEntriesAndSaveOrFail(
		entries,
		successCallback,
		failCallback
	) {
		let errors = {},
			data = Rule.getDataObjectFromEntries(entries);

		errors = { ...errors, ...Rule.checkNameErrors(data) };
		errors = { ...errors, ...Rule.checkIsContainsErrors(data) };

		if (Object.keys(errors).length == 0) {
			successCallback(data);
			return true;
		} else {
			failCallback(errors);
			return false;
		}
	}

	static getTreatedArrayFromString(string) {
		return string
			.split('\n')
			.map((val) => {
				return val.trim();
			})
			.filter((val) => val !== '')
			.filter((val, i, self) => {
				return self.indexOf(val) === i;
			});
	}

	static saveNewRule(data) {
		var id = Rule.getNewRuleId();
		var rule = {
			[id]: {
				name: data.name,
				id: id,
				sort: Rules.getHighestSortNumber(),
				is: data.is || [],
				contains: data.contains || [],
				highlighting: {
					color: data.highlightColor ? data.highlightColor : null,
					opacity: 1,
				},
				options: {},
				enabled: true,
			},
		};
		chrome.storage.sync.set(rule);
	}

	static saveEditedRule(data) {
		var rule = data && data.id ? Global.getItem(data.id) : false;

		if (!rule) {
			return;
		}

		var allowedProperties = [
			'name',
			'sort',
			'is',
			'contains',
			'highlighting',
			'options',
			'enabled',
		];

		for (let propName in data) {
			if (allowedProperties.indexOf(propName) > -1) {
				rule[propName] = data[propName];
			}
		}

		chrome.storage.sync.set({ [data.id]: rule });
	}

	static failForm(errors) {
		for (let name in errors) {
			let value = errors[name];
			if (typeof value == 'string') {
				for (let error of qq(
					`.error[data-name="${name}"][data-value="${value}"]`
				)) {
					error.classList.add('show');
				}
			} else if (Array.isArray(value)) {
				let errorMessage = q(`.error[data-name="${name}"]`);
				errorMessage.classList.add('show');
				for (let item of value) {
					errorMessage.appendChild(createElement(`<li>${item}</li>`));
				}
			}
		}
	}

	static saveProperty(ruleId, property, value) {
		let rule = Global.getItem(ruleId);
		if (rule) {
			if (
				property == 'unmatchedLists' ||
				property == 'strikethrough' ||
				property == 'grayscale'
			) {
				rule.options[property] = value;
			} else {
				rule[property] = value;
			}
			chrome.storage.sync.set({ [ruleId]: rule });
		}
	}

	getHighlightColor(trelloBG) {
		return this.highlighting.color;
	}

	getUnmatchedList() {
		var unmatchedLists;
		if (
			this.hasOwnProperty('options') &&
			this.options.hasOwnProperty('unmatchedLists')
		) {
			unmatchedLists = this.options.unmatchedLists;
		}
		return unmatchedLists;
	}

	delete() {
		var allRules = Global.getAllRules();
		for (let ruleId in allRules) {
			let rule = new Rule(allRules[ruleId]),
				unmatchedList = rule.getUnmatchedList();
			if (unmatchedList == this.id) {
				Rule.saveProperty(rule.id, 'unmatchedLists', null);
			}
		}
		chrome.storage.sync.remove(this.id);
	}

	static getNewRuleId() {
		var newId = `rule-${Rule.getCRC32b(Date.now())}`;
		var existingRule = Global.getItem(newId);
		while (existingRule) {
			newId = `rule-${Rule.getCRC32b(Date.now())}`;
			existingRule = Global.getItem(newId);
		}
		return newId;
	}

	static getCRC32b(data) {
		if (typeof data != 'string') {
			data = data.toString();
		}
		var table = new Uint32Array(256);
		for (let i = 256; i--; ) {
			var tmp = i;
			for (let k = 8; k--; ) {
				tmp = tmp & 1 ? 3988292384 ^ (tmp >>> 1) : tmp >>> 1;
			}
			table[i] = tmp;
		}
		var crc = -1;
		for (let i = 0, l = data.length; i < l; i++) {
			crc = (crc >>> 8) ^ table[(crc & 255) ^ data[i]];
		}
		var hash = (crc ^ -1) >>> 0;
		return hash.toString(16);
	}
}
