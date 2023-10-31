class RulesMatcher {
	constructor(rules) {
		this.rules = rules;
		this.titles = {};
		this.substrings = {};
		for (var ruleId in this.rules) {
			let rule = this.rules[ruleId];
			if (rule.enabled) {
				for (let isString of rule.is) {
					this.titles[isString.toLowerCase()] = ruleId;
				}
			}
		}
	}

	makeSubstringsList() {
		for (var ruleId in this.rules) {
			this.substrings[ruleId] = [];
			let rule = this.rules[ruleId];
			if (rule.enabled) {
				for (let containSubstring of rule.contains) {
					if (!containSubstring.startsWith('#')) {
						containSubstring = '\\b' + containSubstring;
					}
					this.substrings[ruleId].push(
						new RegExp(containSubstring.toLowerCase() + '\\b')
					);
				}
			}
		}
	}

	getMatchingRule(listTitle) {
		listTitle = listTitle.toLowerCase();
		listTitle = listTitle.trim();
		var ruleId = this.titles[listTitle];
		if (ruleId) {
			return this.rules[ruleId];
		} else {
			this.makeSubstringsList();
			for (let ruleId in this.substrings) {
				for (let regex of this.substrings[ruleId]) {
					if (regex.test(listTitle)) {
						return this.rules[ruleId];
					}
				}
			}
		}
	}

	static apply(rule, list) {
		const ruleClass = rule ? 'bmko_' + rule.id : 'bmko_unmatched-list';
		let newClassName = list.className;
		[
			/bmko_rule-[a-z0-9]+/ig,
			'bmko_unmatched-list',
			'bmko_list_changed_background_color',
			'bmko_list_opacity_applied',
			'bmko_list_strikethrough_applied',
			'bmko_list_grayscale_applied',
		].forEach((classToRemove) => {
			newClassName = newClassName.replace(classToRemove, '');
		});
		list.className = newClassName;
		list.classList.add(ruleClass);

		if (rule) {
			let strikethrough = rule?.options?.strikethrough ? true : false,
				grayscale = rule?.options?.grayscale ? true : false;

			list.classList.toggle(
				'bmko_list_changed_background_color',
				rule?.highlighting?.color
			);
			list.classList.toggle(
				'bmko_list_opacity_applied',
				rule?.highlighting?.opacity < 1
			);
			list.classList.toggle('bmko_list_strikethrough_applied', strikethrough);
			list.classList.toggle('bmko_list_grayscale_applied', grayscale);
		}
	}

	static applyCorrectRuleToLists() {
		const ruleMatcher = new RulesMatcher(Global.getAllRules());
		let boardHasOtherListRuleApplied = false;
		for (let listHeader of TrelloPage.getTrellements('list-name')) {
			let matchingRule = ruleMatcher.getMatchingRule(listHeader.textContent);
			RulesMatcher.apply(
				matchingRule,
				TrelloPage.getTrellement('list', listHeader, UP)
			);
			if (matchingRule?.options?.unmatchedLists) {
				boardHasOtherListRuleApplied = true;
			}
		}
		const trelloBody = TrelloPage.getBody();
		if (trelloBody) {
			trelloBody.classList.toggle(
				'bmko_other_list_rules_applied',
				boardHasOtherListRuleApplied
			);
		}
	}
}
