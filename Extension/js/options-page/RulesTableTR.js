class RulesTableTR {

	constructor (ruleData) {
		this.rule = new Rule(ruleData);
		this.tr = getTemplate('RuleTrTemplate');
	}

	getTR (thisIsNew = false) {
		this.tr.dataset.rule = this.rule.id;
		q('[data-form="RuleName"]', this.tr).textContent = this.rule.name;
		this.tr.classList.toggle('disabled', !this.rule.enabled);
		var input = q('.highlighting-option-widget input', this.tr);
		this.prepToggleListener(input);
		this.prepIsCell(q('[data-form="TitleTextIs"]', this.tr));
		this.prepContainsCell(q('[data-form="TitleTextContains"]', this.tr));
		this.prepColorIndicator (q('color-indicator', this.tr));
		this.prepMoreOptions (q('.highlighting-more-options', this.tr));
		listen(input, 'change', RulesTable.enableToggleListener);
		listen(qq('.highlighting-modal-trigger', this.tr), 'click', RulesTable.highlightingModalListener);
		listen(q('button.mod-delete', this.tr), 'click', RulesTable.deleteButtonListener);
		if (thisIsNew == true) {
			this.tr.classList.add('rule-updated');
			this.tr.addEventListener('animationend', function () {
				this.classList.remove('rule-updated');
			});
		}
		return this.tr;
	}

	prepToggleListener (input) {
		input.id = this.rule.id;
		input.name = this.rule.id;
		input.checked = this.rule.enabled;
		q('.highlighting-option-widget label', this.tr).setAttribute('for', this.rule.id);
	}

	prepIsCell(isCell) {
		isCell.textContent = '';
		for (let i = 0, x = this.rule.is.length, or = x-1; i<x; i++) {
			(i == or && i != 0) && isCell.appendChild(document.createTextNode(' or '));
			isCell.appendChild(createElement(`<q>${this.rule.is[i]}</q>`));
			(x>2 && i != or) && isCell.appendChild(document.createTextNode(', '));
		}
	}

	prepContainsCell(containsCell) {
		containsCell.textContent = '';
		for (let i = 0, x = this.rule.contains.length, or = x-1; i<x; i++) {
			(i == or && i != 0) && containsCell.appendChild(document.createTextNode(' or '));
			containsCell.appendChild(createElement(`<q>${this.rule.contains[i]}</q>`));
			(i != or && x > 2) && containsCell.appendChild(document.createTextNode(', '));
		}
	}

	prepColorIndicator (colorIndicator) {
		if (this.rule.highlighting.color) {
			setBackgroundColor(colorIndicator, this.rule.highlighting.color);
		}
		colorIndicator.classList.toggle('mod-has-exceptions', (Object.keys(this.rule.highlighting.exceptions).length > 0));
		if (this.rule.highlighting.opacity < 1) {
			colorIndicator.style.opacity = this.rule.highlighting.opacity;
			q('color-indicator', this.tr).textContent = parseFloat(this.rule.highlighting.opacity * 100).toFixed(0) + '%';
		}
	}

	prepMoreOptions (moreOptions) {
		for (let optionName in this.rule.options) {
			switch (optionName) {
				case 'strikethrough' :
					q('.highlighting-more-options-strikethrough', moreOptions).classList.toggle('enabled', (this.rule.options[optionName]));
					break;
				case 'grayscale' :
					q('.highlighting-more-options-grayscale', moreOptions).classList.toggle('enabled', (this.rule.options[optionName]));
					break;
				case 'unmatchedLists':
					q('.highlighting-more-options-unmatched', moreOptions).classList.toggle('enabled', (this.rule.options.unmatchedLists));
					break;
			}
		}
	}

}
