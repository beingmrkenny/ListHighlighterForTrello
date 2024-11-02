class Import {
	// Read uploaded JSON and send data to the form or display errors
	static handleUpload() {
		const fileInput = qid('ImportFileInput');
		const [file] = fileInput.files;
		if (file) {
			const reader = new FileReader();
			reader.addEventListener(
				'load',
				() => {
					try {
						const importFileData = JSON.parse(reader.result);
						Import.displayImportForm(importFileData);
						fileInput.value = null;
					} catch (error) {
						console.log(error);
						DataSection.errorMessage(
							'The imported file seems to be corrupt. Please try again with a valid import file.'
						);
					}
				},
				false
			);
			reader.addEventListener('error', (event) => {
				DataSection.errorMessage(
					'There was an error trying to load the import file. Please refresh the page and try again.'
				);
			});
			reader.readAsText(file);
		} else {
			DataSection.errorMessage(
				'There was an error trying to load the import file. Please refresh the page and try again.'
			);
		}
	}

	static resetForm() {
		q('#RulesToImport .rules-to-port').replaceChildren();
		Array.from(
			qq('.error-message, .success-message, #ImportRulesConflictsTable')
		).forEach((element) => element.remove());
		Array.from(
			qq(
				'#ImportStageOne, #ImportStageTwo, #ImportStageTwo_Rules, #ImportStageTwo_Settings, #RulesToImportList'
			)
		).forEach((div) => (div.style = null));
		qid('ImportContains').textContent = '';
		qid('ImportStageTwo_Rules').dataset.conflictsExist = 'no';
	}

	// TODO what if the rule is already there — e.g. identical rules

	static findConflicts(rulesInImportFile) {
		const existingRules = Global.getAllRules();
		const returnValue = {
			conflicts: [],
			importRulesWhichConflict: [],
		};
		for (const existingId in existingRules) {
			const existingName = existingRules[existingId].name;
			const existingIs = existingRules[existingId].is;
			const existingContains = existingRules[existingId].contains;
			for (const newId in rulesInImportFile) {
				const newName = rulesInImportFile[newId].name;
				const newIs = rulesInImportFile[newId].is;
				const newContains = rulesInImportFile[newId].contains;

				const nameName = existingName == newName;
				const isIs = newIs.filter((term) => existingIs.includes(term));
				const containsContains = newContains.filter((term) =>
					existingContains.includes(term)
				);
				const isContains = newIs.filter((term) =>
					existingContains.includes(term)
				);
				const containsIs = newContains.filter((term) =>
					existingIs.includes(term)
				);
				let conflictCount =
					(nameName ? 1 : 0) +
					isIs.length +
					containsContains.length +
					isContains.length +
					containsIs.length;
				if (conflictCount > 0) {
					returnValue.importRulesWhichConflict.push(newId);
					returnValue.conflicts.push({
						existingId: existingId,
						existingName: existingName,
						existingIs: existingIs,
						existingContains: existingContains,
						newId: newId,
						newName: newName,
						newIs: newIs,
						newContains: newContains,
						isIs: isIs,
						containsContains: containsContains,
						isContains: isContains,
						containsIs: containsIs,
					});
				}
			}
		}
		return returnValue;
	}

	// Take JSON data and configure import form as appropriate
	static displayImportForm(importFileData) {
		let containsSettings = false,
			containsRules = false,
			rulesToImport = {};

		for (const propName in importFileData) {
			const value = importFileData[propName];
			if (propName.startsWith('options-') || propName == 'recentColors') {
				containsSettings = true;
			}
			if (propName.startsWith('rule-')) {
				rulesToImport[propName] = value;
			}
		}

		qid('ImportStageOne').style.display = 'none';
		qid('ImportStageTwo').style.display = 'block';

		if (containsSettings) {
			qid('ImportStageTwo_Settings').style.display = 'block';
		}

		if (Object.keys(rulesToImport).length) {
			containsRules = true;
			const conflictingRules = Import.findConflicts(rulesToImport);
			const rules = [];
			for (const ruleId in rulesToImport) {
				const rule = rulesToImport[ruleId];
				if (conflictingRules.importRulesWhichConflict.indexOf(ruleId) > -1) {
					rule.conflict = true;
				}
				rules.push(rule);
			}

			if (rules.length) {
				DataSection.createRuleElements(rules, qid('RulesToImport'));
				qid('RulesToImportList').style.display = 'block';
			}

			if (conflictingRules.conflicts.length > 0) {
				qid('ImportStageTwo_Rules').dataset.conflictsExist = 'yes';
				qid('ResolveConflictButton').onclick = () =>
					Import.displayConflictsToChoose(conflictingRules);
			} else {
				qid('ImportStageTwo_Rules').dataset.conflictsExist = 'no';
			}

			qid('ImportStageTwo_Rules').style.display = 'block';
		}

		if (containsRules && !containsSettings) {
			qid('ImportRules').checked = true;
		} else if (!containsRules && containsSettings) {
			qid('ImportSettings').checked = true;
		}

		const contains = [];
		if (containsRules) {
			contains.push('highlighting rules');
		}
		if (containsSettings) {
			contains.push('settings');
		}
		qid('ImportContains').textContent = contains.join(' and ');

		Import.toggleImportButtons();
		Import.setConflictsRelevant();
		q('#RulesToImportList .select-all-toggler').addEventListener(
			'click',
			Import.toggleImportButtons
		);
		listen(
			qq(
				"#ImportRules, #ImportSettings, [name='ImportRulesBehavior'], #RulesToImportList .rule input"
			),
			'change',
			() => {
				Import.setConflictsRelevant();
				Import.toggleImportButtons();
			}
		);
		qid('ImportButton').onclick = () => Import.import(importFileData);
	}

	static toggleImportButtons() {
		const importButton = qid('ImportButton');
		const resolveButton = qid('ResolveConflictButton');
		const neitherRulesNorSettingsIsChecked =
			qq('#ImportRules:checked, #ImportSettings:checked').length == 0;
		const noRulesAreSelected =
			qq('#RulesToImportList .rule input:checked').length == 0;
		const behavior = q('input[name="ImportRulesBehavior"]:checked')?.value;
		const conflictsExist = qid('ImportStageTwo_Rules').dataset.conflictsExist;
		importButton.disabled =
			neitherRulesNorSettingsIsChecked ||
			noRulesAreSelected ||
			!behavior ||
			(behavior === 'append' && conflictsExist == 'yes');

		if (behavior === 'append' && conflictsExist == 'yes') {
			importButton.style.display = 'none';
			resolveButton.style.display = 'inline-block';
		} else {
			importButton.style = null;
			resolveButton.style.display = 'none';
		}
	}

	static setConflictsRelevant() {
		const behavior = q('input[name="ImportRulesBehavior"]:checked')?.value;
		qid('ImportStageTwo_Rules').dataset.conflictsAreRelevant =
			behavior === 'append' ? 'yes' : 'no';
	}

	static displayConflictsToChoose(conflictingRules) {
		// Import.displayConflictsToChoose(conflicts.conflicts);
		// simple conflicts (is/cont is the same for both, e.g. same rule)
		// if one criterion, choose one rule or the other
		// complex conflicts (multiple criteria; is/cont not the same, e.g. different rules;
		// multiple rules conflict, not just 2)
		// one, other, both - but have to choose which rule gets which rules

		Dialogue.open({
			dialogTemplate: 'FormDialogTemplate',
			contentsTemplate: 'ImportRulesConflictsTableTemplate',

			setup: (mainDialogContents) => {
				const table = q('table', mainDialogContents);
				conflictingRules.conflicts.forEach((conflict) => {
					table.appendChild(
						createElement(`
							<tr>
								<td>
									Existing ID: ${conflict.existingId}<br>
									Existing is: ${conflict.existingIs.join(',')}<br>
									Existing contains: ${conflict.existingContains.join(',')}
								</td>
								<td>
									New ID: ${conflict.newId}<br>
									New is: ${conflict.newIs.join(',')}<br>
									New contains: ${conflict.newContains.join(',')}
								</td>
							</tr>
						`)
					);
				});
			},

			submit: (entries) => {
				console.log(entries);
			},
		});
	}

	// Find the rules in storage with the same name and return them
	// Returns an object a la { name: { rule }, etc }
	static findStoredRulesToReplace(storedData, importFileData) {
		const storedRules = {};
		const importedRules = {};
		const storedRulesToReplace = {};
		for (const storedKey in storedData) {
			if (storedKey.startsWith('rule-')) {
				storedRules[storedData[storedKey].name] = storedKey;
			}
		}
		for (const importedKey in importFileData) {
			if (importedKey.startsWith('rule-')) {
				importedRules[importFileData[importedKey].name] = importedKey;
			}
		}
		for (const storedName in storedRules) {
			if (importedRules[storedName]) {
				storedRulesToReplace[storedName] = storedRules[storedName];
			}
		}
		return storedRulesToReplace;
	}

	// Process imported file data and save into storage
	static import(importFileData) {
		const importBehavior = q('[name="ImportRulesBehavior"]:checked').value;
		const importingSettings = qid('ImportSettings').checked;
		const importingRules = qid('ImportRules').checked;
		const ruleKeysToImport = Array.from(
			qq('#RulesToImport input[value^="rule-"]:checked')
		).map((input) => input.value);

		chrome.storage.sync.get(null, (storedData) => {
			const dataToSave = {};
			const keysToRemove = [];

			for (const storedKey in storedData) {
				// Settings are added here (to the array of data to save)
				if (
					importingSettings &&
					(storedKey.startsWith('options-') || storedKey == 'recentColors')
				) {
					dataToSave[storedKey] = importFileData[storedKey];
				}
				if (
					importingRules &&
					importBehavior == 'delete' &&
					storedKey.startsWith('rule-')
				) {
					keysToRemove.push(storedKey);
				}
			}

			if (importingRules) {
				let storedRulesToReplace;
				if (importBehavior == 'replace') {
					storedRulesToReplace = Import.findStoredRulesToReplace(
						storedData,
						importFileData
					);
					keysToRemove.push(...Object.values(storedRulesToReplace));
				}

				let storedDataAsArray;
				let maximumSortValue = 0;
				if (importBehavior != 'delete') {
					storedDataAsArray = Object.entries(storedData);
					maximumSortValue = Math.max.apply(
						null,
						storedDataAsArray
							.map(([, data]) => data.sort || 0)
							.filter((sort) => typeof sort == 'number')
					);
				}

				let storedNames;
				if (importBehavior == 'append') {
					storedNames = storedDataAsArray
						.map(([, data]) => data.name)
						.filter((name) => name || false);
				}

				for (const importedKey in importFileData) {
					if (ruleKeysToImport.includes(importedKey)) {
						const importedRule = importFileData[importedKey];
						let keyToSave = importedKey;

						// TODO add more keys here to delete
						// e.g. conflict
						// do it more like if key isn't in allowed, delete it
						if (importedRule.id) {
							delete importedRule.id;
						}

						if (importBehavior == 'append') {
							keyToSave =
								'rule-' + Rule.getCRC32b(Math.random() * Math.random());
							if (storedNames.includes(importedRule.name)) {
								let proposedName = importedRule.name;
								while (storedNames.includes(proposedName)) {
									let [, number] = proposedName.match(/ ([0-9]+)$/) || [, 1];
									proposedName =
										proposedName.replace(/ [0-9]+$/, '') +
										` ${parseInt(number) + 1}`;
								}
								importedRule.name = proposedName;
							}
							importedRule.sort = importedRule.sort + maximumSortValue;
						}

						if (importBehavior == 'replace') {
							// take the old rule's sort value or create a new sort
							const storedKey = storedRulesToReplace[importedRule.name];
							const newSort = importedRule.sort + maximumSortValue;
							importedRule.sort = storedKey
								? storedData[storedKey].sort || newSort
								: newSort;
						}

						dataToSave[keyToSave] = importedRule;
					}
				}
			}

			if (importingRules && keysToRemove.length) {
				chrome.storage.sync.remove(keysToRemove, () => {
					Import.performImportEtAl(dataToSave);
				});
			} else {
				Import.performImportEtAl(dataToSave);
			}
		});
	}

	// Save data into storage, reset page, setup input values in options, show success message
	static performImportEtAl(dataToSave) {
		chrome.storage.sync.set(dataToSave, () => {
			OptionsPage.setValuesOnInputs(dataToSave);
			DataSection.resetPage();
			const importedContents = [];
			for (const propName in dataToSave) {
				if (
					propName.startsWith('options-') &&
					!importedContents.includes('settings')
				) {
					importedContents.push('settings');
				}
				if (
					propName.startsWith('rule-') &&
					!importedContents.includes('rules')
				) {
					importedContents.push('rules');
				}
			}
			let contents = importedContents.join(' and ');
			const link = contents.includes('rules')
				? '<a href="#Highlighting">View Rules</a>.'
				: '';
			DataSection.successMessage(
				qid('ImportStageOne'),
				`Success! ${
					contents.charAt(0).toUpperCase() + contents.slice(1)
				} have been imported. ${link}`
			);
		});
	}
}
