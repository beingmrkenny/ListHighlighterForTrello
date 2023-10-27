class RulesTableTR {
	constructor(ruleData) {
		this.rule = new Rule(ruleData);
		this.tr = getTemplate('RuleTrTemplate');
	}

	getTR(thisIsNew = false) {
		this.tr.dataset.rule = this.rule.id;
		this.tr.dataset.sort = this.rule.sort;
		q('[data-form="RuleName"]', this.tr).textContent = this.rule.name;
		this.tr.classList.toggle('disabled', !this.rule.enabled);
		var input = q('.highlighting-option-widget input', this.tr);
		this.prepToggleListener(input);
		this.prepIsCell(q('[data-form="TitleTextIs"]', this.tr));
		this.prepContainsCell(q('[data-form="TitleTextContains"]', this.tr));
		this.prepColorIndicator(q('color-indicator', this.tr));
		this.prepMoreOptions(q('.highlighting-more-options', this.tr));
		listen(input, 'change', RulesTable.enableToggleListener);
		listen(
			qq('.highlighting-modal-trigger', this.tr),
			'click',
			RulesTable.highlightingModalListener
		);
		listen(
			q('button.mod-delete', this.tr),
			'click',
			RulesTable.deleteButtonListener
		);
		if (thisIsNew == true) {
			this.tr.classList.add('rule-updated');
			this.tr.addEventListener('animationend', function () {
				this.classList.remove('rule-updated');
			});
		}
		return this.tr;
	}

	prepToggleListener(input) {
		input.id = this.rule.id;
		input.name = this.rule.id;
		input.checked = this.rule.enabled;
		q('.highlighting-option-widget label', this.tr).setAttribute(
			'for',
			this.rule.id
		);
	}

	getNiceList(terms) {
		let is = '';
		terms.forEach((term, i) => (terms[i] = `<i>${escapeHTML(term)}</i>`));
		if (terms.length == 1) {
			is = terms[0];
		} else if (terms.length > 1) {
			const last = terms.pop();
			is = terms.join(', ') + ' or ' + last;
		}
		return is;
	}

	prepIsCell(isCell) {
		isCell.innerHTML = this.getNiceList(this.rule.is);
	}

	prepContainsCell(containsCell) {
		containsCell.innerHTML = this.getNiceList(this.rule.contains);
	}

	prepColorIndicator(colorIndicator) {
		if (this.rule.highlighting.color) {
			setBackgroundColor(colorIndicator, this.rule.highlighting.color);
		}
		if (this.rule.highlighting.opacity < 1) {
			colorIndicator.style.opacity = this.rule.highlighting.opacity;
			q('color-indicator', this.tr).textContent =
				parseFloat(this.rule.highlighting.opacity * 100).toFixed(0) + '%';
		}
	}

	prepMoreOptions(moreOptions) {
		for (let optionName in this.rule.options) {
			switch (optionName) {
				case 'strikethrough':
					q(
						'.highlighting-more-options-strikethrough',
						moreOptions
					).classList.toggle('enabled', this.rule.options[optionName]);
					break;
				case 'grayscale':
					q(
						'.highlighting-more-options-grayscale',
						moreOptions
					).classList.toggle('enabled', this.rule.options[optionName]);
					break;
				case 'unmatchedLists':
					q(
						'.highlighting-more-options-unmatched',
						moreOptions
					).classList.toggle('enabled', this.rule.options.unmatchedLists);
					break;
			}
		}
	}
}
