class DataSection {
	static setup() {
		qid('ViewDataButton').onclick = DataSection.viewData;
		qid('ResetRules').onclick = DataSection.resetRules;
		qid('DeleteRules').onclick = DataSection.deleteRules;
		qid('ResetSettings').onclick = DataSection.resetSettings;
		qid('ExportButton').onclick = Export.export;
		qid('CancelExportButton').onclick = Export.resetForm;
		qid('CancelImportButton').onclick = Import.resetForm;
		qid('ImportFileInput').onchange = Import.handleUpload;
		Array.from(qq('.select-all-toggler')).forEach(
			(button) => (button.onclick = DataSection.toggleSelect)
		);
	}

	static toggleSelect(event) {
		const button = event.target;
		const inputs = Array.from(
			button
				.closest('.rules-to-port-container')
				.querySelectorAll('.rules-to-port input[type="checkbox"]')
		);
		inputs.forEach((input) => {
			input.checked = button.textContent == 'Select all';
		});
		button.textContent =
			button.textContent == 'Select all' ? 'Unselect all' : 'Select all';
	}

	static viewData(event) {
		if (event.target.textContent == 'Show data') {
			chrome.storage.sync.get(null, (storedData) => {
				qid('DataPanel').textContent = JSON.stringify(storedData, null, 4);
				event.target.textContent = 'Hide data';
			});
		} else {
			qid('DataPanel').textContent = '';
			event.target.textContent = 'Show data';
		}
	}

	static resetRules() {
		if (
			confirm(
				'Are you sure you want to reset your highlighting rules to the default set? This will remove all your existing rules and cannot be undone.'
			)
		) {
			Rules.deleteAll(() => {
				chrome.storage.sync.set(Rules.defaults(), () => {
					DataSection.successMessage(
						qid('ResetRules'),
						'Your rules have been reset'
					);
				});
			});
		}
	}

	static deleteRules() {
		if (
			confirm(
				'Are you sure you want to delete all your highlighting rules? This cannot be undone.'
			)
		) {
			Rules.deleteAll(() => {
				DataSection.successMessage(
					qid('DeleteRules'),
					'All rules have been deleted'
				);
			});
		}
	}

	static resetSettings() {
		if (
			confirm(
				'Are you sure you want to reset your settings to default? This will not affect your highlighting rules. This cannot be undone.'
			)
		) {
			chrome.storage.sync.set(Options.defaults('options-'), () => {
				DataSection.successMessage(
					qid('ResetSettings'),
					'Settings reset to default'
				);
			});
		}
	}

	static resetPage() {
		Export.resetForm();
		Import.resetForm();
	}

	// Create the list items with checkboxes for rules to port
	static createRuleElements(rules, parentElement) {
		const ul = parentElement.querySelector('.rules-to-port');
		ul.replaceChildren();
		rules.sort((a, b) => a.sort - b.sort);
		for (const rule of rules) {
			const classList = 'rule' + (rule.conflict ? ' conflict' : '');
			const id = `${rule.id}-${parentElement.id}`;

			const is = rule.is ? escapeElementContent(rule.is.join(', ')) : '';
			const contains = rule.contains
				? escapeElementContent(rule.contains.join(', '))
				: '';
			const isLabel = is
				? `<span class="rule-criteria rule-is"><strong>is: </strong>${is}</span>`
				: '';
			const containsLabel = contains
				? `<span class="rule-criteria rule-contains"><strong>contains: </strong>${contains}</span>`
				: '';
			const criteriaContainer =
				is || contains
					? `<span class="rule-criteria-container">${isLabel}${containsLabel}</span>`
					: '';

			const conflictLabel = rule.conflict
				? '<span class="conflict-label">!</span>'
				: '';

			const li = createElement(`
				<li class="${classList}">
					<label class="checkbox-option" for="${id}">
						<input
							type="checkbox" id="${id}" name="${id}"
							value="${rule.id}"
							checked>
						<span class="rule-name">${rule.name}</span>
						${criteriaContainer}
						${conflictLabel}
					</label>
				</li>
			`);
			const label = q('label', li);
			label.style.background = rule?.highlighting?.color || null;
			label.style.opacity = rule?.highlighting?.opacity || null;
			label.style.textDecoration = rule?.options?.strikethrough
				? 'line-through'
				: null;
			if (
				typeof storedData == 'undefined' ||
				storedData['options-HighlightChangeTextColor'] === true
			) {
				label.style.color =
					Color.isLight(rule?.highlighting?.color) === false ? '#fff' : null;
			}
			q('input', li).addEventListener('change', (event) => {
				const ul = event.target.closest('ul');
				const inputs = Array.from(qq('input', ul));
				const checked = inputs.filter((input) => input.checked).length;
				const button = q('.select-all-toggler', ul.previousElementSibling);
				if (checked == inputs.length) {
					button.textContent = 'Unselect all';
				} else if (checked == 0) {
					button.textContent = 'Select all';
				}
			});
			ul.appendChild(li);
		}
	}

	static errorMessage(message) {
		Array.from(qq('.error-message')).forEach((div) => div.remove());
		q('[for="ImportFileInput"]').parentNode.before(
			createElement(`<p class="error-message">${message}</p>`)
		);
	}

	static successMessage(after, message) {
		Array.from(qq('.success-message')).forEach((div) => div.remove());
		const element = after.tagName == 'BUTTON' ? 'span' : 'p';
		const messageElement = createElement(
			`<${element} class="success-message">${message}</${element}>`
		);
		after.after(messageElement);
	}
}
