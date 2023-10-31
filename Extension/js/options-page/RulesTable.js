class RulesTable {
	static build(results) {
		var table = q('.highlighting-table'),
			tbody = q('.highlighting-table > tbody');
		for (let ruleData of Rules.extractFromResults(results)) {
			let rulesTableTR = new RulesTableTR(ruleData);
			tbody.appendChild(rulesTableTR.getTR());
		}
		tbody.parentNode.dataset.rulesCount = tbody.childElementCount;
		var sortable = Sortable.create(tbody, {
			handle: '.dragger-mcswagger',
			onUpdate: RulesTable.saveSortOrderFromRulesTable,
		});
		observe(tbody, { childList: true }, (mutationRecords) => {
			let tbody = mutationRecords[0].target;
			tbody.parentNode.dataset.rulesCount = tbody.childElementCount;
		});
	}

	static saveSortOrderFromRulesTable() {
		var trs = qq('tr[data-rule]');
		for (let i = 0, x = trs.length; i < x; i++) {
			Rule.saveProperty(trs[i].dataset.rule, 'sort', i);
		}
	}

	static highlightingModalListener() {
		var tr = this.closest('tr[data-rule]'),
			ruleId = tr.dataset.rule;

		var rule = Global.getItem(ruleId),
			options = {
				dialogTemplate: 'FormDialogTemplate',
				contentsTemplate: this.dataset.form + 'Template',
				content: rule[this.dataset.key],
				fields: {
					FormType: this.dataset.form,
					id: ruleId,
				},
			};

		tr.classList.add('focussed-rule');

		if (this.dataset.form == 'TitleTextIs') {
			options.setup = function () {
				q('[name="is"]').addEventListener('keyup', function () {
					if (this.value.includes('#')) {
						q('.hint').classList.add('show');
					}
				});
			};
		} else if (this.dataset.form == 'ListHighlightColor') {
			options.setup = ListHighlightColorDialog.setup;
		} else if (this.dataset.form == 'MoreOptions') {
			options.setup = (mainDialogContents) => {
				let select = q('select', mainDialogContents),
					rules = Global.getAllRules();

				for (let thisRuleId in rules) {
					if (thisRuleId !== ruleId) {
						let ruleName = rules[thisRuleId].name;
						select.appendChild(
							createElement(
								`<option value="${thisRuleId}">${ruleName}</option>`
							)
						);
					}
				}

				for (let optionName in rule.options) {
					let optionValue = rule.options[optionName];
					if (optionName == 'strikethrough' || optionName == 'grayscale') {
						q(`[name=${optionName}]`, qid('MoreOptionsDialog')).checked =
							optionValue;
					} else if (optionName == 'unmatchedLists' && optionValue) {
						q(`[value="${optionValue}"]`, select).selected = true;
					}
				}
			};
		}

		options.classList = 'rule-related-dialog';

		options.submit = (entries) => {
			return Rule.checkNewRuleEntriesAndSaveOrFail(
				entries,
				Rule.saveEditedRule,
				Rule.failForm
			);
		};

		Dialogue.open(options);
	}

	static enableToggleListener(event) {
		let rule = Global.getItem(this.name);
		if (rule) {
			let tr = this.closest('tr');
			rule.enabled = this.checked;
			tr.classList.toggle('disabled', !this.checked);
			chrome.storage.sync.set({ [rule.id]: rule });
		}
	}

	static deleteButtonListener(event) {
		let tr = this.closest('tr'),
			rule = new Rule(tr.dataset.rule);
		if (
			rule &&
			confirm(`Are you sure you want to delete this rule (${rule.name})?`)
		) {
			rule.delete();
		}
	}

	static deleteRow(ruleId) {
		removeElement(q(`tr[data-rule="${ruleId}"]`));
	}

	static updateRow(ruleId) {
		var rule = Global.getItem(ruleId),
			existingTr = q(`tr[data-rule="${ruleId}"]`),
			rulesTableTR = new RulesTableTR(rule),
			newTr = rulesTableTR.getTR();
		newTr.classList.add('rule-updated');
		existingTr.replaceWith(newTr);
	}
}
