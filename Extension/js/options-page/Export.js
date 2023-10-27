class Export {
	// Create the list of rule checkbox list items and enable/disable the Export button
	static displayRulesToExport() {
		qid('ExportButton').disabled = true;
		chrome.storage.sync.get(null, (storedData) => {
			const rules = Rules.extractFromResults(storedData);
			if (rules) {
				DataSection.createRuleElements(rules, qid('RulesToExport'));
			}
			listen(qq('#Export input'), 'change', Export.toggleExportButton);
			listen(
				qq('#Export .select-all-toggler'),
				'click',
				Export.toggleExportButton
			);
		});
	}

	static toggleExportButton() {
		const neitherRulesNorSettingsIsChecked =
			qq('#ExportRules:checked, #ExportSettings:checked').length == 0;
		const rulesIsChecked = qid('ExportRules').checked === true;
		const noRulesAreChecked =
			qq('#RulesToExport .rule input:checked').length == 0;
		qid('ExportButton').disabled =
			neitherRulesNorSettingsIsChecked || (rulesIsChecked && noRulesAreChecked);
	}

	// Pull the selected rules/settings from storage and export as JSON file
	static export() {
		const rulesToExport = Array.from(
			qq('#RulesToExport input[value^="rule-"]:checked')
		).map((input) => input.value);
		const exportingSettings = qid('ExportSettings').checked;
		const exportingRules = qid('ExportRules').checked;
		chrome.storage.sync.get(null, (storedData) => {
			const exportData = {};
			for (const storedKey in storedData) {
				if (
					exportingSettings &&
					(storedKey.startsWith('options-') || storedKey == 'recentColors')
				) {
					exportData[storedKey] = storedData[storedKey];
				}
				if (exportingRules && rulesToExport.includes(storedKey)) {
					if (storedData[storedKey].id) {
						delete storedData[storedKey].id;
					}
					exportData[storedKey] = storedData[storedKey];
				}
			}
			const name = [
				'ListHighlighterForTrello',
				new Date().toString().substring(4, 21).replace(/[ :]/g, '-'),
			];
			exportingSettings && name.splice(1, 0, 'Settings');
			exportingRules && name.splice(1, 0, 'Rules');
			saveAs(
				new Blob([JSON.stringify(exportData)], {
					type: 'text/json;charset=utf-8',
				}),
				`${name.join('_')}.json`
			);
		});
	}

	static resetForm() {
		Array.from(qq('#ExportRules, #ExportSettings')).forEach(
			(checkbox) => (checkbox.checked = false)
		);
		Export.displayRulesToExport();
	}
}
