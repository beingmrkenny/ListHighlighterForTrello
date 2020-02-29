class RulesMatcher {

	constructor (rules) {
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

	makeSubstringsList () {
		for (var ruleId in this.rules) {
			this.substrings[ruleId] = [];
			let rule = this.rules[ruleId];
			if (rule.enabled) {
				let regexStrings = [];
				for (let containSubstring of rule.contains) {
					if (!containSubstring.startsWith('#')) {
						containSubstring = '\\b' + containSubstring;
					}
					this.substrings[ruleId].push(new RegExp(containSubstring.toLowerCase()+'\\b'));
				}
			}
		}
	}

	getMatchingRule (listTitle) {
		listTitle = listTitle.toLowerCase();
		if (Global.getItem('options-CountEnableWIP') == true) {
			listTitle = listTitle.replace(/\[\d+\]\s*$/, '');
			listTitle = listTitle.replace(/\s*#count\s*/gi, '');
		}
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

	static apply (rule, list) {

		let ruleClass = (rule)
			? 'bmko_' + rule.id
			: 'bmko_unmatched-list';

		let ruleClasses = [
			'bmko_unmatched-list',
			'bmko_list_changed_background_color',
			'bmko_list_opacity_applied',
			'bmko_list_strikethrough_applied',
			'bmko_list_grayscale_applied'
		];

		for (let className of list.classList) {
			if (className.startsWith('bmko_rule-') || ruleClasses.indexOf(className) > -1) {
				list.classList.remove(className);
			}
		}

		list.classList.add(ruleClass);

		if (rule) {
			let strikethrough = ovalue(rule, 'options', 'strikethrough') ? true : false,
				grayscale = ovalue(rule, 'options', 'grayscale') ? true : false;
			list.classList.toggle('bmko_list_changed_background_color', ovalue(rule, 'highlighting', 'color'));
			list.classList.toggle('bmko_list_opacity_applied', (ovalue(rule, 'highlighting', 'opacity') < 1));
			list.classList.toggle('bmko_list_strikethrough_applied', strikethrough);
			list.classList.toggle('bmko_list_grayscale_applied', grayscale);
		}

	}

	static applyCorrectRuleToLists () {
		let ruleMatcher = new RulesMatcher(Global.getAllRules()),
			boardHasOtherListRuleApplied = false;
		for (let listHeader of qq('.list-header-name-assist')) {
			let matchingRule = ruleMatcher.getMatchingRule(listHeader.textContent);
			RulesMatcher.apply(matchingRule, listHeader.closest('.list'));
			if (ovalue(matchingRule, 'options', 'unmatchedLists')) {
				boardHasOtherListRuleApplied = true;
			}
		}
		let trelloBody = getTrelloBody();
		if (trelloBody) {
			trelloBody.classList.toggle('bmko_other_list_rules_applied', boardHasOtherListRuleApplied);
		}
	}

}
