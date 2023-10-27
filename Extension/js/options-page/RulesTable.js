class RulesTable {
	static build(results) {
		const tbody = q('.highlighting-table > tbody');
		for (const ruleData of Rules.extractFromResults(results)) {
			const rulesTableTR = new RulesTableTR(ruleData);
			tbody.appendChild(rulesTableTR.getTR());
		}
		tbody.parentNode.dataset.rulesCount = tbody.childElementCount;
		Sortable.create(tbody, {
			handle: '.dragger-mcswagger',
			onUpdate: RulesTable.saveSortOrderFromRulesTable,
		});
		observe(tbody, { childList: true }, (mutationRecords) => {
			const tbody = mutationRecords[0].target;
			tbody.parentNode.dataset.rulesCount = tbody.childElementCount;
		});
	}

	static saveSortOrderFromRulesTable() {
		const trs = qq('tr[data-rule]');
		for (let i = 0, x = trs.length; i < x; i++) {
			Rule.saveProperty(trs[i].dataset.rule, 'sort', i);
		}
	}

	static highlightingModalListener() {
		const tr = this.closest('tr[data-rule]'),
			ruleId = tr.dataset.rule,
			rule = Global.getItem(ruleId);

		let options = {
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
				const select = q('select', mainDialogContents),
					rules = Global.getAllRules();

				for (const thisRuleId in rules) {
					if (thisRuleId !== ruleId) {
						select.appendChild(
							createElement(
								`<option value="${thisRuleId}">${rules[thisRuleId].name}</option>`
							)
						);
					}
				}

				for (const optionName in rule.options) {
					const optionValue = rule.options[optionName];
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
		const rule = Global.getItem(this.name);
		if (rule) {
			rule.enabled = this.checked;
			this.closest('tr').classList.toggle('disabled', !this.checked);
			chrome.storage.sync.set({ [rule.id]: rule });
		}
	}

	static deleteButtonListener(event) {
		const rule = new Rule(this.closest('tr').dataset.rule);
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
		const rule = Global.getItem(ruleId),
			rulesTableTR = new RulesTableTR(rule),
			newTr = rulesTableTR.getTR();
		newTr.classList.add('rule-updated');
		q(`tr[data-rule="${ruleId}"]`).remove();
		RulesTable.insertNewRowSorted(newTr);
	}

	static insertNewRowSorted(newTr) {
		const tbody = q('.highlighting-table > tbody');
		const allTRs = Array.from(tbody.children);
		allTRs.push(newTr);
		allTRs.sort((a, b) => a.dataset.sort - b.dataset.sort);
		const index = allTRs.indexOf(newTr);
		const followingTR = allTRs[index + 1] || null;
		tbody.insertBefore(newTr, followingTR);
	}
}
