class Rules {
	static extractFromResults(results) {
		var rules = [];
		for (let propName in results) {
			if (propName.startsWith('rule-')) {
				let rule = results[propName];
				rule.id = propName;
				rules.push(rule);
			}
		}
		rules.sort((a, b) => (a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0));
		return rules;
	}

	static dump() {
		console.table(Global.getAllRules());
	}

	static addDefaults(results) {
		let defaults = Rules.defaults(),
			newDefaults = {};
		for (let key in defaults) {
			results[key] = defaults[key];
			newDefaults[key] = defaults[key];
		}
		chrome.storage.sync.set(newDefaults);
		return results;
	}

	static idExists(id) {
		if (typeof id == 'string') {
			let rules = Global.getAllRules();
			return rules.hasOwnProperty(id);
		}
		return false;
	}

	static getHighestSortNumber() {
		var rules = Global.getAllRules();
		var highestSort = 0;
		for (let ruleId in rules) {
			let rule = rules[ruleId];
			if (rule.sort > highestSort) {
				highestSort = rule.sort;
			}
		}
		return highestSort + 1;
	}

	static nameExists(name) {
		let rules = Global.getAllRules();
		for (let ruleName in rules) {
			if (rules[ruleName].name == name) {
				return true;
			}
		}
		return false;
	}

	static getStringAlreadyUsed(key, stringsToCheck, existingRuleId = null) {
		let forbiddenStrings = [];
		let alreadyUsed = [];
		let rules = Global.getAllRules();
		for (let iteratingRuleId in rules) {
			if (existingRuleId === iteratingRuleId) {
				let otherKey = key == 'is' ? 'contains' : 'is';
				for (let word of rules[iteratingRuleId][otherKey]) {
					forbiddenStrings.push(word);
				}
			} else {
				for (let word of rules[iteratingRuleId].contains) {
					forbiddenStrings.push(word);
				}
				for (let word of rules[iteratingRuleId].is) {
					forbiddenStrings.push(word);
				}
			}
		}
		for (let string of stringsToCheck) {
			if (forbiddenStrings.indexOf(string) > -1) {
				alreadyUsed.push(string);
			}
		}
		return alreadyUsed;
	}

	static defaults() {
		return {
			'rule-todo': {
				name: 'Todo',
				sort: 0,
				is: ['Todo', 'To do'],
				contains: ['#normal', '#todo'],
				highlighting: {
					color: null,
					opacity: 1,
				},
				options: { unmatchedLists: 'rule-low' },
				enabled: true,
			},

			'rule-doing': {
				name: 'Doing',
				sort: 1,
				is: ['Doing', 'Today'],
				contains: ['#high', '#doing', '#today'],
				highlighting: {
					color: '#ec2f2f',
					opacity: 1,
				},
				options: {},
				enabled: true,
			},

			'rule-done': {
				name: 'Done',
				sort: 4,
				is: ['Done', 'Trash'],
				contains: ['#trash', '#done'],
				highlighting: {
					color: null,
					opacity: '0.25',
				},
				options: { strikethrough: true, grayscale: true },
				enabled: true,
			},

			'rule-low': {
				name: 'Low Priority',
				sort: 3,
				is: [],
				contains: ['#low'],
				highlighting: {
					color: null,
					opacity: '0.45',
				},
				options: {},
				enabled: true,
			},

			'rule-ignore': {
				name: 'Ignore',
				sort: 4,
				is: [],
				contains: ['#ignore'],
				highlighting: {
					color: null,
					opacity: '0.25',
				},
				options: { grayscale: true },
				enabled: true,
			},
		};
	}
}
