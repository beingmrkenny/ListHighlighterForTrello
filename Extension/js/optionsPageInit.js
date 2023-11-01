// OptionsPage.showPanel();
OptionsPage.setupDialogs();
// listen(window, 'hashchange', OptionsPage.showPanel);
listen(qq('.standard-options div'), 'click', OptionsPage.checkInputOnClick);
listen(qid('NewRuleButton'), 'click', OptionsPage.openNewRuleForm);
DataSection.setup();

DataStorage.initialise(function (results) {
	document.body.classList.toggle(
		'color-blind-friendly-mode',
		results.colorBlindFriendlyMode
	);
	OptionsPage.setValuesOnInputs(results);
	RulesTable.build(results);
	OptionsPage.setupSaveOptionsOnChange();
	OptionsPage.processAllControllingInputs();
	chrome.storage.onChanged.addListener((changes) => {
		for (let key in changes) {
			var storageChange = changes[key];
			if (key.startsWith('rule-')) {
				if (!storageChange.newValue) {
					RulesTable.deleteRow(key);
				} else {
					if (q(`tr[data-rule="${key}"]`)) {
						if (
							storageChange.newValue.enabled ===
							storageChange?.oldValue?.enabled
						) {
							RulesTable.updateRow(key);
						}
					} else {
						storageChange.newValue.id = key;
						const rulesTableTR = new RulesTableTR(storageChange.newValue);
						RulesTable.insertNewRowSorted(rulesTableTR.getTR(true));
					}
				}
			}
		}
	});
	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);
});
